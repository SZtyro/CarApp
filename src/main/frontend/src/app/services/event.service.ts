import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BaseRestService, RestpickerOptions, DateColumn, Column, FilteredResult } from '@sztyro/core';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService extends BaseRestService<any> {
  override endpoint: string = 'api/events';
  override defaultRestpickerOptions: RestpickerOptions = {
    resource: this,
    columns: [new DateColumn('date'), new Column('mileage')]
  };

  override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.getEvent(route.params['id'], route.params['type']);
  }

  override update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.endpoint}/${this.getTypeRouting(data.entityType, true)}${id}`, data)
  }

  override getAll(params?: any): Observable<FilteredResult<any>> {
    let type = params.entityType;
    delete params.entityType;
    return this.http.get<FilteredResult>(`${this.endpoint}/${this.getTypeRouting(type)}`, {params: params})
  }

  override getEditPath(element: any): string {
    return `Events/${element.entityType}/${element.id}`;
  }

  createEvent(initialValues:any, type: Partial<{name: string}>): Observable<any> {
    return this.http.post(`${this.endpoint}/${this.getTypeRouting(type.name)}`, initialValues)
  }

  getEvent(id: number, type: string): Observable<any> {
    return this.http.get(`${this.endpoint}/${this.getTypeRouting(type)}/${id}`)
  }

  getEventTypes(): Observable<object>{
    return this.http.get(`${this.endpoint}/types`)
  }

  getCurrentInsurance(carId: number): Observable<any>{
    return this.getAll({
      'car.id' : carId,
      size: 1,
      entityType: 'pl.sztyro.carapp.model.InsuranceEvent',
      'nextEvent.id': '!null'
    }).pipe(
      switchMap(events => {
        if(events.results.length > 0)
          return this.getEvent(events.results[0].id, 'pl.sztyro.carapp.model.InsuranceEvent')
        else return of(null);
      })
    )
  }

  openCurrentInsurance(carId: number): void{
    this.getCurrentInsurance(carId).subscribe(insurance => {
      if(insurance != null)
        this.router.navigate([this.getEditPath(insurance)])
      else
        this.createEvent({car: {id: carId}}, {name: 'pl.sztyro.carapp.model.InsuranceEvent'}).subscribe(elem => {
          this.router.navigate([this.getEditPath(elem)])
      });
    })
  }

  redirectToEvent(event: any): void{
    this.router.navigate([this.getEditPath(event)]);
  }

  getTireSummary(carId: number): Observable<any>{
    return this.http.get(`${this.endpoint}/type/tireChange/summary/${carId}`)
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
