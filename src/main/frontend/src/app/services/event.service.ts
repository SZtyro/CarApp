import { Injectable } from '@angular/core';
import { BaseRestService, RestpickerOptions, DateColumn, Column } from '@sztyro/core';

@Injectable({
  providedIn: 'root',
})
export class EventService extends BaseRestService<any> {
  override endpoint: string = 'api/events';
  override defaultRestpickerOptions: RestpickerOptions = {
    resource: this,
    columns: [new DateColumn('date'), new Column('mileage')]
  };

}
