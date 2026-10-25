/* 
 * Servicio para gestionar los movimientos.
 * Métodos asíncronos para invocar `/api/movimientos` (listar con filtros, crear, editar, eliminar).
 * 
**/

import { apiClient } from './api';
import type { 
  MovimientoResponseDTO, 
  CrearMovimientoDTO, 
  ActualizarMovimientoDTO, 
  FiltrosMovimientoDTO 
} from '../types/movimiento.types';

export async function crearMovimiento(datosMovimiento: CrearMovimientoDTO): Promise<MovimientoResponseDTO> {
    const respuesta = await apiClient.post('/movimientos', datosMovimiento);
    return respuesta.data.datos;
}

export async function eliminarMovimiento(id: string): Promise<void> {
    await apiClient.delete(`/movimientos/${id}`);
}

export async function actualizarMovimiento(id: string, datosMovimiento: ActualizarMovimientoDTO): Promise<MovimientoResponseDTO> {
    const respuesta = await apiClient.patch(`/movimientos/${id}`, datosMovimiento);
    return respuesta.data.datos;
}

export async function listarMovimientos(filtros?: FiltrosMovimientoDTO): Promise<MovimientoResponseDTO[]> {
    const respuesta = await apiClient.get('/movimientos', { params: filtros });
    return respuesta.data.datos;
}