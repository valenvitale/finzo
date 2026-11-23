/*
 * Servicio para consultar las estadísticas financieras.
 * Consume GET /api/estadisticas con filtros opcionales por fecha.
 */

import { apiClient } from './api';

import type {
  EstadisticasResponseDTO,
  FiltrosEstadisticasDTO,
} from '../types/estadisticas.types';

export async function obtenerEstadisticas(
  filtros?: FiltrosEstadisticasDTO
): Promise<EstadisticasResponseDTO> {
  const respuesta = await apiClient.get('/estadisticas', {
    params: filtros,
  });

  return respuesta.data.datos;
}