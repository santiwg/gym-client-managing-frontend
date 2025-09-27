// Interfaces para datos comunes del sistema

// Basada en State entity
export interface State {
    id: number;
    name: string;
}

// Re-exportar desde client.interface.ts para evitar duplicación
export type { Gender, BloodType } from './client.interface';

// Para respuestas de API genéricas
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

// Para errores de API
export interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
    details?: any;
}

// Para paginación
export interface PaginationParams {
    page?: number;
    quantity?: number; // Cambiado de limit a quantity para coincidir con el backend
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    search?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    hasMore: boolean; // El backend solo devuelve hasMore, no total ni totalPages
}