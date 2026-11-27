import { useState, useEffect } from 'react';
import type { MovimientoResponseDTO, FiltrosMovimientoDTO, ActualizarMovimientoDTO, CrearMovimientoDTO } from '../types/movimiento.types';
import * as movimientoService from '../services/movimiento.service';

export function useMovimientos(filtrosIniciales?: FiltrosMovimientoDTO) {
    // Lista de movmientos (inicia vacia)
    const [ movimientos, setMovimientos] = useState<MovimientoResponseDTO[]>([]);
    // Estado de carga inicia en true
    const [ cargando, setCargando ] = useState<boolean>(true);
    // Chequeo de errores, inicia en null (sin error)
    const [ error, setError ] = useState<string | null>(null);
    // Chequea si hay filtros, si los hay, los aplica, sino trae todos los movimientos
    const [ filtros, setFiltros ] = useState<FiltrosMovimientoDTO | undefined>(filtrosIniciales);
    // Contador de recargas
    const [recarga, setRecarga] = useState(0);

    const recargar = () => setRecarga((prev) => prev + 1);

    useEffect( () => {
        const cargar = async() => {
            try {
                setError(null);
                setCargando(true);
                const data = await movimientoService.listarMovimientos(filtros);
                setMovimientos(data);
            } catch (err) {
                const mensaje = err instanceof Error ? err.message : 'Error al cargar los movimientos';
                setError(mensaje);
            } finally {
                setCargando(false);
            }

        };
        cargar();
    }, [filtros, recarga]);

    const crear = async (datos: CrearMovimientoDTO) => {
        await movimientoService.crearMovimiento(datos);
        recargar();
    };

    const actualizar = async (id: string, cambios: ActualizarMovimientoDTO) => {
        await movimientoService.actualizarMovimiento(id, cambios);
        recargar();
    };

    const eliminar = async (id: string) => {
            await movimientoService.eliminarMovimiento(id);
            setMovimientos((prev) => prev.filter((m) => m.id !== id));
    };
    return { movimientos, cargando, error, filtros, setFiltros, eliminar, recargar, crear, actualizar };
}
