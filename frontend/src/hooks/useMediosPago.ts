import { listarMediosPago, crearMedioPago, actualizarMedioPago, eliminarMedioPago } from '../services/medio-pago.service';
import { useState, useCallback, useEffect } from 'react';
import type { MedioPago, CrearMedioPagoDTO, ActualizarMedioPagoDTO } from '../types/medio-pago.types';

export function useMediosPago() {
  const [mediosPago, setMediosPago] = useState<MedioPago[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const cargarMediosPago = useCallback(async (): Promise<void> => {
        setCargando(true);
        setError(null);

        try {
            const medios = await listarMediosPago();
                setMediosPago(medios)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'No se pudieron cargar los medios de pago.');
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        let activo = true;

        listarMediosPago()
            .then((medios) => {
            if (activo) setMediosPago(medios);
            })
            .catch((error: unknown) => {
            if (activo) {
                setError(error instanceof Error
                ? error.message
                : 'No se pudieron cargar los medios de pago.');
            }
            })
            .finally(() => {
            if (activo) setCargando(false);
            });

        return () => {
            activo = false;
        };
    }, []);

    async function crear(datos: CrearMedioPagoDTO): Promise<MedioPago> {
        setGuardando(true);
        setError(null);

        try {
            const nuevoMedio = await crearMedioPago(datos);
            setMediosPago((anteriores) => [...anteriores, nuevoMedio]);
            return nuevoMedio;
        } catch (error) {
            setError(error instanceof Error
                ? error.message 
                : 'No se pudo crear el medio de pago.'
            );
            throw error;
        } finally {
            setGuardando(false);
        }
    }

    async function actualizar(id: string, datos: ActualizarMedioPagoDTO): Promise<MedioPago> {
        setGuardando(true);
        setError(null);

        try {
            const medioActualizado = await actualizarMedioPago(id, datos);
            setMediosPago((anteriores) => 
                anteriores.map((medio) => medio.id === id ?
            medioActualizado : medio)
            );
            return medioActualizado;
        } catch (error) {
            setError(error instanceof Error
                ? error.message 
                : 'No se pudo actualizar el medio de pago.'
            );
            throw error;
        } finally {
            setGuardando(false);
        }
    }

    async function eliminar(id: string): Promise<void> {
        setGuardando(true);
        setError(null);

        try {
            await eliminarMedioPago(id);
            setMediosPago((anteriores) =>
            anteriores.filter((medio) => medio.id !== id)
            );
        } catch (error) {
            setError(
            error instanceof Error
                ? error.message
                : 'No se pudo eliminar el medio de pago.'
            );
            throw error;
        } finally {
            setGuardando(false);
        }
    }

    return {
        mediosPago,
        cargando,
        guardando,
        error,
        cargarMediosPago,
        crear,
        actualizar,
        eliminar,
    };
}