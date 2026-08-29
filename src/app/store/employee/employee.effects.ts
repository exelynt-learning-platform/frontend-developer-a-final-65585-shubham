import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of } from 'rxjs';
import { EmployeeApi } from '../../core/services/employee-api';
import { EmployeeActions } from './employee.actions';

@Injectable()
export class EmployeeEffects {
  private actions$ = inject(Actions);
  private employeeApi = inject(EmployeeApi);

  // ===== Load All =====
  loadEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployees),
      switchMap(() =>
        this.employeeApi.getAll().pipe(
          map((employees) => EmployeeActions.loadEmployeesSuccess({ employees })),
          catchError((error) =>
            of(EmployeeActions.loadEmployeesFailure({ error: this.extractError(error) }))
          )
        )
      )
    )
  );

  // ===== Search by ID =====
  searchEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.searchEmployee),
      switchMap(({ id }) =>
        this.employeeApi.getById(id).pipe(
          map((employee) => EmployeeActions.searchEmployeeSuccess({ employee })),
          catchError((error) =>
            of(EmployeeActions.searchEmployeeFailure({ error: this.extractError(error) }))
          )
        )
      )
    )
  );

  // ===== Create =====
  createEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.createEmployee),
      switchMap(({ payload }) =>
        this.employeeApi.create(payload).pipe(
          map((employee) => EmployeeActions.createEmployeeSuccess({ employee })),
          catchError((error) =>
            of(EmployeeActions.createEmployeeFailure({ error: this.extractError(error) }))
          )
        )
      )
    )
  );

  // ===== Update =====
  updateEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.updateEmployee),
      switchMap(({ id, changes }) =>
        this.employeeApi.update(id, changes).pipe(
          map((employee) => EmployeeActions.updateEmployeeSuccess({ employee })),
          catchError((error) =>
            of(EmployeeActions.updateEmployeeFailure({ error: this.extractError(error) }))
          )
        )
      )
    )
  );

  // ===== Delete =====
  deleteEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.deleteEmployee),
      switchMap(({ id }) =>
        this.employeeApi.remove(id).pipe(
          map(() => EmployeeActions.deleteEmployeeSuccess({ id })),
          catchError((error) =>
            of(EmployeeActions.deleteEmployeeFailure({ error: this.extractError(error) }))
          )
        )
      )
    )
  );

  // Common error message extractor
 private extractError(error: unknown): string {
  if (error && typeof error === 'object') {
    const httpError = error as { status?: number; message?: string; error?: { message?: string } };

    if (httpError.status === 404) {
      return 'Employee not found';
    }

    return httpError.error?.message || httpError.message || 'Something went wrong. Please try again.';
  }
  return 'Something went wrong. Please try again.';
}
}