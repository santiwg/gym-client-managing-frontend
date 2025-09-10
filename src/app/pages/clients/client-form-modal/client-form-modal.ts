import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-form-modal',
  templateUrl: './client-form-modal.html',
  styleUrl: './client-form-modal.css',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule]
})
export class ClientFormModal {
  @Input() isEdit: boolean = false;
  @Input() genders: any[] = [];
  @Input() bloodTypes: any[] = [];
  @Input() clientGoals: any[] = [];
  @Input() initialClient: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  form: FormGroup;
  clientObservations: any[] = [];

  // Observación temporal para agregar/editar
  observationTitle: string = '';
  observationDescription: string = '';
  observationDate: string = '';
  editObservationIndex: number | null = null;

  // Para validación visual
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
      birthDate: ['', Validators.required],
      registrationDate: [''],
      clientGoalId: [null]
    });
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

  // Observaciones
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

  clearObservationInputs() {
    this.observationTitle = '';
    this.observationDescription = '';
    this.observationDate = '';
    this.observationTitleTouched = false;
    this.observationDescriptionTouched = false;
  }

  isObservationsValid(): boolean {
    return this.clientObservations.length > 0;
  }

  get isAddObservationDisabled(): boolean {
    return !this.observationTitle || !this.observationDescription;
  }

  onObservationTitleInput() {
    this.observationTitleTouched = true;
  }

  onObservationDescriptionInput() {
    this.observationDescriptionTouched = true;
  }

  cancelEditObservation() {
    this.clearObservationInputs();
    this.editObservationIndex = null;
  }
}
