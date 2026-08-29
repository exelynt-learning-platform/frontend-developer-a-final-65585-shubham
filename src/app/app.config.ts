import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { employeeReducer } from './store/employee/employee.reducer';
import { countryReducer } from './store/country/country.reducer';
import { EmployeeEffects } from './store/employee/employee.effects';
import { CountryEffects } from './store/country/country.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideStore({
      employees: employeeReducer,
      countries: countryReducer
    }),
    provideEffects([EmployeeEffects, CountryEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false })
  ]
};