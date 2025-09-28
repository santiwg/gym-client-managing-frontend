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
      genderId: client.genderId,
      bloodTypeId: client.bloodTypeId,
      clientGoalId: client.clientGoalId,
      documentNumber: client.documentNumber,
      clientObservations: Array.isArray(client.observations)
        ? client.observations.map((obs: string | { title: string; description: string; date: string }) =>
          typeof obs === 'object'
            ? obs
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

  saveClient(clientData: any) {
    const mappedClient: Client = {
      id: this.isEditClient && this.clientFormInitialData ? this.clientFormInitialData.id : this.clients.length + 1,
      name: clientData.name,
      lastName: clientData.lastName,
      documentNumber: clientData.documentNumber,
      genderId: clientData.genderId ?? null,
      bloodTypeId: clientData.bloodTypeId ?? null,
      email: clientData.email,
      phoneNumber: clientData.phoneNumber,
      registrationDate: clientData.registrationDate,
      birthDate: clientData.birthDate,
      clientGoalId: clientData.clientGoalId ?? null,
      observations: clientData.clientObservations ?? []
    };

    if (this.isEditClient && this.clientFormInitialData) {
      const idx = this.clients.findIndex(c => c.id === this.clientFormInitialData.id);
      if (idx !== -1) {
        this.clients[idx] = mappedClient;
      }

    } else {
      this.clients.push(mappedClient);
    }

    this.showClientFormModal = false;
    this.isEditClient = false;
    this.clientFormInitialData = null;
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

}
