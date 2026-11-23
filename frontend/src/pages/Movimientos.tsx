import { useMovimientos } from '../hooks/useMovimientos';
import { useCategorias } from '../hooks/useCategorias';
import { useMediosPago } from '../hooks/useMediosPago';
import { Cargando, MensajeError, Boton, toast } from '../components/common';
import { TablaMovimientos } from '../components/movimientos/TablaMovimientos';
import { FiltrosMovimiento } from '../components/movimientos/FiltrosMovimiento';
import { FormularioMovimiento } from '../components/movimientos/FormularioMovimiento';
import { useState, useEffect } from 'react';
import type { MovimientoResponseDTO, ActualizarMovimientoDTO, CrearMovimientoDTO } from '../types/movimiento.types';
import { listarMonedasDisponibles, listarMonedasPerfil } from '../services/moneda.service';
import { useApi } from '../hooks/useApi';

async function obtenerMonedas() {
    const [asignadas, catalogo] = await Promise.all([
        listarMonedasPerfil(),
        listarMonedasDisponibles(),
    ]);

    return { asignadas, catalogo };
}

export default function Movimientos() {
    const { movimientos, cargando, error, filtros, setFiltros, eliminar, crear, actualizar } = useMovimientos({});
    const { categorias } = useCategorias();
    const { mediosPago } = useMediosPago();
    const [formularioAbierto, setFormularioAbierto] = useState(false);
    const [movimientoEditado, setMovimientoEditado] = useState<MovimientoResponseDTO | null>(null);

    function abrirEdicion(id: string) {
        const seleccionado = movimientos.find((movimiento) => movimiento.id === id);
        if (!seleccionado) return;

        setMovimientoEditado(seleccionado);
        setFormularioAbierto(true);
    }

    async function guardarMovimiento(datos: CrearMovimientoDTO) {
        if (!movimientoEditado) {
            await crear(datos);
            toast.success('Movimiento creado.');
            setFormularioAbierto(false);
            return;
        }

        const cambios: ActualizarMovimientoDTO = {};

        if (datos.monto !== movimientoEditado.monto) cambios.monto = datos.monto;
        if (datos.fecha !== movimientoEditado.fecha.slice(0, 10)) cambios.fecha = datos.fecha;
        if (datos.descripcion !== movimientoEditado.descripcion) cambios.descripcion = datos.descripcion;
        if (datos.categoriaId !== movimientoEditado.categoriaId) cambios.categoriaId = datos.categoriaId;
        if (datos.medioPagoId !== movimientoEditado.medioPagoId) cambios.medioPagoId = datos.medioPagoId;
        if (datos.monedaId !== movimientoEditado.monedaId) cambios.monedaId = datos.monedaId;

        if (Object.keys(cambios).length > 0) {
            await actualizar(movimientoEditado.id, cambios);
            toast.success('Movimiento actualizado.');
        }

        setFormularioAbierto(false);
    }

    async function manejarEliminacion(id: string) {
        if (!window.confirm('¿Querés eliminar este movimiento?')) return;

        try {
            await eliminar(id);
            toast.success('Movimiento eliminado.');
        } catch {
            toast.error('No se pudo eliminar el movimiento.');
        }
    }

    const { data: monedas, error: errorMonedas, ejecutar: cargarMonedas } = useApi(obtenerMonedas);

    useEffect(() => {
        void cargarMonedas().catch(() => undefined);
    }, [cargarMonedas]);

    const monedasAsignadas = monedas?.asignadas ?? [];
    const codigosMoneda = new Map(
        (monedas?.catalogo ?? []).map((moneda) => [moneda.id, moneda.codigo])
    );

    if (cargando) {
        return <Cargando />;
    }

    if (error) {
        return <MensajeError mensaje={error} />;
    }

    return (
        <div>
            <h1>Movimientos</h1>
            <p>{movimientos.length} movimientos registrados</p>
            <p>{categorias.length} categorías registradas</p>
            <p>{mediosPago.length} medios de pago registrados</p>
            <FiltrosMovimiento filtros={filtros ?? {}} cambiarFiltros={setFiltros} limpiarFiltros={() => setFiltros({})} categorias={categorias} mediosPago={mediosPago} />
            <Boton
                disabled={monedasAsignadas.length === 0}
                onClick={() => {
                    setMovimientoEditado(null);
                    setFormularioAbierto(true);
                }}
            >
                + Nuevo Movimiento
            </Boton>
            {errorMonedas && (
                <>
                    <MensajeError mensaje="No se pudieron cargar las monedas." />
                    <Boton
                        variante="secondary"
                        onClick={() => void cargarMonedas().catch(() => undefined)}
                    >
                        Reintentar carga de monedas
                    </Boton>
                </>
            )}
            {!errorMonedas && monedas && monedasAsignadas.length === 0 && (
                <p>Agregá una moneda en Perfil para registrar movimientos.</p>
            )}
            {formularioAbierto && (
                <FormularioMovimiento
                    abierto={formularioAbierto}
                    movimiento={movimientoEditado ?? undefined}
                    categorias={categorias}
                    mediosPago={mediosPago}
                    monedas={monedasAsignadas}
                    onCerrar={() => setFormularioAbierto(false)}
                    onGuardar={guardarMovimiento}
                />
            )}
            <TablaMovimientos
                movimientos={movimientos}
                codigosMoneda={codigosMoneda}
                onEditar={abrirEdicion}
                onEliminar={(id) => void manejarEliminacion(id)}
            />
        </div>
    )
}
