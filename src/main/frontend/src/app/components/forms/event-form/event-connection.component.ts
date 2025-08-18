import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  CoreModule,
  Field,
  FieldProperties,
  GeneratorProperties,
  InstanceProperties,
  CanvasBackgroundDirective,
  CanvasBackgroundProperties,
  Utils,
} from '@sztyro/core';
import * as _ from 'lodash';
import { EventFormComponent } from './event-form.component';
import { EventService } from 'src/app/services/event.service';
import { SVGPaths } from './svgPaths';

export class EventConnectionProperties extends FieldProperties {
  type?: 'previous' | 'next' = 'previous';
  backgroundProperties?: CanvasBackgroundProperties;
  parent: EventFormComponent;
}

@Component({
  selector: 'app-event-connection',
  standalone: true,
  imports: [
    CoreModule,
    TranslateModule,
    MatRippleModule,
    CommonModule,
    CanvasBackgroundDirective,
  ],
  templateUrl: './event-connection.component.html',
  styleUrl: './event-connection.component.scss',
})
export class EventConnectionComponent
  extends Field<EventConnectionProperties>
  implements OnInit
{
  @ViewChild(CanvasBackgroundDirective)
  canvasBackground: CanvasBackgroundDirective;

  backgroundProperties: CanvasBackgroundProperties = {
    itemCount: 10,
    scale: 0.1,
    paths: [],
  };

  nextEvent: any;

  static override create(
    options: InstanceProperties<EventConnectionProperties>
  ): GeneratorProperties<EventConnectionProperties> {
    let p = new EventConnectionProperties();

    options.options = { ...p, ...options.options };
    return {
      type: EventConnectionComponent,
      config: options,
    };
  }

  override getLabel(): string {
    let l = super.getLabel();
    let splitted = l.split('.');
    return 'pl.sztyro.carapp.model.CarEvent.' + splitted[splitted.length - 1]; 
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  onClick(): void {
    let id;
    if (this.options.type === 'previous') id = this.getValue()?.id;
    else {
      id = this.nextEvent?.id;
      if(id == null){
        let obj = this.options.parent.object;
        this.options.parent.resource.create({
          entityType: obj.entityType,
          car: obj.car,
          previousEvent: {
            id: obj.id,
            entityType: obj.entityType
          }
        }).subscribe((created => this.options.parent.navigateToEvent(this.options.type, created.id)))
      }
    }

    if (id != null) this.options.parent.navigateToEvent(this.options.type, id);
  }

  initTile() {
    this.backgroundProperties = {
      ...this.backgroundProperties,
      ...this.options.backgroundProperties,
    };
    if (this.options.type === 'next') {
      (this.options.parent.resource as EventService)
        .getNextEvent(this.options.parent.object.id)
        .subscribe((events) => {
          if (events.results.length > 0) {
            this.nextEvent = events.results[0];
            this.assignProperPath()
          } else {
            this.nextEvent = null;
            this.backgroundProperties.paths = [Utils.SVG.plus];
            
          }
          this.canvasBackground.generateBackground();
        });
    } else {
      this.assignProperPath();
      setTimeout(() => this.canvasBackground.generateBackground());
    }
  }

  getDate() {
    if (this.options.type === 'previous') return this.getValue()?.date;
    else return this.nextEvent?.date;
  }

  assignProperPath() {
    let icons = new Map([
      ['pl.sztyro.carapp.model.RefuelEvent', SVGPaths.REFUEL],
      ['pl.sztyro.carapp.model.TireChangeEvent', SVGPaths.TIRE_CHANGE],
      ['pl.sztyro.carapp.model.InsuranceEvent', SVGPaths.INSURANCE],
      ['pl.sztyro.carapp.model.RepairEvent', SVGPaths.REPAIR],
      ['pl.sztyro.carapp.model.CarCareEvent', SVGPaths.WASH],
    ]);
    this.backgroundProperties.paths = [icons.get(this.options.parent.object.entityType)];
  }

  edit(): void{
    let parent: EventFormComponent = this.options.parent;
    parent.editPreviousEvent();
  }

  clear(): void{
    let parent: EventFormComponent = this.options.parent;
    parent.clearPreviousEvent();
  }

  override assignValueToField(): void {
    super.assignValueToField();
    this.initTile();
  }
}
