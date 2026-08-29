

import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-button',
  styleUrl: './button.scss',
  templateUrl: './button.html',
})
export class Button {
variant = input<'primary' | 'secondary' | 'danger'>('primary');
  type = input<'button' | 'submit'>('button');
  disabled = input(false);
  loading = input(false);

  clicked = output<void>();

  variantClass() {
    const map: Record<string, string> = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      danger: 'btn-danger'
    };
    return map[this.variant()];
  }
  
}
