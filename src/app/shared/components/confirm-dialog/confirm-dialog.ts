import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss'
})
export class ConfirmDialog {
  open = input(false);
  title = input('Are you sure?');
  message = input('');
  confirmLabel = input('Confirm');
  loading = input(false);

  confirmed = output<void>();
  cancelled = output<void>();
}