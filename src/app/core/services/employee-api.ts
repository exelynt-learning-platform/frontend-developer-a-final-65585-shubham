import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, EmployeeFormData } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/employee';

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseUrl);
  }

  getById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`);
  }

  create(payload: EmployeeFormData): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, payload);
  }

  update(id: string, changes: EmployeeFormData): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/${id}`, changes);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}