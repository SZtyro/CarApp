import { Injectable } from '@angular/core';
import { BaseRestService, Column, RestpickerOptions } from '@sztyro/core';

@Injectable({
  providedIn: 'root'
})
export class TireCompanyService extends BaseRestService {
  override endpoint: string = 'api/tireCompanies';
  override defaultRestpickerOptions: RestpickerOptions = new RestpickerOptions({
    resource: this,
    columns: [new Column('name')]
  });;


}
