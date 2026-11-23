import { useMovimientos } from '../hooks/useMovimientos';
import { useCategorias } from '../hooks/useCategorias';
import { useMediosPago } from '../hooks/useMediosPago';
import { Cargando, MensajeError, Boton, toast } from '../components/common';
import { TablaMovimientos } from '../components/movimientos/TablaMovimientos';
import { FiltrosMovimiento } from '../components/movimientos/FiltrosMovimiento';
import { FormularioMovimiento } from '../components/movimientos/FormularioMovimiento';
import { useState } from 'react';
import type { MovimientoResponseDTO, ActualizarMovimientoDTO, CrearMovimientoDTO } from '../types/movimiento.types';

export default function Movimientos() {
    const { movimientos, cargando, error, filtros, setFiltros, eliminar, actualizar } = useMovimientos({});
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

    async function guardarEdicion(datos: Omit<CrearMovimientoDTO, 'monedaId'>) {
        if (!movimientoEditado) return;

        const cambios: ActualizarMovimientoDTO = {};

        if (datos.monto !== movimientoEditado.monto) cambios.monto = datos.monto;
        if (datos.fecha !== movimientoEditado.fecha.slice(0, 10)) cambios.fecha = datos.fecha;
        if (datos.descripcion !== movimientoEditado.descripcion) cambios.descripcion = datos.descripcion;
        if (datos.categoriaId !== movimientoEditado.categoriaId) cambios.categoriaId = datos.categoriaId;
        if (datos.medioPagoId !== movimientoEditado.medioPagoId) cambios.medioPagoId = datos.medioPagoId;

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
            <Boton onClick={ () => {
                setMovimientoEditado(null);
                setFormularioAbierto(true);
                }}> + Nuevo Movimiento </Boton>
            {formularioAbierto && (
                <FormularioMovimiento
                    abierto={formularioAbierto}
                    movimiento={movimientoEditado ?? undefined}
                    categorias={categorias}
                    mediosPago={mediosPago}
                    onCerrar={() => setFormularioAbierto(false)}
                    onGuardar={guardarEdicion}
                />
            )}
            <TablaMovimientos movimientos={movimientos} onEditar={abrirEdicion} onEliminar={(id) => manejarEliminacion(id)} />
        </div>
    )
}
