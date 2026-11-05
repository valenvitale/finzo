import axios from 'axios';
import { toast } from 'sonner';
import { supabase } from './supabase';

export const apiClient = axios.create({
  // Configuración común para todas las peticiones de FINZO
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agrega automáticamente el JWT a cada petición
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

// Manejo centralizado de errores 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Avisamos al usuario que su sesión expiró
        toast.error(
          'Tu sesión ha expirado. Por favor, ingresa nuevamente.'
        );

        // Cerramos la sesión local
        await supabase.auth.signOut({ scope: 'local' });
      }
    }

    return Promise.reject(error);
  }
);
