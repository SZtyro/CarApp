import { Injectable } from '@angular/core';
import { BaseRestService, RestpickerOptions, DateColumn, Column, FilteredResult } from '@sztyro/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService extends BaseRestService<any> {
  override endpoint: string = 'api/events';
  override defaultRestpickerOptions: RestpickerOptions = {
    resource: this,
    columns: [new DateColumn('date'), new Column('mileage')]
  };

  createEvent(initialValues:any, type: Partial<{name: string}>): Observable<any> {
    return this.http.post(`${this.endpoint}/${this.getTypeRouting(type.name)}`, initialValues)
  }

  override update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.endpoint}/${this.getTypeRouting(data.entityType, true)}${id}`, data)
  }

  override getAll(params?: any): Observable<FilteredResult<any>> {
    let type = params.entityType;
    delete params.entityType;
    return this.http.get<FilteredResult>(`${this.endpoint}/${this.getTypeRouting(type)}`, {params: params})
  }

  getEventTypes(): Observable<object>{
    return this.http.get(`${this.endpoint}/types`)
  }

  private getTypeRouting(entityType, addDash?:boolean): string{
    let type: string = "";
    if(entityType != null){
      type = entityType.replace('.HEADER', '');
      let parts = type.split('.');
      type = parts[parts.length - 1];
      if(type != 'CarEvent'){
        type = type.replace("Event", "");
        type = type[0].toLowerCase() + type.substring(1);
        type = `type/${type}`;
        if(addDash) type += '/';
      } 
    }

    return type;
  }
}
