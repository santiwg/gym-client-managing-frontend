// Interfaces para clientes
export interface Client {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: Date;
    gender?: Gender;
    bloodType?: BloodType;
    state?: State;
    address?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateClientRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    genderId?: number;
    bloodTypeId?: number;
    stateId?: number;
    address?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {
    id: number;
}

// Interfaces para membresías
export interface Membership {
    id: number;
    name: string;
    description?: string;
    price: number;
    duration: number; // en días
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateMembershipRequest {
    name: string;
    description?: string;
    price: number;
    duration: number;
}

// Interfaces para datos comunes
export interface Gender {
    id: number;
    name: string;
}

export interface BloodType {
    id: number;
    type: string;
}

export interface State {
    id: number;
    name: string;
}

// Interfaces para suscripciones
export interface Subscription {
    id: number;
    clientId: number;
    membershipId: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    client?: Client;
    membership?: Membership;
}

// Interfaces para asistencia
export interface Attendance {
    id: number;
    clientId: number;
    date: Date;
    checkInTime: string;
    checkOutTime?: string;
    client?: Client;
}

export interface CreateAttendanceRequest {
    clientId: number;
    checkInTime?: string;
}