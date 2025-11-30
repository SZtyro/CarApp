import { Component, HostListener, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BaseSearchComponent, Column, FieldBuilder, FormElementBuilder, formImports, InteractionService } from '@sztyro/core';
import { map, switchMap } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { TilePickerComponent } from '../../tile-picker/tile-picker.component';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [formImports, MatButtonModule],
  templateUrl: './../../../../../node_modules/@sztyro/core/src/lib/assets/base-search.component.html',
  styleUrls: ['./../../../../../node_modules/@sztyro/core/src/lib/assets/form.component.scss'],
})
export class EventComponent extends BaseSearchComponent implements OnInit{

  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    event.target.innerWidth < 768 ? this.mobileView = true : this.mobileView = false;
  }

  mobileView: boolean = false;
  override resource: EventService = inject(EventService);
  interaction = inject(InteractionService)

  override create(): void {
    
    this.interaction.openCustomDialog(TilePickerComponent,{ 
      height: 'initial',
      data: {
        title: "Select event type",
        parent: this,
        data$: this.resource
          .getEventTypes()
          .pipe(
            map((eventTypes) => 
              Object.keys(eventTypes).map((key) => {
                return {icon: eventTypes[key], name: `${key}.HEADER`};
              })
              
            )
          )
      }
    }).subscribe(selected => {
      this.resource.createEvent(null, selected).subscribe(created => this.resource.redirectToEvent(created));
    });
      
  }

  override getColumns(metadata: any): any[] {
    return [
      ...super.getColumns(metadata),
      new Column('entityType', {
        header: 'pl.sztyro.carapp.model.CarEvent.type',
        isSortingDisabled: () => true,
        getValue: elem => this.translate.instant(`${elem.entityType}.HEADER`)
      })
    ];
  }

  protected override template(builder: FieldBuilder): FormElementBuilder<any>[] {
      return [
        builder.standardTile(t => [
        t.table()
          .columns(...this.getColumns(this.metadata))
          .resource(this.resource)
          .data(params => this.route.paramMap.pipe(
            switchMap(paramMap => this.resource.getAll({...params, ...{entityType: paramMap.get('type')}}))
          ))  
      ])
      ]
  }

  override ngOnInit(): void {
    super.ngOnInit();
    window.innerWidth < 768 ? this.mobileView = true : this.mobileView = false;
  }
}
  