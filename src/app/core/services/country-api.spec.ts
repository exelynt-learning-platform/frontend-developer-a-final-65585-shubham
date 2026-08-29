import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CountryApi } from './country-api';
import { Country } from '../models/country.model';

describe('CountryApi', () => {
  let service: CountryApi;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/country';

  const sampleCountries: Country[] = [
    { id: '1', name: 'India' },
    { id: '2', name: 'USA' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CountryApi,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CountryApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all countries via GET', () => {
    service.getAll().subscribe((countries) => {
      expect(countries).toEqual(sampleCountries);
      expect(countries.length).toBe(2);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(sampleCountries);
  });

  it('should propagate an error when the request fails', () => {
    let errorCaught: any = null;

    service.getAll().subscribe({
      next: () => {},
      error: (error) => {
        errorCaught = error;
      }
    });

    const req = httpMock.expectOne(baseUrl);
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    expect(errorCaught).not.toBeNull();
    expect(errorCaught.status).toBe(500);
  });
});