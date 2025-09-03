import { Component } from '@angular/core';

@Component({
  selector: 'app-clients-page',
  imports: [],
  templateUrl: './clients-page.html',
  styleUrl: './clients-page.css'
})
export class ClientsPage {
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
}
