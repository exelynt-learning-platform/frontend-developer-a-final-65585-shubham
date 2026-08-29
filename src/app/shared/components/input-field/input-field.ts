import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  standalone: true,
  selector: 'app-input-field',
  styleUrl: './input-field.scss',
  templateUrl: './input-field.html',
})
export class InputField {
  label = input.required<string>();
  type = input<'text' | 'email' | 'tel'>('text');
  placeholder = input('');
  value = input('');
  errorMessage = input<string | null>(null);
  required = input(false);

  valueChange = output<string>();
  blurred = output<void>();

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }
}
