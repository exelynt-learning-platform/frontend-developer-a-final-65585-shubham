import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { EmployeeApi } from './employee-api';
import { Employee, EmployeeFormData } from '../models/employee.model';

describe('EmployeeApi', () => {
  let service: EmployeeApi;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/employee';

  const sampleEmployee: Employee = {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    mobile: '9876543210',
    country: 'India',
    state: 'Maharashtra',
    district: 'Pune'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmployeeApi,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(EmployeeApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // कोणतीही unexpected/pending request राहिली नाही ना ते check करतो
  });

  it('should fetch all employees via GET', () => {
    service.getAll().subscribe((employees) => {
      expect(employees).toEqual([sampleEmployee]);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush([sampleEmployee]);
  });

  it('should fetch a single employee by id via GET', () => {
    service.getById('1').subscribe((employee) => {
      expect(employee).toEqual(sampleEmployee);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(sampleEmployee);
  });

  it('should create an employee via POST', () => {
    const payload: EmployeeFormData = {
      name: 'New Emp',
      email: 'new@example.com',
      mobile: '9999999999',
      country: 'India',
      state: 'MH',
      district: 'Pune'
    };

    service.create(payload).subscribe((employee) => {
      expect(employee.name).toBe('New Emp');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: '2', ...payload });
  });

  it('should update an employee via PUT', () => {
    const changes: EmployeeFormData = { ...sampleEmployee, name: 'Updated Name' };

    service.update('1', changes).subscribe((employee) => {
      expect(employee.name).toBe('Updated Name');
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({ id: '1', ...changes });
  });

  it('should delete an employee via DELETE', () => {
    service.remove('1').subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});