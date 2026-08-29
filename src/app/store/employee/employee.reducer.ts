import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter } from '@ngrx/entity';
import { Employee } from '../../core/models/employee.model';
import { EmployeeState } from './employee.state';
import { EmployeeActions } from './employee.actions';

export const employeeAdapter = createEntityAdapter<Employee>();

export const initialState: EmployeeState = employeeAdapter.getInitialState({
  loading: false,
  error: null,

  mutationLoading: false,
  mutationError: null,

  searchResult: null,
  searchLoading: false,
  searchError: null
});

export const employeeReducer = createReducer(
  initialState,

  // ===== Load All =====
  on(EmployeeActions.loadEmployees, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(EmployeeActions.loadEmployeesSuccess, (state, { employees }) =>
    employeeAdapter.setAll(employees, { ...state, loading: false })
  ),
  on(EmployeeActions.loadEmployeesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // ===== Search by ID =====
  on(EmployeeActions.searchEmployee, (state) => ({
    ...state,
    searchLoading: true,
    searchError: null,
    searchResult: null
  })),
  on(EmployeeActions.searchEmployeeSuccess, (state, { employee }) => ({
    ...state,
    searchLoading: false,
    searchResult: employee
  })),
  on(EmployeeActions.searchEmployeeFailure, (state, { error }) => ({
    ...state,
    searchLoading: false,
    searchResult: null,
    searchError: error
  })),
  on(EmployeeActions.clearSearch, (state) => ({
    ...state,
    searchResult: null,
    searchError: null,
    searchLoading: false
  })),

  // ===== Create =====
  on(EmployeeActions.createEmployee, (state) => ({
    ...state,
    mutationLoading: true,
    mutationError: null
  })),
  on(EmployeeActions.createEmployeeSuccess, (state, { employee }) =>
    employeeAdapter.addOne(employee, { ...state, mutationLoading: false })
  ),
  on(EmployeeActions.createEmployeeFailure, (state, { error }) => ({
    ...state,
    mutationLoading: false,
    mutationError: error
  })),

  // ===== Update =====
  on(EmployeeActions.updateEmployee, (state) => ({
    ...state,
    mutationLoading: true,
    mutationError: null
  })),
  on(EmployeeActions.updateEmployeeSuccess, (state, { employee }) =>
    employeeAdapter.upsertOne(employee, { ...state, mutationLoading: false })
  ),
  on(EmployeeActions.updateEmployeeFailure, (state, { error }) => ({
    ...state,
    mutationLoading: false,
    mutationError: error
  })),

  // ===== Delete =====
  on(EmployeeActions.deleteEmployee, (state) => ({
    ...state,
    mutationLoading: true,
    mutationError: null
  })),
  on(EmployeeActions.deleteEmployeeSuccess, (state, { id }) =>
    employeeAdapter.removeOne(id, { ...state, mutationLoading: false })
  ),
  on(EmployeeActions.deleteEmployeeFailure, (state, { error }) => ({
    ...state,
    mutationLoading: false,
    mutationError: error
  })),

  // ===== UI-only =====
  on(EmployeeActions.clearMutationError, (state) => ({
    ...state,
    mutationError: null
  }))
);