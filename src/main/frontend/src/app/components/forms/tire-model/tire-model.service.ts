import { Injectable } from '@angular/core';
import { BaseRestService, Column, RestpickerOptions } from '@sztyro/core';

@Injectable({
  providedIn: 'root'
})
export class TireModelService extends BaseRestService{

  override endpoint: string = 'api/tireModels';
  override defaultRestpickerOptions: RestpickerOptions = new RestpickerOptions({
    resource: this,
    showValue: e => `${e.company?.name} ${e.name}`,
    columns: [
      new Column('name'),
      new Column('company.name', {header: 'pl.sztyro.carapp.model.TireCompany.name'}),
    ] 
  });

}
