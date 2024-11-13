import { Injectable } from '@angular/core';
import { BaseRestService, RestpickerOptions, Column } from '@sztyro/core';

@Injectable({
  providedIn: 'root',
})
export class CarService extends BaseRestService<any> {
  override endpoint: string = 'api/cars';
  override defaultRestpickerOptions: RestpickerOptions = new RestpickerOptions({
    resource: this,
    columns: [new Column('name')]
  });
}
