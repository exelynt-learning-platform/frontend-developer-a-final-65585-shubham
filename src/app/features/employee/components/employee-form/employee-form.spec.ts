import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeForm } from './employee-form';
import { Employee } from '../../../../core/models/employee.model';

describe('EmployeeForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeForm, ReactiveFormsModule]
    }).compileComponents();
  });

  function createComponent() {
    const fixture = TestBed.createComponent(EmployeeForm);
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    return fixture;
  }

  it('should create', () => {
    const fixture = createComponent();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have an invalid form when fields are empty', () => {
    const fixture = createComponent();
    expect(fixture.componentInstance.form.valid).toBe(false);
  });

  it('should mark name as required', () => {
    const fixture = createComponent();
    const nameControl = fixture.componentInstance.form.controls.name;
    expect(nameControl.hasError('required')).toBe(true);

    nameControl.setValue('John');
    expect(nameControl.hasError('required')).toBe(false);
  });

  it('should mark email as invalid for a wrong format', () => {
    const fixture = createComponent();
    const emailControl = fixture.componentInstance.form.controls.email;

    emailControl.setValue('not-an-email');
    expect(emailControl.hasError('email')).toBe(true);

    emailControl.setValue('valid@example.com');
    expect(emailControl.hasError('email')).toBe(false);
  });

  it('should mark mobile as invalid for a wrong pattern', () => {
    const fixture = createComponent();
    const mobileControl = fixture.componentInstance.form.controls.mobile;

    mobileControl.setValue('123');
    expect(mobileControl.hasError('pattern')).toBe(true);

    mobileControl.setValue('9876543210');
    expect(mobileControl.hasError('pattern')).toBe(false);
  });

  it('should reject a name longer than 50 characters', () => {
    const fixture = createComponent();
    const nameControl = fixture.componentInstance.form.controls.name;

    nameControl.setValue('a'.repeat(51));
    expect(nameControl.hasError('maxlength')).toBe(true);
  });

  it('should not emit submitted when the form is invalid', () => {
    const fixture = createComponent();
    const submittedSpy = vi.fn();
    fixture.componentInstance.submitted.subscribe(submittedSpy);

    fixture.componentInstance.onSubmit();

    expect(submittedSpy).not.toHaveBeenCalled();
  });

  it('should emit submitted with form values when the form is valid', () => {
    const fixture = createComponent();
    const submittedSpy = vi.fn();
    fixture.componentInstance.submitted.subscribe(submittedSpy);

    fixture.componentInstance.form.setValue({
      name: 'Jane Doe',
      email: 'jane@example.com',
      mobile: '9876543210',
      country: 'India',
      state: 'Maharashtra',
      district: 'Pune'
    });

    fixture.componentInstance.onSubmit();

    expect(submittedSpy).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'jane@example.com',
      mobile: '9876543210',
      country: 'India',
      state: 'Maharashtra',
      district: 'Pune'
    });
  });

  it('should pre-populate the form when initialValues is provided (edit mode)', () => {
    const fixture = createComponent();
    const existingEmployee: Employee = {
      id: '5',
      name: 'Carol',
      email: 'carol@example.com',
      mobile: '9876543210',
      country: 'India',
      state: 'MH',
      district: 'Pune'
    };

    fixture.componentRef.setInput('initialValues', existingEmployee);
    fixture.detectChanges();

    expect(fixture.componentInstance.form.controls.name.value).toBe('Carol');
    expect(fixture.componentInstance.form.controls.email.value).toBe('carol@example.com');
  });

  it('should emit closed when onClose is called', () => {
    const fixture = createComponent();
    const closedSpy = vi.fn();
    fixture.componentInstance.closed.subscribe(closedSpy);

    fixture.componentInstance.onClose();

    expect(closedSpy).toHaveBeenCalled();
  });
});