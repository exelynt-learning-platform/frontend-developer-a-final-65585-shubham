import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';

import { EmployeeDashboard } from './employee-dashboard';
import { EmployeeActions } from '../../../../store/employee/employee.actions';
import { selectAllEmployees, selectEmployeesLoading } from '../../../../store/employee/employee.selectors';

describe('EmployeeDashboard', () => {
  let store: MockStore;
  let actions$: Observable<any>;

  const initialState = {
    employees: {
      ids: [],
      entities: {},
      loading: false,
      error: null,
      mutationLoading: false,
      mutationError: null,
      searchResult: null,
      searchLoading: false,
      searchError: null
    },
    countries: {
      ids: [],
      entities: {},
      loading: false,
      error: null
    }
  };

  beforeEach(async () => {
    actions$ = of();

    await TestBed.configureTestingModule({
      imports: [EmployeeDashboard],
      providers: [
        provideMockStore({ initialState }),
        provideMockActions(() => actions$)
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(EmployeeDashboard);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should dispatch loadEmployees and loadCountries on init', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const fixture = TestBed.createComponent(EmployeeDashboard);
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(EmployeeActions.loadEmployees());
  });

  it('should reflect employees from the store via selectAllEmployees', () => {
    const sampleEmployees = [
      { id: '1', name: 'Jane', email: 'jane@x.com', mobile: '9876543210', country: 'India', state: 'MH', district: 'Pune' }
    ];
    store.overrideSelector(selectAllEmployees, sampleEmployees);
    store.refreshState();

    const fixture = TestBed.createComponent(EmployeeDashboard);
    fixture.detectChanges();

    expect(fixture.componentInstance.employees()).toEqual(sampleEmployees);
  });

  it('should reflect loading state from the store', () => {
    store.overrideSelector(selectEmployeesLoading, true);
    store.refreshState();

    const fixture = TestBed.createComponent(EmployeeDashboard);
    fixture.detectChanges();

    expect(fixture.componentInstance.loading()).toBe(true);
  });

  it('should dispatch searchEmployee with trimmed id on onSearch', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const fixture = TestBed.createComponent(EmployeeDashboard);
    fixture.detectChanges();

    fixture.componentInstance.searchIdInput = '  42  ';
    fixture.componentInstance.onSearch();

    expect(dispatchSpy).toHaveBeenCalledWith(EmployeeActions.searchEmployee({ id: '42' }));
  });

  it('should not dispatch searchEmployee when search input is empty', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const fixture = TestBed.createComponent(EmployeeDashboard);
    fixture.detectChanges();
    dispatchSpy.mockClear();

    fixture.componentInstance.searchIdInput = '   ';
    fixture.componentInstance.onSearch();

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: EmployeeActions.searchEmployee.type })
    );
  });

  it('should open the form dialog with no editing employee on onAddEmployee', () => {
    const fixture = TestBed.createComponent(EmployeeDashboard);
    fixture.detectChanges();

    fixture.componentInstance.onAddEmployee();

    expect(fixture.componentInstance.formOpen).toBe(true);
    expect(fixture.componentInstance.editingEmployee).toBeNull();
  });

  it('should open the form dialog with the employee pre-set on onEdit', () => {
    const fixture = TestBed.createComponent(EmployeeDashboard);
    fixture.detectChanges();
    const emp = { id: '1', name: 'Jane', email: 'jane@x.com', mobile: '9876543210', country: 'India', state: 'MH', district: 'Pune' };

    fixture.componentInstance.onEdit(emp);

    expect(fixture.componentInstance.formOpen).toBe(true);
    expect(fixture.componentInstance.editingEmployee).toEqual(emp);
  });

  it('should set deleteTarget on onRequestDelete', () => {
    const fixture = TestBed.createComponent(EmployeeDashboard);
    fixture.detectChanges();
    const emp = { id: '1', name: 'Jane', email: 'jane@x.com', mobile: '9876543210', country: 'India', state: 'MH', district: 'Pune' };

    fixture.componentInstance.onRequestDelete(emp);

    expect(fixture.componentInstance.deleteTarget).toEqual(emp);
  });

  it('should dispatch deleteEmployee and clear deleteTarget on onConfirmDelete', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const fixture = TestBed.createComponent(EmployeeDashboard);
    fixture.detectChanges();
    const emp = { id: '1', name: 'Jane', email: 'jane@x.com', mobile: '9876543210', country: 'India', state: 'MH', district: 'Pune' };
    fixture.componentInstance.deleteTarget = emp;

    fixture.componentInstance.onConfirmDelete();

    expect(dispatchSpy).toHaveBeenCalledWith(EmployeeActions.deleteEmployee({ id: '1' }));
    expect(fixture.componentInstance.deleteTarget).toBeNull();
  });

  it('should clear deleteTarget on onCancelDelete without dispatching', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const fixture = TestBed.createComponent(EmployeeDashboard);
    fixture.detectChanges();
    const emp = { id: '1', name: 'Jane', email: 'jane@x.com', mobile: '9876543210', country: 'India', state: 'MH', district: 'Pune' };
    fixture.componentInstance.deleteTarget = emp;
    dispatchSpy.mockClear();

    fixture.componentInstance.onCancelDelete();

    expect(fixture.componentInstance.deleteTarget).toBeNull();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});