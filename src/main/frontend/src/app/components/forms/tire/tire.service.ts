import { Injectable } from '@angular/core';
import { BaseRestService, Column, RestpickerOptions } from '@sztyro/core';

@Injectable({
  providedIn: 'root'
})
export class TireService extends BaseRestService {
  override endpoint: string = 'api/tires';
  override defaultRestpickerOptions: RestpickerOptions = {
    columns: [
      new Column('model.company.name', {header: 'pl.sztyro.carapp.model.TireCompany.name'}),
      new Column('model.name', {header: 'pl.sztyro.carapp.model.TireModel.name'}),
      new Column('tireWidth', {header: 'pl.sztyro.carapp.model.Tire.tireWidth'}),
      new Column('aspectRatio', {header: 'pl.sztyro.carapp.model.Tire.aspectRatio'}),
      new Column('diameter', {header: 'pl.sztyro.carapp.model.Tire.diameter', getValue: e => `R${e.diameter}`}),
      new Column('loadRating', {header: 'pl.sztyro.carapp.model.Tire.loadRating'}),
      new Column('speedRating', {header: 'pl.sztyro.carapp.model.Tire.speedRating'}),
      new Column('placement', {header: 'pl.sztyro.carapp.model.Tire.placement', translate: true}),
      new Column('model.type', {header: 'pl.sztyro.carapp.model.TireModel.type', translate: true}),

    ],
    resource: this,
    showValue: e => `${this.translate.instant(e.placement)} - ${e.entityDescription}`,
    multiple: true
  };

  
}
