import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BaseSearchComponent, Column, Div, Field, GeneratorProperties, InteractionService, TableField } from '@sztyro/core';
import { TilePickerComponent } from '../../tile-picker/tile-picker.component';
import { EventService } from 'src/app/services/event.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-event',
  templateUrl: './../../../../../node_modules/@sztyro/core/src/lib/assets/base-search.component.html',
  styleUrls: ['./../../../../../node_modules/@sztyro/core/src/lib/assets/base-search.component.scss'],
})
export class EventComponent extends BaseSearchComponent implements AfterViewInit{

  interaction = this.injector.get(InteractionService);
  override resource: EventService = this.injector.get(EventService);
  private type:string = null;

  ngAfterViewInit(): void {
    this.route.params.subscribe(params => {
      this.type = params['type'];
      if(this.type === 'All') this.type = null;
      this.generator.getFieldByCondition<TableField>(field => field instanceof TableField).performSearch()
      
    })
    
  }

  override onInstancesReady(instances: Field<any>[]): void {
    let table = instances[0] as TableField;
    if(table != null)
      table.options.onRowClick = row => {
        this.router.navigate(['Events', row.entityType, row.id])
      }
  }

  override create(): void {
    
    this.interaction.openCustomDialog(TilePickerComponent,{ 
      height: 'initial',
      data: {
        title: "Select event type",
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

  override getProperties(): GeneratorProperties<any>[] {
    return [
      Div.tileStandard(
        TableField.create({path: null, options: {
          columns: this.getColumns(this.route.snapshot.data.metadata), 
          class: 'w-100',
          getData: (params) => {
            if(this.type != null)
              params.entityType = this.type
            return this.resource.getAll(params)
          },
        }})
      )
      
    ]
  }

}
