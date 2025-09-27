// Interfaces de autenticación (basadas en DTOs del backend)
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface RegisterRequest {
    email: string;
    password: string;
}

// Interface de usuario (basada en User entity del backend)
export interface User {
    id: number;
    email: string;
    role?: Role;  // En el backend es singular, no plural
}

// Basada en Role entity del backend
export interface Role {
    id: number;
    name: string;
    permissions?: Permission[];
}

// Basada en Permission entity del backend
export interface Permission {
    id: number;
    name: string;
    description?: string;
}

// Para el payload del JWT (basada en Payload interface del backend)
export interface JwtPayload {
    email: string;
    exp: number;
    iat?: number;
}

// Response genérico de la API
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}