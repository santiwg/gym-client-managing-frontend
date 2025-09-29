import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { axiosClient } from './axios-client';
import {
    Client,
    CreateClientRequest,
    UpdateClientRequest
} from '../interfaces/client.interface';
import { PaginationParams, PaginatedResponse } from '../interfaces/common.interface';

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    
    /**
     * Obtener todos los clientes con paginación - GET /client
     */
    getClients(pagination: PaginationParams = {}): Observable<PaginatedResponse<Client>> {
        const params = new URLSearchParams();

        if (pagination.page) params.append('page', pagination.page.toString());
        if (pagination.quantity) params.append('quantity', pagination.quantity.toString());
        if (pagination.sortBy) params.append('sortBy', pagination.sortBy);
        if (pagination.sortOrder) params.append('sortOrder', pagination.sortOrder);
        if (pagination.search) params.append('search', pagination.search);

        return from(axiosClient.get(`/client?${params.toString()}`)).pipe(
            map(response => response.data)
        );
    }

    /**
     * Crear cliente - POST /client
     */
    createClient(clientData: CreateClientRequest): Observable<Client> {
        return from(axiosClient.post('/client', clientData)).pipe(
            map(response => response.data)
        );
    }

    /**
     * Actualizar cliente - PUT /client/:id
     */
    updateClient(id: number, clientData: UpdateClientRequest): Observable<Client> {
        return from(axiosClient.put(`/client/${id}`, clientData)).pipe(
            map(response => response.data)
        );
    }

    /**
     * Eliminar cliente - DELETE /client/:id
     */
    deleteClient(id: number): Observable<{ message: string }> {
        return from(axiosClient.delete(`/client/${id}`)).pipe(
            map(response => response.data)
        );
    }

    /**
     * Registrar asistencia - POST /client/attendance
     */
    registerAttendance(attendanceData: { documentNumber: string }): Observable<any> {
        return from(axiosClient.post('/client/attendance', attendanceData)).pipe(
            map(response => response.data)
        );
    }

    /**
     * Registrar cobro - POST /client/fee-collection
     */
    registerFeeCollection(feeData: any): Observable<any> {
        return from(axiosClient.post('/client/fee-collection', feeData)).pipe(
            map(response => response.data)
        );
    }

    /**
     * Desactivar suscripción - GET /client/:id/makeSubscriptionInActive
     */
    deactivateSubscription(clientId: number): Observable<any> {
        return from(axiosClient.get(`/client/${clientId}/makeSubscriptionInActive`)).pipe(
            map(response => response.data)
        );
    }

    /**
     * Obtener suscripción actual - GET /client/:id/currentSubscription
     */
    getCurrentSubscription(clientId: number): Observable<any> {
        return from(axiosClient.get(`/client/${clientId}/currentSubscription`)).pipe(
            map(response => response.data)
        );
    }

    /**
     * Crear suscripción - POST /client/:id/subscription
     */
    createSubscription(clientId: number, subscriptionData: any): Observable<any> {
        return from(axiosClient.post(`/client/${clientId}/subscription`, subscriptionData)).pipe(
            map(response => response.data)
        );
    }
}