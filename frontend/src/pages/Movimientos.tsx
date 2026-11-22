import { useMovimientos } from '../hooks/useMovimientos';
import { useCategorias } from '../hooks/useCategorias';
import { useMediosPago } from '../hooks/useMediosPago';
import { Cargando, MensajeError, Boton } from '../components/common';
import { TablaMovimientos } from '../components/movimientos/TablaMovimientos';
import { FiltrosMovimiento } from '../components/movimientos/FiltrosMovimiento';
import { FormularioMovimiento } from '../components/movimientos/FormularioMovimiento';
import { useState } from 'react';

export default function Movimientos() {
    const { movimientos, cargando, error, filtros, setFiltros } = useMovimientos({});
    const { categorias } = useCategorias();
    const { mediosPago } = useMediosPago();
    const [formularioAbierto, setFormularioAbierto] = useState(false);

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
            <Boton onClick={() => setFormularioAbierto(true)}>+ Nuevo Movimiento</Boton>
            <FormularioMovimiento
                abierto={formularioAbierto}
                categorias={categorias}
                mediosPago={mediosPago}
                onCerrar={() => setFormularioAbierto(false)}
                onGuardar={async (datos) => {
                    console.log('Datos recibidos en la página', datos);
                }}
            />
            <TablaMovimientos movimientos={movimientos} onEditar={(id) => console.log('Editar', id)} onEliminar={(id) => console.log('Eliminar', id)} />
        </div>
    )
}
