import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { axiosClient } from './axios-client';
import {
    LoginRequest,
    RegisterRequest,
    LoginResponse,
    User,
    JwtPayload
} from '../interfaces/auth.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor() {
        this.loadStoredAuth();
    }

    /**
     * Login - POST /users/login
     */
    login(credentials: LoginRequest): Observable<LoginResponse> {
        return from(axiosClient.post('/users/login', credentials)).pipe(
            map(response => {
                const loginData = response.data as LoginResponse;
                this.handleAuthResponse(loginData);
                return loginData;
            })
        );
    }

    /**
     * Registro - POST /users/register  
     */
    register(userData: RegisterRequest): Observable<LoginResponse> {
        return from(axiosClient.post('/users/register', userData)).pipe(
            map(response => {
                const registerData = response.data as LoginResponse;
                this.handleAuthResponse(registerData);
                return registerData;
            })
        );
    }

    /**
     * Obtener usuario actual - GET /users/me
     */
    getCurrentUser(): Observable<{ email: string }> {
        return from(axiosClient.get('/users/me')).pipe(
            map(response => response.data)
        );
    }

    /**
     * Verificar permisos - GET /users/can-do/:permission
     */
    canDo(permission: string): Observable<any> {
        return from(axiosClient.get(`/users/can-do/${permission}`)).pipe(
            map(response => response.data)
        );
    }

    /**
     * Refrescar token - GET /users/refresh-token
     */
    refreshToken(): Observable<LoginResponse> {
        const refreshToken = localStorage.getItem('refreshToken');

        return from(axiosClient.get('/users/refresh-token', {
            headers: { 'refresh-token': refreshToken }
        })).pipe(
            map(response => {
                const refreshData = response.data as LoginResponse;
                this.handleAuthResponse(refreshData);
                return refreshData;
            })
        );
    }

    /**
     * Logout
     */
    logout(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    /**
     * Verificar si está autenticado
     */
    isAuthenticated(): boolean {
        const token = localStorage.getItem('accessToken');
        if (!token) return false;

        try {
            const payload = this.decodeToken(token);
            return payload.exp > Date.now() / 1000;
        } catch {
            return false;
        }
    }

    getToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    getCurrentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    // === MÉTODOS PRIVADOS ===

    private handleAuthResponse(response: LoginResponse): void {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
    }

    private loadStoredAuth(): void {
        const token = localStorage.getItem('accessToken');
        const userJson = localStorage.getItem('currentUser');

        if (token && this.isAuthenticated()) {
            if (userJson) {
                try {
                    const user = JSON.parse(userJson) as User;
                    this.currentUserSubject.next(user);
                } catch {
                    this.logout();
                }
            }
        } else {
            this.logout();
        }
    }

    private decodeToken(token: string): JwtPayload {
        const payload = token.split('.')[1];
        const decoded = atob(payload);
        return JSON.parse(decoded) as JwtPayload;
    }
}