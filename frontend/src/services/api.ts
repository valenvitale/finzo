import axios from 'axios';
import { supabase } from './supabase';

export const apiClient = axios.create({ // crea una instancia personalizada de Axios, con una configuración común para todas las peticiones de FINZO.
  baseURL: import.meta.env.VITE_API_URL,    // lee la dirección del backend desde el archivo .env.
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// agrega automáticamente el JWT a cada petición
apiClient.interceptors.request.use(
  async (config) => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      return Promise.reject(error);
    }

    if (session?.access_token) {
      config.headers.set(
        'Authorization',
        `Bearer ${session.access_token}`
      );
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// manejo centralizado de errores 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // evita conservar una sesión local si el backend
      // rechaza la autenticación.
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        await supabase.auth.signOut({ scope: 'local' });
      }
    }

    return Promise.reject(error);
  }
);
