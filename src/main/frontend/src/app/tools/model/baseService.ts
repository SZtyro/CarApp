import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseService<T> {
  abstract endpoint: string;

  constructor(protected http: HttpClient) {}

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.endpoint);
  }

  get(id: number): Observable<T> {
    return this.http.get<T>(`${this.endpoint}/${id}`);
  }

  delete(id:number): Observable<any> {
    return this.http.delete<any>(`${this.endpoint}/${id}`);
  }

  update(id:number, data:T): Observable<T> {
    return this.http.put<T>(`${this.endpoint}/${id}`, data);
  }
}
