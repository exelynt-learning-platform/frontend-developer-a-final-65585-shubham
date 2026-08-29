import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of } from 'rxjs';
import { CountryApi } from '../../core/services/country-api';
import { CountryActions } from './country.actions';

@Injectable()
export class CountryEffects {
  private actions$ = inject(Actions);
  private countryApi = inject(CountryApi);

  loadCountries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountryActions.loadCountries),
      switchMap(() =>
        this.countryApi.getAll().pipe(
          map((countries) => CountryActions.loadCountriesSuccess({ countries })),
          catchError(() =>
            of(CountryActions.loadCountriesFailure({ error: 'Failed to load countries' }))
          )
        )
      )
    )
  );
}