import { Injectable } from '@angular/core';
import { BaseRestService, Column, RestpickerOptions } from '@sztyro/core';

@Injectable({
  providedIn: 'root'
})
export class TireService extends BaseRestService {
  override endpoint: string = 'api/tires';
  override defaultRestpickerOptions: RestpickerOptions = {
    columns: [
      new Column('name')
    ],
    resource: this
  };

  
}
