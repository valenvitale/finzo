/** 
 * Tabla/listado visual de movimientos con:
 *  - montos en verde/rojo 
 *  - icono de categoría
 *  - fecha formateada
 *  - botones de acción rápida.
 */
import type { MovimientoResponseDTO } from "../../types/movimiento.types";
import { Tarjeta, EstadoVacio } from "../common";

interface TablaMovimientosProps {
    movimientos: MovimientoResponseDTO[];
    onEditar: (id: string) => void;
    onEliminar: (id: string) => void;
}

export function TablaMovimientos({ 
    movimientos, 
    onEditar, 
    onEliminar, 
}: TablaMovimientosProps) {
    if ( movimientos.length === 0) {
        return <EstadoVacio titulo="No hay movimientos registrados" descripcion="Agrega tus primeros movimientos y empezá a llevar el control de tus finanzas" />;
    }
    return (
            <Tarjeta className="overflow-hidden p-0">
                {movimientos.length}
            </Tarjeta>
    );
}