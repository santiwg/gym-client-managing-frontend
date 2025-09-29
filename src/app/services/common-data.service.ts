import { Injectable } from '@angular/core';
import { axiosClient } from './axios-client';
import { config } from '../config/env';
import { Gender, BloodType, Membership, ClientGoal } from '../interfaces/client.interface';
import { State } from '../interfaces/common.interface';

@Injectable({
    providedIn: 'root'
})
export class CommonDataService {

    // Métodos genéricos para manejar requests comunes
    // GET
    private async getData<T>(url: string, errorMessage: string): Promise<T[]> {
        try {
            const response = await axiosClient.get(url);
            return response.data;
        } catch (error: any) {
            console.error(`Get ${errorMessage} error:`, error);
            throw new Error(`Error al obtener ${errorMessage}`);
        }
    }

    // POST
    private async createData<T>(url: string, data: any, errorMessage: string): Promise<T> {
        try {
            const response = await axiosClient.post(url, data);
            return response.data;
        } catch (error: any) {
            console.error(`Create ${errorMessage} error:`, error);
            throw new Error(`Error al crear ${errorMessage}`);
        }
    }

    // PUT
    private async updateData<T>(url: string, id: number, data: any, errorMessage: string): Promise<T> {
        try {
            const response = await axiosClient.put(`${url}/${id}`, data);
            return response.data;
        } catch (error: any) {
            console.error(`Update ${errorMessage} error:`, error);
            throw new Error(`Error al actualizar ${errorMessage}`);
        }
    }

    // DELETE
    private async deleteData(url: string, id: number, errorMessage: string): Promise<void> {
        try {
            await axiosClient.delete(`${url}/${id}`);
        } catch (error: any) {
            console.error(`Delete ${errorMessage} error:`, error);
            throw new Error(`Error al eliminar ${errorMessage}`);
        }
    }

    // Métodos específicos para cada tipo de dato común

    // Gender
    getGenders = (): Promise<Gender[]> => this.getData(config.urls.genders, 'géneros');
    createGender = (name: string): Promise<Gender> => this.createData(config.urls.genders, { name }, 'género');

    // Blood Types
    getBloodTypes = (): Promise<BloodType[]> => this.getData(config.urls.bloodTypes, 'tipos de sangre');
    createBloodType = (type: string): Promise<BloodType> => this.createData(config.urls.bloodTypes, { type }, 'tipo de sangre');

    // States
    getStates = (): Promise<State[]> => this.getData(config.urls.states, 'estados');
    createState = (name: string): Promise<State> => this.createData(config.urls.states, { name }, 'estado');

    // Client Goals
    getClientGoals = (): Promise<ClientGoal[]> => this.getData(config.urls.clientGoals, 'objetivos de cliente');

    // Memberships (más complejas, mantienen métodos específicos)
    async getMemberships(): Promise<Membership[]> {
        return this.getData(config.urls.memberships, 'membresías');
    }

    async createMembership(membershipData: any): Promise<Membership> {
        return this.createData(config.urls.memberships, membershipData, 'membresía');
    }

    async updateMembership(id: number, membershipData: any): Promise<Membership> {
        return this.updateData(config.urls.memberships, id, membershipData, 'membresía');
    }

    async deleteMembership(id: number): Promise<void> {
        return this.deleteData(config.urls.memberships, id, 'membresía');
    }

}