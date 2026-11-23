import { apiClient } from './api';
import type { ApiResponse } from '../types/api.types';
import type { ActualizarPerfilDTO, PerfilResponseDTO } from '../types/perfil.types';

export async function obtenerPerfil(): Promise<PerfilResponseDTO> {
  const respuesta = await apiClient.get<ApiResponse<PerfilResponseDTO>>('/perfil');
  return respuesta.data.datos;
}

export async function actualizarPerfil(
  datos: ActualizarPerfilDTO
): Promise<PerfilResponseDTO> {
  const respuesta = await apiClient.patch<ApiResponse<PerfilResponseDTO>>(
    '/perfil',
    datos
  );
  return respuesta.data.datos;
}
