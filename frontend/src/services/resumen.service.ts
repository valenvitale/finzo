/*
 * Servicio para obtener el resumen financiero.
 * Invoca GET /api/resumen con filtros opcionales.
 */

import { apiClient } from './api';
import type {
  ResumenResponseDTO,
  FiltrosResumenDTO
} from '../types/resumen.types';

export async function obtenerResumen(
  filtros?: FiltrosResumenDTO
): Promise<ResumenResponseDTO> {
  const respuesta = await apiClient.get('/resumen', {
    params: filtros
  });

  return respuesta.data.datos;
}
