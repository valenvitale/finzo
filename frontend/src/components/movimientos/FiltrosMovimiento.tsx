/** 
 * Barra de filtros con selectores de:
 * - mes
 * - tipo (filtrado en backend vía `categoria.tipo`)
 * - categoria
 * - medio de pago
 * 
 */

import { FiltrosMovimientoDTO, TipoMovimiento } from '@/types/movimientos';
import { Categoria } from '@/types/categorias';
import { MedioPago } from '@/types/medioPago';
import { Trash } from 'lucide-react'; 
import { Selector, Tarjeta, Boton } from '../common';

interface FiltrosMovimientoProps {
    filtros: FiltrosMovimientoDTO;
    cambiarFiltros: (nuevosFiltros: FiltrosMovimientoDTO) => void;
    categorias: Categoria[];
    mediosPago: MedioPago[];
    limpiarFiltros: () => void;
}

export function FiltrosMovimiento({
    filtros,
    cambiarFiltros,
    categorias,
    mediosPago,
    limpiarFiltros,
}: FiltrosMovimientoProps) {
    
}
