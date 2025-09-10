import { Component } from '@angular/core';
import { ClientFormModal } from "../client-form-modal/client-form-modal";

@Component({
  selector: 'app-clients-page',
  imports: [ClientFormModal],
  templateUrl: './clients-page.html',
  styleUrl: './clients-page.css'
})
export class ClientsPage {
  genders = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' },
    { id: 3, name: 'Prefer not to say' }
  ];
  bloodTypes = [
    { id: 1, name: 'O+' },
    { id: 2, name: 'A+' },
    // ...otros tipos...
  ];
  clientGoals = [
    { id: 1, name: 'Lose weight' },
    { id: 2, name: 'Win muscle' },
    // ...otros objetivos...
  ];

  clients = [
    {
      id: 1,
      name: 'Juan',
      lastName: 'Pérez',
      document: '12345678',
      gender: 'Male',
      bloodType: 'O+',
      email: 'juan.perez@email.com',
      phoneNumber: '1122334455',
      registrationDate: '2023-01-15',
      birthDate: '2004-10-10',
      goal: 'Lose weight',
      observations: ['Prefers morning sessions', 'Allergic to peanuts', 'Vegetarian']
    },
    {
      id: 2,
      name: 'Mateo',
      lastName: 'Briolo',
      document: '46882993',
      gender: 'Prefer not to say',
      bloodType: 'O+',
      email: 'brauni@gmail.com',
      phoneNumber: '3531234567',
      registrationDate: '2022-03-23',
      birthDate: '2018-12-09',
      goal: 'Win muscle',
      observations: ['Prefers afternoon sessions']
    },
    // ...puedes agregar más clientes aquí...
  ];

  showDetailsModal = false;
  selectedClient: any = null;
  showClientFormModal = false;
  clientFormInitialData: any = null;
  isEditClient: boolean = false;

  openClientFormModal() {
    this.clientFormInitialData = null;
    this.isEditClient = false;
    this.showClientFormModal = true;
  }

  editClient(client: any) {
    this.clientFormInitialData = {
      ...client,
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
    if (this.isEditClient && this.clientFormInitialData) {
      const idx = this.clients.findIndex(c => c.id === this.clientFormInitialData.id);
      if (idx !== -1) {
        this.clients[idx] = {
          ...this.clients[idx],
          ...clientData,
          observations: clientData.clientObservations ?? []
        };
      }
    } else {
      this.clients.push({
        id: this.clients.length + 1,
        ...clientData,
        observations: clientData.clientObservations ?? []
      });
    }
    this.showClientFormModal = false;
    this.isEditClient = false;
    this.clientFormInitialData = null;
  }
}
