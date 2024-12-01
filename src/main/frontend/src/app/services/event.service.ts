import { Injectable } from '@angular/core';
import { BaseRestService, RestpickerOptions, DateColumn, Column } from '@sztyro/core';
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
    return this.http.put(`${this.endpoint}/${this.getTypeRouting(data.entityType)}${id}`, data)
  }

  getEventTypes(): Observable<object>{
    return this.http.get(`${this.endpoint}/types`)
  }

  private getTypeRouting(entityType): string{
    let type: string = entityType.replace('.HEADER', '');
    let parts = type.split('.');
    type = parts[parts.length - 1];
    if(type != 'CarEvent'){
      type = type.replace("Event", "");
      type = type[0].toLowerCase() + type.substring(1);
      type = `type/${type}/`;
    } else {
    type = '';
    }

    return type;
  }
}
