import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Employee, EmployeeFormData } from '../../core/models/employee.model';

export const EmployeeActions = createActionGroup({
  source: 'Employee',
  events: {
    // Load all employees
    'Load Employees': emptyProps(),
    'Load Employees Success': props<{ employees: Employee[] }>(),
    'Load Employees Failure': props<{ error: string }>(),

    // Search by ID
    'Search Employee': props<{ id: string }>(),
    'Search Employee Success': props<{ employee: Employee }>(),
    'Search Employee Failure': props<{ error: string }>(),
    'Clear Search': emptyProps(),

    // Create
    'Create Employee': props<{ payload: EmployeeFormData }>(),
    'Create Employee Success': props<{ employee: Employee }>(),
    'Create Employee Failure': props<{ error: string }>(),

    // Update
    'Update Employee': props<{ id: string; changes: EmployeeFormData }>(),
    'Update Employee Success': props<{ employee: Employee }>(),
    'Update Employee Failure': props<{ error: string }>(),

    // Delete
    'Delete Employee': props<{ id: string }>(),
    'Delete Employee Success': props<{ id: string }>(),
    'Delete Employee Failure': props<{ error: string }>(),

    // UI-only
    'Clear Mutation Error': emptyProps()
  }
});