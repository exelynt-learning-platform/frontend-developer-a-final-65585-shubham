import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter } from '@ngrx/entity';
import { Country } from '../../core/models/country.model';
import { CountryState } from './country.state';
import { CountryActions } from './country.actions';

export const countryAdapter = createEntityAdapter<Country>();

export const initialState: CountryState = countryAdapter.getInitialState({
  loading: false,
  error: null
});

export const countryReducer = createReducer(
  initialState,

  on(CountryActions.loadCountries, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CountryActions.loadCountriesSuccess, (state, { countries }) =>
    countryAdapter.setAll(countries, { ...state, loading: false })
  ),
  on(CountryActions.loadCountriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);