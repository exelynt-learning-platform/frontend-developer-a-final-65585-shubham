import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeeState } from './employee.state';
import { employeeAdapter } from './employee.reducer';

export const selectEmployeeState = createFeatureSelector<EmployeeState>('employees');

// Entity adapter चे built-in selectors (selectAll, selectEntities, selectIds, selectTotal)
const { selectAll, selectEntities, selectTotal } = employeeAdapter.getSelectors(selectEmployeeState);

export const selectAllEmployees = selectAll;
export const selectEmployeeEntities = selectEntities;
export const selectTotalEmployees = selectTotal;

// List loading/error
export const selectEmployeesLoading = createSelector(
  selectEmployeeState,
  (state) => state.loading
);

export const selectEmployeesError = createSelector(
  selectEmployeeState,
  (state) => state.error
);

// Mutation (create/update/delete) loading/error
export const selectMutationLoading = createSelector(
  selectEmployeeState,
  (state) => state.mutationLoading
);

export const selectMutationError = createSelector(
  selectEmployeeState,
  (state) => state.mutationError
);

// Search by ID
export const selectSearchResult = createSelector(
  selectEmployeeState,
  (state) => state.searchResult
);

export const selectSearchLoading = createSelector(
  selectEmployeeState,
  (state) => state.searchLoading
);

export const selectSearchError = createSelector(
  selectEmployeeState,
  (state) => state.searchError
);