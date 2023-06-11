import { Injectable } from '@angular/core';
import { BaseService } from '../tools/model/baseService';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService extends BaseService<any>{
  override endpoint: string = 'events';
}
