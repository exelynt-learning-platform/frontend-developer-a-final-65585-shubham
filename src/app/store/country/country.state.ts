import { EntityState } from '@ngrx/entity';
import { Country } from '../../core/models/country.model';

export interface CountryState extends EntityState<Country> {
  loading: boolean;
  error: string | null;
}