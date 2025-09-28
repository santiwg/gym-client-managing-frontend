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
  showDetailsModal = false;
  selectedClient: Client | null = null;
  showClientFormModal = false;
  clientFormInitialData: any = null;
  isEditClient: boolean = false;

  // Estados de carga
  isLoading = false;
  error: string | null = null;

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
    this.showClientFormModal = true;
  }

  editClient(client: any) {
    this.clientFormInitialData = {
      ...client,
      genderId: client.gender?.id || null,
      bloodTypeId: client.bloodType?.id || null,
      clientGoalId: client.clientGoal?.id || null,
      documentNumber: client.documentNumber,
      clientObservations: Array.isArray(client.observations)
        ? client.observations.map((obs: any) =>
          typeof obs === 'object'
            ? { title: obs.summary || '', description: obs.comment || '', date: obs.date || '' }
            : { title: obs, description: '', date: '' }
        )
        : []
    };

    this.isEditClient = true;
    this.showClientFormModal = true;
  }

  closeClientFormModal() {
    this.showClientFormModal = false;
  }

  async saveClient(clientData: any) {
    try {
      this.isLoading = true;
      this.error = null;

      // Mapear las observaciones al formato que espera el backend
      const clientObservations = Array.isArray(clientData.clientObservations)
        ? clientData.clientObservations.map((obs: any) => ({
          summary: obs.title || obs.summary || '',
          comment: obs.description || obs.comment || '',
          date: obs.date || new Date().toISOString().split('T')[0]
        }))
        : [];

      // Validar campos requeridos antes de crear el request
      const genderIdNum = parseInt(clientData.genderId, 10);
      const bloodTypeIdNum = parseInt(clientData.bloodTypeId, 10);

      if (!genderIdNum || genderIdNum <= 0 || isNaN(genderIdNum)) {
        throw new Error('El género es requerido');
      }
      if (!bloodTypeIdNum || bloodTypeIdNum <= 0 || isNaN(bloodTypeIdNum)) {
        throw new Error('El tipo de sangre es requerido');
      }

      const clientRequest = {
        name: clientData.name,
        lastName: clientData.lastName,
        documentNumber: clientData.documentNumber,
        email: clientData.email,
        phoneNumber: clientData.phoneNumber || undefined,
        address: clientData.address || undefined,
        birthDate: clientData.birthDate,
        // Solo enviar registrationDate si se proporcionó, sino dejar que el backend use su fecha por defecto
        ...(clientData.registrationDate && { registrationDate: clientData.registrationDate }),
        genderId: genderIdNum,
        bloodTypeId: bloodTypeIdNum,
        clientGoalId: clientData.clientGoalId && clientData.clientGoalId > 0 ? parseInt(clientData.clientGoalId, 10) : undefined,
        clientObservations: clientObservations
      };

      if (this.isEditClient && this.clientFormInitialData) {
        await this.clientService.updateClient(this.clientFormInitialData.id, clientRequest).toPromise();
      } else {
        await this.clientService.createClient(clientRequest).toPromise();
      }

      this.loadClients();
      this.showClientFormModal = false;
      this.isEditClient = false;
      this.clientFormInitialData = null;

    } catch (error: any) {
      let errorMessage = 'Error al guardar el cliente. ';
      if (error.error?.message) {
        errorMessage += error.error.message;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Por favor, intenta nuevamente.';
      }

      this.error = errorMessage;
    } finally {
      this.isLoading = false;
    }
  }

  // Ahora el backend devuelve objetos completos, no solo IDs
  getGenderName(gender: any): string {
    return gender?.name || '-';
  }

  getBloodTypeName(bloodType: any): string {
    return bloodType?.name || '-';
  }

  getGoalName(clientGoal: any): string {
    return clientGoal?.name || '-';
  }

  getObservationsDisplay(observations: any[] | undefined): string {
    if (!observations || !observations.length) return '';
    return observations.map(o => {
      if (typeof o === 'object') {
        // Los campos de la entidad ClientObservation son 'summary' y 'comment'
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

  // Formatear fecha para mostrar solo la fecha local, evitando problemas de zona horaria
  formatDate(dateString: string | Date): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    // Usar componentes locales para evitar problemas de zona horaria
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

}
