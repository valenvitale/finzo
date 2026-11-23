import { useEffect, useState } from 'react';

import type {
  EstadisticasResponseDTO,
  FiltrosEstadisticasDTO,
} from '../types/estadisticas.types';

import * as estadisticasService from '../services/estadisticas.service';

export function useEstadisticas(
  filtrosIniciales?: FiltrosEstadisticasDTO
) {
  const [estadisticas, setEstadisticas] =
    useState<EstadisticasResponseDTO>({
      estadisticasPorMoneda: [],
    });

  const [cargando, setCargando] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);

  const [filtros, setFiltros] = useState<
    FiltrosEstadisticasDTO | undefined
  >(filtrosIniciales);

  const [recarga, setRecarga] = useState<number>(0);

  const recargar = () => {
    setRecarga((prev) => prev + 1);
  };

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      try {
        setCargando(true);
        setError(null);

        const datos =
          await estadisticasService.obtenerEstadisticas(filtros);

        if (activo) {
          setEstadisticas(datos);
        }
      } catch (err) {
        if (activo) {
          const mensaje =
            err instanceof Error
              ? err.message
              : 'Error al cargar las estadísticas';

          setError(mensaje);
          setEstadisticas({ estadisticasPorMoneda: [] });
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargar();

    return () => {
      activo = false;
    };
  }, [filtros, recarga]);

  return {
    estadisticas,
    cargando,
    error,
    filtros,
    setFiltros,
    recargar,
  };
}
