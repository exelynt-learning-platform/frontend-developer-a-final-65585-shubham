import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CountryState } from './country.state';
import { countryAdapter } from './country.reducer';

export const selectCountryState = createFeatureSelector<CountryState>('countries');

const { selectAll } = countryAdapter.getSelectors(selectCountryState);

export const selectAllCountries = selectAll;

export const selectCountriesLoading = createSelector(
  selectCountryState,
  (state) => state.loading
);