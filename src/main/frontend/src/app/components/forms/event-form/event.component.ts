import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BaseSearchComponent, Column, Field, InteractionService, TableField } from '@sztyro/core';
import { TilePickerComponent } from '../../tile-picker/tile-picker.component';
import { EventService } from 'src/app/services/event.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-event',
  templateUrl: './../../../../../node_modules/@sztyro/core/src/lib/assets/base-search.component.html',
  styleUrls: ['./../../../../../node_modules/@sztyro/core/src/lib/assets/base-search.component.scss'],
})
export class EventComponent extends BaseSearchComponent {

  interaction = this.injector.get(InteractionService);
  override resource: EventService = this.injector.get(EventService);

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
      this.resource.createEvent(null, selected).subscribe(created => this.router.navigate(["Events", created.id]));
    });
      
  }

  override getColumns(metadata: any): any[] {
    let columns = super.getColumns(metadata);
    columns.push(new Column('entityType', {
      header: 'pl.sztyro.carapp.model.CarEvent.type',
      isSortingDisabled: () => true,
      getValue: elem => this.translate.instant(`${elem.entityType}.HEADER`)
    }))
    return columns;
  }

}
