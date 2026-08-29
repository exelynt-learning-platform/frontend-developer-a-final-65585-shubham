import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Actions } from '@ngrx/effects';
import { Observable, of, throwError, firstValueFrom } from 'rxjs';

import { EmployeeEffects } from './employee.effects';
import { EmployeeActions } from './employee.actions';
import { EmployeeApi } from '../../core/services/employee-api';
import { Employee } from '../../core/models/employee.model';

describe('EmployeeEffects', () => {
  let actions$: Observable<any>;
  let employeeApiSpy: {
    getAll: any;
    getById: any;
    create: any;
    update: any;
    remove: any;
  };

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
    employeeApiSpy = {
      getAll: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      remove: vi.fn()
    };
  });

  function setup() {
    TestBed.configureTestingModule({
      providers: [
        EmployeeEffects,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: EmployeeApi, useValue: employeeApiSpy },
        { provide: Actions, useFactory: () => actions$ }
      ]
    });
    return TestBed.inject(EmployeeEffects);
  }

  it('should dispatch loadEmployeesSuccess on successful API call', async () => {
    employeeApiSpy.getAll.mockReturnValue(of([sampleEmployee]));
    actions$ = of(EmployeeActions.loadEmployees());

    const effects = setup();
    const result = await firstValueFrom(effects.loadEmployees$);

    expect(result).toEqual(
      EmployeeActions.loadEmployeesSuccess({ employees: [sampleEmployee] })
    );
  });

  it('should dispatch loadEmployeesFailure when API call fails', async () => {
    employeeApiSpy.getAll.mockReturnValue(
      throwError(() => ({ error: { message: 'Network error' } }))
    );
    actions$ = of(EmployeeActions.loadEmployees());

    const effects = setup();
    const result = await firstValueFrom(effects.loadEmployees$);

    expect(result.type).toBe(EmployeeActions.loadEmployeesFailure.type);
  });

  it('should dispatch createEmployeeSuccess on successful create', async () => {
    employeeApiSpy.create.mockReturnValue(of(sampleEmployee));
    actions$ = of(
      EmployeeActions.createEmployee({
        payload: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          mobile: '9876543210',
          country: 'India',
          state: 'Maharashtra',
          district: 'Pune'
        }
      })
    );

    const effects = setup();
    const result = await firstValueFrom(effects.createEmployee$);

    expect(result).toEqual(EmployeeActions.createEmployeeSuccess({ employee: sampleEmployee }));
  });

  it('should dispatch deleteEmployeeSuccess with the correct id on successful delete', async () => {
    employeeApiSpy.remove.mockReturnValue(of(undefined));
    actions$ = of(EmployeeActions.deleteEmployee({ id: '1' }));

    const effects = setup();
    const result = await firstValueFrom(effects.deleteEmployee$);

    expect(result).toEqual(EmployeeActions.deleteEmployeeSuccess({ id: '1' }));
  });

  it('should dispatch searchEmployeeFailure with "not found" message on 404', async () => {
    employeeApiSpy.getById.mockReturnValue(
      throwError(() => ({ status: 404 }))
    );
    actions$ = of(EmployeeActions.searchEmployee({ id: '999' }));

    const effects = setup();
    const result = await firstValueFrom(effects.searchEmployee$);

    expect(result.type).toBe(EmployeeActions.searchEmployeeFailure.type);
    if (result.type === EmployeeActions.searchEmployeeFailure.type) {
      expect((result as any).error).toBe('Employee not found');
    }
  });
});