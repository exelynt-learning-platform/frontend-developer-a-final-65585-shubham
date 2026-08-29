import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  standalone: true,
  templateUrl: './error-state.html',
  styleUrl: './error-state.scss'
})
export class ErrorState {
  message = input('Something went wrong.');
  retried = output<void>();
}