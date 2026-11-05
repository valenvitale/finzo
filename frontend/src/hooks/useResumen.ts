import { useState, useEffect } from 'react';
import type {
  ResumenResponseDTO,
  FiltrosResumenDTO
} from '../types/resumen.types';
import * as resumenService from '../services/resumen.service';

export function useResumen(filtrosIniciales?: FiltrosResumenDTO) {
  const [resumen, setResumen] = useState<ResumenResponseDTO | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filtros, setFiltros] = useState<FiltrosResumenDTO | undefined>(
    filtrosIniciales
  );

  const [recarga, setRecarga] = useState(0);

  const recargar = () => setRecarga((prev) => prev + 1);

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      try {
        setCargando(true);
        setError(null);

        const data = await resumenService.obtenerResumen(filtros);

        if (activo) {
          setResumen(data);
        }
      } catch (err) {
        if (activo) {
          const mensaje = err instanceof Error
            ? err.message
            : 'Error al cargar el resumen financiero';

          setError(mensaje);
          setResumen(null);
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    void cargar();

    return () => {
      activo = false;
    };
  }, [filtros, recarga]);

  return {
    resumen,
    cargando,
    error,
    filtros,
    setFiltros,
    recargar
  };
}
