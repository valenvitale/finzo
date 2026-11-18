import { apiClient } from './api';
import type { ApiResponse } from '../types/api.types';
import type {
  AsignarMonedaDTO,
  MonedaPerfilResponseDTO,
  MonedaResponseDTO,
} from '../types/moneda.types';

export async function listarMonedasDisponibles(): Promise<MonedaResponseDTO[]> {
  const respuesta =
    await apiClient.get<ApiResponse<MonedaResponseDTO[]>>('/monedas');
  return respuesta.data.datos;
}

export async function listarMonedasPerfil(): Promise<MonedaPerfilResponseDTO[]> {
  const respuesta =
    await apiClient.get<ApiResponse<MonedaPerfilResponseDTO[]>>('/perfil/monedas');
  return respuesta.data.datos;
}

export async function asignarMonedaPerfil(
  datos: AsignarMonedaDTO
): Promise<MonedaPerfilResponseDTO> {
  const respuesta = await apiClient.post<ApiResponse<MonedaPerfilResponseDTO>>(
    '/perfil/monedas',
    datos
  );
  return respuesta.data.datos;
}

export async function eliminarMonedaPerfil(monedaId: string): Promise<void> {
  await apiClient.delete(`/perfil/monedas/${encodeURIComponent(monedaId)}`);
}
