import { apiClient } from './api';
import type { ApiResponse } from '../types/api.types';
import type {
  ActualizarPresupuestoDTO,
  CrearPresupuestoDTO,
  PresupuestoDTO,
  ResumenPresupuestosDTO,
} from '../types/presupuesto.types';

export interface FiltrosPresupuesto {
  mes: number;
  anio: number;
}

export async function listarPresupuestos(filtros: FiltrosPresupuesto): Promise<ResumenPresupuestosDTO> {
  const respuesta = await apiClient.get<ApiResponse<ResumenPresupuestosDTO>>('/presupuestos', {
    params: filtros,
  });
  return respuesta.data.datos;
}

export async function crearPresupuesto(datos: CrearPresupuestoDTO): Promise<PresupuestoDTO> {
  const respuesta = await apiClient.post<ApiResponse<PresupuestoDTO>>('/presupuestos', datos);
  return respuesta.data.datos;
}

export async function actualizarPresupuesto(id: string, datos: ActualizarPresupuestoDTO): Promise<PresupuestoDTO> {
  const respuesta = await apiClient.patch<ApiResponse<PresupuestoDTO>>(
    `/presupuestos/${encodeURIComponent(id)}`,
    datos
  );
  return respuesta.data.datos;
}

export async function eliminarPresupuesto(id: string): Promise<void> {
  await apiClient.delete(`/presupuestos/${encodeURIComponent(id)}`);
}
