import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '../types/api.types';

/**
 * Create an API client instance
 * L'API est sur le même domaine, pas besoin de X-Tenant-ID !
 * Le domaine est automatiquement détecté par Laravel
 */
export const createApiClient = (): AxiosInstance => {
    const client = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        withCredentials: true, // Important pour les cookies
    });

    // Request interceptor to add auth token
    client.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = localStorage.getItem('auth_token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor for error handling
    client.interceptors.response.use(
        (response) => response,
        (error: AxiosError<ApiError>) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
                if (typeof window !== 'undefined') {
                    window.location.href = '/admin/login';
                }
            }
            return Promise.reject(error);
        }
    );

    return client;
};

/**
 * Default API client
 */
export const apiClient = createApiClient();
