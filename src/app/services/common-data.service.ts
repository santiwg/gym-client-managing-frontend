import { Injectable } from '@angular/core';
import { axiosClient } from './axios-client';
import { config } from '../config/env';
import { Gender, BloodType, Membership } from '../interfaces/client.interface';
import { State } from '../interfaces/common.interface';

@Injectable({
    providedIn: 'root'
})
export class CommonDataService {

    // Géneros
    async getGenders(): Promise<Gender[]> {
        try {
            const response = await axiosClient.get(config.urls.genders);
            return response.data;
        } catch (error: any) {
            console.error('Get genders error:', error);
            throw new Error('Error al obtener géneros');
        }
    }

    async createGender(name: string): Promise<Gender> {
        try {
            const response = await axiosClient.post(config.urls.genders, { name });
            return response.data;
        } catch (error: any) {
            console.error('Create gender error:', error);
            throw new Error('Error al crear género');
        }
    }

    // Tipos de sangre
    async getBloodTypes(): Promise<BloodType[]> {
        try {
            const response = await axiosClient.get(config.urls.bloodTypes);
            return response.data;
        } catch (error: any) {
            console.error('Get blood types error:', error);
            throw new Error('Error al obtener tipos de sangre');
        }
    }

    async createBloodType(type: string): Promise<BloodType> {
        try {
            const response = await axiosClient.post(config.urls.bloodTypes, { type });
            return response.data;
        } catch (error: any) {
            console.error('Create blood type error:', error);
            throw new Error('Error al crear tipo de sangre');
        }
    }

    // Estados/Provincias
    async getStates(): Promise<State[]> {
        try {
            const response = await axiosClient.get(config.urls.states);
            return response.data;
        } catch (error: any) {
            console.error('Get states error:', error);
            throw new Error('Error al obtener estados');
        }
    }

    async createState(name: string): Promise<State> {
        try {
            const response = await axiosClient.post(config.urls.states, { name });
            return response.data;
        } catch (error: any) {
            console.error('Create state error:', error);
            throw new Error('Error al crear estado');
        }
    }

    // Membresías
    async getMemberships(): Promise<Membership[]> {
        try {
            const response = await axiosClient.get(config.urls.memberships);
            return response.data;
        } catch (error: any) {
            console.error('Get memberships error:', error);
            throw new Error('Error al obtener membresías');
        }
    }

    async createMembership(membershipData: any): Promise<Membership> {
        try {
            const response = await axiosClient.post(config.urls.memberships, membershipData);
            return response.data;
        } catch (error: any) {
            console.error('Create membership error:', error);
            throw new Error('Error al crear membresía');
        }
    }

    async updateMembership(id: number, membershipData: any): Promise<Membership> {
        try {
            const response = await axiosClient.put(`${config.urls.memberships}/${id}`, membershipData);
            return response.data;
        } catch (error: any) {
            console.error('Update membership error:', error);
            throw new Error('Error al actualizar membresía');
        }
    }

    async deleteMembership(id: number): Promise<void> {
        try {
            await axiosClient.delete(`${config.urls.memberships}/${id}`);
        } catch (error: any) {
            console.error('Delete membership error:', error);
            throw new Error('Error al eliminar membresía');
        }
    }
}