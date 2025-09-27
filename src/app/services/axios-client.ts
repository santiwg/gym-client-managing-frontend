import axios, { AxiosInstance } from 'axios';
import { config } from '../config/env';

class AxiosClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: config.api.baseUrl,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - Agregar token de autenticación
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        console.log('Request sent:', config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - Manejar tokens expirados
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Si el token expiró (401) y no hemos intentado renovar
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.axiosInstance.get('/users/refresh-token', {
                headers: { Authorization: `Bearer ${refreshToken}` }
              });

              const { accessToken, refreshToken: newRefreshToken } = response.data;
              localStorage.setItem('accessToken', accessToken);
              if (newRefreshToken) {
                localStorage.setItem('refreshToken', newRefreshToken);
              }

              // Reintentar la petición original
              originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            // Si falló el refresh, limpiar tokens y redirigir al login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
          }
        }

        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  public getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export const axiosClient = new AxiosClient().getInstance();
