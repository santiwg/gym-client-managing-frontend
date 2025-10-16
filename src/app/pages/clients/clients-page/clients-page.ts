import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientFormModal } from "../client-form-modal/client-form-modal";
import { ClientService } from '../../../services/client.service';
import { CommonDataService } from '../../../services/common-data.service';
import { Client, Gender, BloodType, ClientGoal } from '../../../interfaces/client.interface';
import { Pagination } from '../../../components/pagination/pagination';

@Component({
  selector: 'app-clients-page',
  imports: [ClientFormModal, CommonModule, Pagination],
  templateUrl: './clients-page.html',
  styleUrl: './clients-page.css'
})
export class ClientsPage implements OnInit {

  // Propiedades del componente
  clients: Client[] = [];
  genders: Gender[] = [];
  bloodTypes: BloodType[] = [];
  clientGoals: ClientGoal[] = [];

  // Estados de la UI
  showClientFormModal = false;
  clientFormInitialData: any = null;
  isEditClient: boolean = false;

  // Estados de carga
  isLoading = false;
  error: string | null = null;
  successMessage: string = '';

  // Propiedades de paginación (el backend maneja la cantidad por defecto = 10)
  currentPage = 1;
  hasNext = false;

  constructor(
    private clientService: ClientService,
    private commonDataService: CommonDataService
  ) { }

  ngOnInit() {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.loadClients();
    this.loadGenders();
    this.loadBloodTypes();
    this.loadClientGoals();
  }

  loadClients() {
    this.isLoading = true;
    this.error = null;

    this.clientService.getClients({
      page: this.currentPage
      // No enviamos quantity, el backend usa el default (10)
    }).subscribe({
      next: (response) => {
        this.clients = response.data;
        this.hasNext = response.hasMore; // El backend maneja esto
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.error = 'Error al cargar los clientes';
        this.isLoading = false;
      }
    });
  }

  async loadGenders() {
    try {
      this.genders = await this.commonDataService.getGenders();
    } catch (error) {
      console.error('Error loading genders:', error);
    }
  }

  async loadBloodTypes() {
    try {
      this.bloodTypes = await this.commonDataService.getBloodTypes();
    } catch (error) {
      console.error('Error loading blood types:', error);
    }
  }

  async loadClientGoals() {
    try {
      this.clientGoals = await this.commonDataService.getClientGoals();
    } catch (error) {
      console.error('Error loading client goals:', error);
      this.clientGoals = [];
    }
  }

  openClientFormModal() {
    this.clientFormInitialData = null;
    this.isEditClient = false;
    this.error = null;
    this.successMessage = '';
    this.showClientFormModal = true;
  }

  editClient(client: any) {
    this.clientFormInitialData = this.prepareClientForEdit(client);
    this.isEditClient = true;
    this.error = null;
    this.successMessage = '';
    this.showClientFormModal = true;
  }

  private prepareClientForEdit(client: any) {
    return {
      ...client,
      genderId: client.gender?.id,
      bloodTypeId: client.bloodType?.id,
      clientGoalId: client.clientGoal?.id || null,
      documentNumber: client.documentNumber,
      clientObservations: this.mapClientObservations(client.observations)
    };
  }

  private mapClientObservations(observations: any[]): any[] {
    if (!Array.isArray(observations)) return [];

    return observations.map((obs: any) =>
      typeof obs === 'object'
        ? { title: obs.summary || '', description: obs.comment || '', date: obs.date || '' }
        : { title: obs, description: '', date: '' }
    );
  }

  closeClientFormModal() {
    this.showClientFormModal = false;
  }

  async saveClient(clientData: any) {
    try {
      this.isLoading = true;
      this.error = null;
      this.successMessage = '';

      const clientRequest = this.buildClientRequest(clientData);

      if (this.isEditClient && this.clientFormInitialData) {
        await this.clientService.updateClient(this.clientFormInitialData.id, clientRequest).toPromise();
        this.successMessage = 'Client updated successfully';
      } else {
        await this.clientService.createClient(clientRequest).toPromise();
        this.successMessage = 'Client created successfully';
      }

      this.loadClients();

      // Cerrar el modal después de mostrar el mensaje durante 2 segundos
      setTimeout(() => {
        this.successMessage = '';
        this.resetModalState();
      }, 2000);

    } catch (error: any) {
      this.error = this.buildErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

  private buildClientRequest(clientData: any) {
    const clientObservations = this.mapObservations(clientData.clientObservations);
    this.validateRequiredIds(clientData);

    const genderIdNum = parseInt(clientData.genderId, 10);
    const bloodTypeIdNum = parseInt(clientData.bloodTypeId, 10);

    return {
      name: clientData.name,
      lastName: clientData.lastName,
      documentNumber: clientData.documentNumber,
      email: clientData.email,
      phoneNumber: clientData.phoneNumber || undefined,
      address: clientData.address || undefined,
      birthDate: new Date(clientData.birthDate),
      ...(clientData.registrationDate && { registrationDate: new Date(clientData.registrationDate) }),
      genderId: genderIdNum,
      bloodTypeId: bloodTypeIdNum,
      clientGoalId: clientData.clientGoalId && clientData.clientGoalId > 0 ? parseInt(clientData.clientGoalId, 10) : undefined,
      clientObservations: clientObservations
    };
  }

  private mapObservations(observations: any[]): any[] {
    return Array.isArray(observations)
      ? observations.map((obs: any) => ({
        summary: obs.title || obs.summary || '',
        comment: obs.description || obs.comment || '',
        date: obs.date ? new Date(obs.date) : undefined
      }))
      : [];
  }

  private validateRequiredIds(clientData: any): void {
    const genderIdNum = parseInt(clientData.genderId, 10);
    const bloodTypeIdNum = parseInt(clientData.bloodTypeId, 10);

    if (!genderIdNum || genderIdNum <= 0 || isNaN(genderIdNum)) {
      throw new Error('El género es requerido');
    }
    if (!bloodTypeIdNum || bloodTypeIdNum <= 0 || isNaN(bloodTypeIdNum)) {
      throw new Error('El tipo de sangre es requerido');
    }
  }

  private resetModalState(): void {
    this.showClientFormModal = false;
    this.isEditClient = false;
    this.clientFormInitialData = null;
  }

  private buildErrorMessage(error: any): string {
    let errorMessage = 'Error al guardar el cliente. ';
    if (error.error?.message) {
      errorMessage += error.error.message;
    } else if (error.message) {
      errorMessage += error.message;
    } else {
      errorMessage += 'Por favor, intenta nuevamente.';
    }
    return errorMessage;
  }

  // Métodos de display simplificados
  getGenderName = (gender: any): string => gender?.name || '-';
  getBloodTypeName = (bloodType: any): string => bloodType?.name || '-';
  getGoalName = (clientGoal: any): string => clientGoal?.name || '-';

  getObservationsDisplay(observations: any[] | undefined): string {
    if (!observations?.length) return '';

    return observations.map(o => {
      if (typeof o === 'object') {
        const parts = [];
        if (o.summary) parts.push(`<strong>${o.summary}</strong>`);
        if (o.comment) parts.push(`${o.comment}`);
        return parts.join(': ');
      }
      return o.toString();
    }).join('<br>');
  }

  // Métodos de paginación
  onPrevious() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadClients();
    }
  }

  onNext() {
    if (this.hasNext) {
      this.currentPage++;
      this.loadClients();
    }
  }

}
