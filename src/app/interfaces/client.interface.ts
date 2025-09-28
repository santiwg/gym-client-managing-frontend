// Interfaces basadas en las entidades del backend

// Basada en Gender entity
export interface Gender {
    id: number;
    name: string;
}

// Basada en BloodType entity  
export interface BloodType {
    id: number;
    name: string;
}

// Basada en ClientGoal entity
export interface ClientGoal {
    id: number;
    name: string;
    description?: string;
}

// Basada en ClientObservation entity
export interface ClientObservation {
    id: number;
    observation: string;
    date: Date;
    clientId: number;
}

// Basada en Subscription entity
export interface Subscription {
    id: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    clientId: number;
    membershipId: number;
    // Relaciones
    membership?: Membership;
}

// Basada en Membership entity
export interface Membership {
    id: number;
    name: string;
    description?: string;
    price: number;
    duration: number; // en días
}

// Basada en Client entity del backend
export interface Client {
    id: number;
    name: string;
    lastName: string;
    documentNumber: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    birthDate: Date;
    registrationDate: Date;

    // Relaciones (con IDs para crear/actualizar)
    genderId?: number;
    bloodTypeId?: number;
    clientGoalId?: number;

    // Relaciones completas (para mostrar datos)
    gender?: Gender;
    bloodType?: BloodType;
    clientGoal?: ClientGoal;
    subscriptions?: Subscription[];
    observations?: ClientObservation[];
}

// DTO para crear cliente (basado en ClientDto del backend)
export interface CreateClientRequest {
    name: string;
    lastName: string;
    genderId: number;
    bloodTypeId: number;
    documentNumber: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    birthDate: Date;
    registrationDate?: Date;
    clientGoalId?: number;
    clientObservations?: Omit<ClientObservation, 'id' | 'clientId'>[];
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> { }

// Para listados con paginación
export interface ClientListResponse {
    clients: Client[];
    total: number;
    page: number;
    limit: number;
}