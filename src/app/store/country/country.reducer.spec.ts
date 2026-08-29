import { countryReducer, initialState } from './country.reducer';
import { CountryActions } from './country.actions';
import { Country } from '../../core/models/country.model';

describe('countryReducer', () => {
  const sampleCountries: Country[] = [
    { id: '1', name: 'India' },
    { id: '2', name: 'USA' }
  ];

  it('should return the initial state for an unknown action', () => {
    const state = countryReducer(initialState, { type: 'UNKNOWN' } as any);
    expect(state).toBe(initialState);
  });

  it('should set loading true on loadCountries', () => {
    const state = countryReducer(initialState, CountryActions.loadCountries());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should populate entities on loadCountriesSuccess', () => {
    const state = countryReducer(
      initialState,
      CountryActions.loadCountriesSuccess({ countries: sampleCountries })
    );
    expect(state.loading).toBe(false);
    expect(state.ids).toEqual(['1', '2']);
    expect(state.entities['1']?.name).toBe('India');
  });

  it('should set error on loadCountriesFailure', () => {
    const state = countryReducer(
      initialState,
      CountryActions.loadCountriesFailure({ error: 'Failed to load countries' })
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to load countries');
  });
});