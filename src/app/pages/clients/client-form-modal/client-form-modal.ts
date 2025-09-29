import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-form-modal',
  templateUrl: './client-form-modal.html',
  styleUrl: './client-form-modal.css',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule]
})
export class ClientFormModal implements OnInit {
  @Input() isEdit: boolean = false;
  @Input() genders: any[] = [];
  @Input() bloodTypes: any[] = [];
  @Input() clientGoals: any[] = [];
  @Input() initialClient: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  form: FormGroup;
  clientObservations: any[] = [];

  // Estado del formulario de observaciones
  observationTitle = '';
  observationDescription = '';
  observationDate = '';
  editObservationIndex: number | null = null;
  observationTitleTouched = false;
  observationDescriptionTouched = false;

  constructor(private fb: FormBuilder) {
    this.form = this.createClientForm();
  }

  private createClientForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      genderId: [null, [Validators.required, Validators.min(1)]],
      bloodTypeId: [null, [Validators.required, Validators.min(1)]],
      documentNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      address: [''],
      birthDate: ['', [Validators.required, this.dateValidator]],
      registrationDate: ['', this.dateValidator],
      clientGoalId: [null]
    });
  }

  // Validador para fechas válidas
  dateValidator(control: any) {
    if (!control.value) return null;

    // Parse input as YYYY-MM-DD
    const [year, month, day] = control.value.split('-').map(Number);

    // Validar que el año no sea anterior a 1900
    if (year < 1900) {
      return { tooOldDate: true };
    }

    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Solo permite fechas de nacimiento menores o iguales a hoy
    return birthDate > today ? { futureDate: true } : null;
  }

  ngOnInit() {
    if (this.initialClient) {
      this.populateForm();
    }
  }

  private populateForm(): void {
    this.form.patchValue({
      ...this.initialClient,
      birthDate: this.formatDate(this.initialClient.birthDate),
      registrationDate: this.initialClient.registrationDate ? this.formatDate(this.initialClient.registrationDate) : ''
    });

    this.clientObservations = Array.isArray(this.initialClient.clientObservations)
      ? [...this.initialClient.clientObservations]
      : [];
  }

  private formatDate(date: any): string {
    if (!date) return '';
    return new Date(date).toISOString().substring(0, 10);
  }

  onCancel = () => this.close.emit();

  submit() {
    if (this.form.invalid) return;

    const clientData = {
      ...this.form.value,
      registrationDate: this.form.value.registrationDate || null,
      clientObservations: this.clientObservations
    };

    this.save.emit(clientData);
  }

  // Métodos de observaciones
  addObservation() {
    this.markObservationFieldsAsTouched();

    if (!this.isObservationValid()) return;

    const observation = this.createObservation();

    if (this.editObservationIndex !== null) {
      this.clientObservations[this.editObservationIndex] = observation;
      this.editObservationIndex = null;
    } else {
      this.clientObservations.push(observation);
    }

    this.clearObservationInputs();
  }

  private markObservationFieldsAsTouched(): void {
    this.observationTitleTouched = true;
    this.observationDescriptionTouched = true;
  }

  private isObservationValid(): boolean {
    if (!this.observationTitle || !this.observationDescription) return false;

    if (this.observationDate) {
      const dateError = this.dateValidator({ value: this.observationDate });
      if (dateError) return false;
    }

    return true;
  }

  private createObservation() {
    return {
      title: this.observationTitle,
      description: this.observationDescription,
      date: this.observationDate || null
    };
  }

  editObservation(idx: number) {
    const obs = this.clientObservations[idx];
    this.observationTitle = obs.title;
    this.observationDescription = obs.description;
    this.observationDate = obs.date;
    this.editObservationIndex = idx;
  }

  deleteObservation(idx: number) {
    this.clientObservations.splice(idx, 1);
    if (this.editObservationIndex === idx) {
      this.cancelEditObservation();
    }
  }

  clearObservationInputs() {
    this.observationTitle = '';
    this.observationDescription = '';
    this.observationDate = '';
    this.observationTitleTouched = false;
    this.observationDescriptionTouched = false;
  }

  cancelEditObservation() {
    this.clearObservationInputs();
    this.editObservationIndex = null;
  }

  // Getters y Helpers
  get isAddObservationDisabled(): boolean {
    return !this.observationTitle || !this.observationDescription || !!this.observationDateError;
  }

  get observationDateError() {
    return this.observationDate ? this.dateValidator({ value: this.observationDate }) : null;
  }

  onObservationTitleInput = () => this.observationTitleTouched = true;
  onObservationDescriptionInput = () => this.observationDescriptionTouched = true;

}
