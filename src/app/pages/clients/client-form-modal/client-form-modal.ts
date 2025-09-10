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

  // Temporary observation for add/edit
  observationTitle: string = '';
  observationDescription: string = '';
  observationDate: string = '';
  editObservationIndex: number | null = null;

  // For visual validation
  observationTitleTouched: boolean = false;
  observationDescriptionTouched: boolean = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      genderId: [null, [Validators.required, Validators.min(1)]],
      bloodTypeId: [null, [Validators.required, Validators.min(1)]],
      documentNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      address: [''],
      birthDate: ['', [Validators.required, this.notFutureDateValidator]],
      registrationDate: [''],
      clientGoalId: [null]
    });
  }

  // Validator to ensure the date is not in the future
  notFutureDateValidator(control: any) {
    if (!control.value) return null;
    // Parse input as YYYY-MM-DD
    const [year, month, day] = control.value.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Only allow birth dates less than or equal to today
    return birthDate > today ? { futureDate: true } : null;
  }

  ngOnInit() {
    if (this.initialClient) {
      this.form.patchValue({
        ...this.initialClient,
        birthDate: this.formatDate(this.initialClient.birthDate),
        registrationDate: this.initialClient.registrationDate ? this.formatDate(this.initialClient.registrationDate) : ''
      });
      this.clientObservations = Array.isArray(this.initialClient.clientObservations)
        ? [...this.initialClient.clientObservations]
        : [];
    }
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().substring(0, 10);
  }

  onCancel() {
    this.close.emit();
  }

  submit() {
    if (this.form.invalid || !this.isObservationsValid()) return;
    const clientData = {
      ...this.form.value,
      clientObservations: this.clientObservations
    };
    this.save.emit(clientData);
  }

  // Observations
  addObservation() {
    this.observationTitleTouched = true;
    this.observationDescriptionTouched = true;
    if (!this.observationTitle || !this.observationDescription) return;

    const obs = {
      title: this.observationTitle,
      description: this.observationDescription,
      date: this.observationDate || new Date().toISOString().substring(0, 10)
    };

    if (this.editObservationIndex !== null) {
      this.clientObservations[this.editObservationIndex] = obs;
      this.editObservationIndex = null;
    } else {
      this.clientObservations.push(obs);
    }
    this.clearObservationInputs();
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
      this.clearObservationInputs();
      this.editObservationIndex = null;
    }
  }

  // Clear observation input fields
  clearObservationInputs() {
    this.observationTitle = '';
    this.observationDescription = '';
    this.observationDate = '';
    this.observationTitleTouched = false;
    this.observationDescriptionTouched = false;
  }

  // Validate that there is at least one observation
  isObservationsValid(): boolean {
    return this.clientObservations.length > 0;
  }

  // Disable add observation button if required fields are empty
  get isAddObservationDisabled(): boolean {
    return !this.observationTitle || !this.observationDescription;
  }

  // Mark title as touched for validation
  onObservationTitleInput() {
    this.observationTitleTouched = true;
  }

  // Mark description as touched for validation
  onObservationDescriptionInput() {
    this.observationDescriptionTouched = true;
  }

  // Cancel editing observation
  cancelEditObservation() {
    this.clearObservationInputs();
    this.editObservationIndex = null;
  }
}
