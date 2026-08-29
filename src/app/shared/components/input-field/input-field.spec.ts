import { TestBed } from '@angular/core/testing';
import { InputField } from './input-field';

describe('InputField', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputField]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(InputField);
    fixture.componentRef.setInput('label', 'Name');   // required input मुळे set करावंच लागतं
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the label text', () => {
    const fixture = TestBed.createComponent(InputField);
    fixture.componentRef.setInput('label', 'Email');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('label')?.textContent).toContain('Email');
  });

  it('should show error message when errorMessage is provided', () => {
    const fixture = TestBed.createComponent(InputField);
    fixture.componentRef.setInput('label', 'Email');
    fixture.componentRef.setInput('errorMessage', 'Invalid email');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Invalid email');
  });
});