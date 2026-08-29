import { employeeReducer, initialState, employeeAdapter } from './employee.reducer';
import { EmployeeActions } from './employee.actions';
import { Employee } from '../../core/models/employee.model';

describe('employeeReducer', () => {
  const sampleEmployee: Employee = {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    mobile: '9876543210',
    country: 'India',
    state: 'Maharashtra',
    district: 'Pune'
  };

  it('should return the initial state for an unknown action', () => {
    const action = { type: 'UNKNOWN' };
    const state = employeeReducer(initialState, action as any);
    expect(state).toBe(initialState);
  });

  // ===== Load All =====
  it('should set loading true on loadEmployees', () => {
    const state = employeeReducer(initialState, EmployeeActions.loadEmployees());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should populate entities on loadEmployeesSuccess', () => {
    const state = employeeReducer(
      initialState,
      EmployeeActions.loadEmployeesSuccess({ employees: [sampleEmployee] })
    );
    expect(state.loading).toBe(false);
    expect(state.ids).toEqual(['1']);
    expect(state.entities['1']).toEqual(sampleEmployee);
  });

  it('should set error on loadEmployeesFailure', () => {
    const state = employeeReducer(
      initialState,
      EmployeeActions.loadEmployeesFailure({ error: 'Network error' })
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network error');
  });

  // ===== Search =====
  it('should set searchResult on searchEmployeeSuccess', () => {
    const state = employeeReducer(
      initialState,
      EmployeeActions.searchEmployeeSuccess({ employee: sampleEmployee })
    );
    expect(state.searchResult).toEqual(sampleEmployee);
    expect(state.searchLoading).toBe(false);
  });

  it('should set searchError and clear searchResult on searchEmployeeFailure', () => {
    const state = employeeReducer(
      initialState,
      EmployeeActions.searchEmployeeFailure({ error: 'Employee not found' })
    );
    expect(state.searchResult).toBeNull();
    expect(state.searchError).toBe('Employee not found');
  });

  it('should clear search state on clearSearch', () => {
    const stateWithSearch = employeeReducer(
      initialState,
      EmployeeActions.searchEmployeeSuccess({ employee: sampleEmployee })
    );
    const state = employeeReducer(stateWithSearch, EmployeeActions.clearSearch());
    expect(state.searchResult).toBeNull();
    expect(state.searchError).toBeNull();
  });

  // ===== Create =====
  it('should add a new employee on createEmployeeSuccess', () => {
    const state = employeeReducer(
      initialState,
      EmployeeActions.createEmployeeSuccess({ employee: sampleEmployee })
    );
    expect(state.ids).toEqual(['1']);
    expect(state.mutationLoading).toBe(false);
  });

  // ===== Update =====
  it('should update an existing employee on updateEmployeeSuccess', () => {
    const loadedState = employeeReducer(
      initialState,
      EmployeeActions.loadEmployeesSuccess({ employees: [sampleEmployee] })
    );
    const updated = { ...sampleEmployee, name: 'Jane Updated' };
    const state = employeeReducer(
      loadedState,
      EmployeeActions.updateEmployeeSuccess({ employee: updated })
    );
    expect(state.entities['1']?.name).toBe('Jane Updated');
  });

  // ===== Delete =====
  it('should remove an employee on deleteEmployeeSuccess', () => {
    const loadedState = employeeReducer(
      initialState,
      EmployeeActions.loadEmployeesSuccess({ employees: [sampleEmployee] })
    );
    const state = employeeReducer(
      loadedState,
      EmployeeActions.deleteEmployeeSuccess({ id: '1' })
    );
    expect(state.ids).toEqual([]);
    expect(state.entities['1']).toBeUndefined();
  });

  it('should set mutationError on deleteEmployeeFailure without removing the employee', () => {
    const loadedState = employeeReducer(
      initialState,
      EmployeeActions.loadEmployeesSuccess({ employees: [sampleEmployee] })
    );
    const state = employeeReducer(
      loadedState,
      EmployeeActions.deleteEmployeeFailure({ error: 'Delete failed' })
    );
    expect(state.mutationError).toBe('Delete failed');
    expect(state.ids).toEqual(['1']); // अजूनही present
  });
});