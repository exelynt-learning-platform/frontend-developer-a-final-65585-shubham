import { Component, inject, OnInit, computed } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

import { Button } from '../../../../shared/components/button/button';
import { InputField } from '../../../../shared/components/input-field/input-field';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { EmployeeForm } from '../../components/employee-form/employee-form';
import { LoadingState } from '../../../../shared/components/loading-state/loading-state';
import { ErrorState } from '../../../../shared/components/error-state/error-state';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

import { EmployeeActions } from '../../../../store/employee/employee.actions';
import {
  selectAllEmployees,
  selectEmployeesLoading,
  selectEmployeesError,
  selectMutationLoading,
  selectMutationError,
  selectSearchResult,
  selectSearchLoading,
  selectSearchError
} from '../../../../store/employee/employee.selectors';

import { CountryActions } from '../../../../store/country/country.actions';
import { selectAllCountries } from '../../../../store/country/country.selectors';

import { Employee, EmployeeFormData } from '../../../../core/models/employee.model';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [Button, InputField, ConfirmDialog, EmployeeForm, LoadingState, ErrorState, EmptyState],
  templateUrl: './employee-dashboard.html',
  styleUrl: './employee-dashboard.scss'
})
export class EmployeeDashboard implements OnInit {
  private store = inject(Store);
  private actions$ = inject(Actions);

  // ===== Store signals (RxJS Observable → Signal) =====
  employees = toSignal(this.store.select(selectAllEmployees), { initialValue: [] });
  loading = toSignal(this.store.select(selectEmployeesLoading), { initialValue: false });
  error = toSignal(this.store.select(selectEmployeesError), { initialValue: null });

  mutationLoading = toSignal(this.store.select(selectMutationLoading), { initialValue: false });
  mutationError = toSignal(this.store.select(selectMutationError), { initialValue: null });

  searchResult = toSignal(this.store.select(selectSearchResult), { initialValue: null });
  searchLoading = toSignal(this.store.select(selectSearchLoading), { initialValue: false });
  searchError = toSignal(this.store.select(selectSearchError), { initialValue: null });

  countries = toSignal(this.store.select(selectAllCountries), { initialValue: [] });

  // ===== UI-only local state =====
  searchIdInput = '';
  formOpen = false;
  editingEmployee: Employee | null = null;
  deleteTarget: Employee | null = null;

  isSearching = computed(() => Boolean(this.searchResult() || this.searchError() || this.searchLoading()));
  displayedEmployees = computed(() => this.searchResult() ? [this.searchResult()!] : this.employees());

  // ← NEW: debounce साठी Subject
  private searchInput$ = new Subject<string>();

  constructor() {
    // Create/Update success झाल्यावर आपोआप dialog बंद करा
    this.actions$.pipe(
      ofType(EmployeeActions.createEmployeeSuccess, EmployeeActions.updateEmployeeSuccess),
      takeUntilDestroyed()
    ).subscribe(() => {
      this.formOpen = false;
      this.editingEmployee = null;
    });

    // Delete success झाल्यावर target clear करा
    this.actions$.pipe(
      ofType(EmployeeActions.deleteEmployeeSuccess),
      takeUntilDestroyed()
    ).subscribe(() => {
      this.deleteTarget = null;
    });

    // ← NEW: Auto-search — टाईप करणं थांबल्यावर 400ms नंतर search होईल
    this.searchInput$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe((value) => {
      const trimmed = value.trim();
      if (trimmed) {
        this.store.dispatch(EmployeeActions.searchEmployee({ id: trimmed }));
      } else {
        this.store.dispatch(EmployeeActions.clearSearch());
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(EmployeeActions.loadEmployees());
    this.store.dispatch(CountryActions.loadCountries());
  }

  reload() {
    this.store.dispatch(EmployeeActions.loadEmployees());
  }

  // ===== Search =====
  onSearchInputChange(value: string) {
    this.searchIdInput = value;
    this.searchInput$.next(value);   // ← प्रत्येक keystroke वर debounce stream मध्ये पाठवतो
  }

  onClearSearch() {
    this.searchIdInput = '';
    this.store.dispatch(EmployeeActions.clearSearch());
  }

  // ===== Add / Edit =====
  onAddEmployee() {
    this.editingEmployee = null;
    this.store.dispatch(EmployeeActions.clearMutationError());
    this.formOpen = true;
  }

  onEdit(emp: Employee) {
    this.editingEmployee = emp;
    this.store.dispatch(EmployeeActions.clearMutationError());
    this.formOpen = true;
  }

  onFormClosed() {
    this.formOpen = false;
    this.editingEmployee = null;
  }

  onFormSubmitted(formData: EmployeeFormData) {
    if (this.editingEmployee) {
      this.store.dispatch(EmployeeActions.updateEmployee({ id: this.editingEmployee.id, changes: formData }));
    } else {
      this.store.dispatch(EmployeeActions.createEmployee({ payload: formData }));
    }
  }

  // ===== Delete =====
  onRequestDelete(emp: Employee) {
    this.deleteTarget = emp;
  }

  onConfirmDelete() {
    if (this.deleteTarget) {
      this.store.dispatch(EmployeeActions.deleteEmployee({ id: this.deleteTarget.id }));
      this.deleteTarget = null;
    }
  }

  onCancelDelete() {
    this.deleteTarget = null;
  }
}