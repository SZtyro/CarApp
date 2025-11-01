import { CommonModule } from '@angular/common';
import { Component, ComponentRef, OnInit, ViewChild } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  CoreModule,
  CanvasBackgroundDirective,
  CanvasBackgroundProperties,
  Utils,
  FormElement,
  FormElementBuilder,
  StandardFormComponent,
  // StandardFormComponent,
} from '@sztyro/core';
import * as _ from 'lodash';
import { EventService } from 'src/app/services/event.service';
import { SVGPaths } from './svgPaths';
import { Renderable } from '@sztyro/core/lib/form-builder/interface/renderable';
import { EventFormComponent } from './event-form.component';


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
export class EventConnectionComponent extends FormElement implements OnInit {

  static builder(parent: Renderable): EventConnectionBuilder{
    return new EventConnectionBuilder(EventConnectionComponent, parent)
  }

  @ViewChild(CanvasBackgroundDirective)
  canvasBackground: CanvasBackgroundDirective;

  backgroundProperties: CanvasBackgroundProperties = {
    itemCount: 10,
    scale: 0.1,
    paths: [],
  };

  type: 'previous' | 'next';
  nextEvent: any;
  path: string;


  getLabel(): string {
    return `pl.sztyro.carapp.model.CarEvent.${this.path}`; 
  }


  onClick(): void {
    let id;
    let fr = this.getFormRef() as EventFormComponent;
    if (this.type === 'previous') id = this.getValue()?.id;
    else {
      id = this.nextEvent?.id;
      if(id == null){
        let obj = fr.object();
        fr.resource.create({
          entityType: obj.entityType,
          car: obj.car,
          previousEvent: {
            id: obj.id,
            entityType: obj.entityType
          }
        }).subscribe((created => fr.navigateToEvent(this.type, created.id)))
      }
    }

    if (id != null) fr.navigateToEvent(this.type, id);
  }

  ngOnInit(): void {    
    this.backgroundProperties = {
      ...this.backgroundProperties,
      ...this.backgroundProperties,
    };
    if (this.type === 'next') {
      ((this.getFormRef() as StandardFormComponent).resource as EventService)
        .getNextEvent(this.getFormRef().object().id)
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

  getDate(): number {
    if (this.type === 'previous') return this.getValue()?.date;
    else return this.nextEvent?.date;
  }

  getValue(){
    return _.get(this.getFormRef().object(), this.path);
  }

  assignProperPath() {
    let icons = new Map([
      ['pl.sztyro.carapp.model.RefuelEvent', SVGPaths.REFUEL],
      ['pl.sztyro.carapp.model.TireChangeEvent', SVGPaths.TIRE_CHANGE],
      ['pl.sztyro.carapp.model.InsuranceEvent', SVGPaths.INSURANCE],
      ['pl.sztyro.carapp.model.RepairEvent', SVGPaths.REPAIR],
      ['pl.sztyro.carapp.model.CarCareEvent', SVGPaths.WASH],
    ]);
    this.backgroundProperties.paths = [icons.get(this.getFormRef().object().entityType)];
  }

  edit(): void{
    let parent: EventFormComponent = this.getFormRef() as EventFormComponent;
    parent.editPreviousEvent();
  }

  clear(): void{
    let parent: EventFormComponent = this.getFormRef() as EventFormComponent;
    parent.clearPreviousEvent();
  }

}

export class EventConnectionBuilder extends FormElementBuilder<EventConnectionComponent> {

  type(value: 'previous' | 'next'): EventConnectionBuilder {
    this.instance.type = value;
    return this;
  }

  path(path:string): EventConnectionBuilder {
    this.instance.path = path;
    return this;
  }

  override build(): ComponentRef<EventConnectionComponent> {
    const componentRef = super.build();
    let i = componentRef.instance;
    if(!i.type) {
      if(i.path.includes('previous')) i.type = 'previous';
      else i.type = 'next';
    }
    return componentRef;
  }
}
