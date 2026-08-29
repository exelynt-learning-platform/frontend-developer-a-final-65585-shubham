import { Component, input, output, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee, EmployeeFormData } from '../../../../core/models/employee.model';
import { Country } from '../../../../core/models/country.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.scss'
})
export class EmployeeForm {
  private fb = inject(FormBuilder);

  open = input(false);
  isEdit = input(false);
  loading = input(false);
  countries = input<Country[]>([]);
  initialValues = input<Employee | null>(null);
  submitError = input<string | null>(null);

  closed = output<void>();
  submitted = output<EmployeeFormData>();

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    mobile: ['', [Validators.required, Validators.pattern(/^[+]?[0-9]{10,13}$/)]],
    country: ['', [Validators.required]],
    state: ['', [Validators.required, Validators.maxLength(50)]],
    district: ['', [Validators.required, Validators.maxLength(50)]]
  });

  constructor() {
    // जेव्हा initialValues बदलतात (edit मोड सुरू होतो), फॉर्म pre-populate करा
    effect(() => {
      const emp = this.initialValues();
      if (emp) {
        this.form.patchValue({
          name: emp.name,
          email: emp.email,
          mobile: emp.mobile,
          country: emp.country,
          state: emp.state,
          district: emp.district
        });
      } else {
        this.form.reset({
          name: '', email: '', mobile: '', country: '', state: '', district: ''
        });
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.emit(this.form.getRawValue() as EmployeeFormData);
  }

  onClose() {
    this.closed.emit();
  }
}