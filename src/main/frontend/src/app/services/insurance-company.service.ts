import { Injectable } from '@angular/core';
import { BaseRestService, Column, RestpickerOptions } from '@sztyro/core';

@Injectable({
  providedIn: 'root'
})
export class InsuranceCompanyService extends BaseRestService {
  override endpoint: string = 'api/insuranceCompanies';
  override defaultRestpickerOptions: RestpickerOptions = new RestpickerOptions({
    resource: this,
    columns: [new Column('name')]
  });;


}
