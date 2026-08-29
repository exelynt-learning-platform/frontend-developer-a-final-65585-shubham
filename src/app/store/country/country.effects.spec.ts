import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Actions } from '@ngrx/effects';
import { Observable, of, throwError, firstValueFrom } from 'rxjs';

import { CountryEffects } from './country.effects';
import { CountryActions } from './country.actions';
import { CountryApi } from '../../core/services/country-api';
import { Country } from '../../core/models/country.model';

describe('CountryEffects', () => {
  let actions$: Observable<any>;
  let countryApiSpy: { getAll: any };

  const sampleCountries: Country[] = [
    { id: '1', name: 'India' },
    { id: '2', name: 'USA' }
  ];

  beforeEach(() => {
    countryApiSpy = { getAll: vi.fn() };
  });

  function setup() {
    TestBed.configureTestingModule({
      providers: [
        CountryEffects,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CountryApi, useValue: countryApiSpy },
        { provide: Actions, useFactory: () => actions$ }
      ]
    });
    return TestBed.inject(CountryEffects);
  }

  it('should dispatch loadCountriesSuccess on successful API call', async () => {
    countryApiSpy.getAll.mockReturnValue(of(sampleCountries));
    actions$ = of(CountryActions.loadCountries());

    const effects = setup(); // ← आता actions$ आधीच set झाल्यावर inject होतो

    const result = await firstValueFrom(effects.loadCountries$);

    expect(result).toEqual(CountryActions.loadCountriesSuccess({ countries: sampleCountries }));
  });

  it('should dispatch loadCountriesFailure when API call fails', async () => {
    countryApiSpy.getAll.mockReturnValue(throwError(() => new Error('Network error')));
    actions$ = of(CountryActions.loadCountries());

    const effects = setup();

    const result = await firstValueFrom(effects.loadCountries$);

    expect(result).toEqual(CountryActions.loadCountriesFailure({ error: 'Failed to load countries' }));
  });
});