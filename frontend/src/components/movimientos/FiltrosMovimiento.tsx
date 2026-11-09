/** 
 * Barra de filtros con selectores de:
 * - mes
 * - tipo (filtrado en backend vía `categoria.tipo`)
 * - categoria
 * - medio de pago
 */

import type { FiltrosMovimientoDTO, TipoMovimiento } from '@/types/movimiento.types';
import type { Categoria } from '@/types/categoria.types';
import type { MedioPago } from '@/types/medio-pago.types';
import { Trash } from 'lucide-react'; 
import { Selector, Tarjeta, Boton } from '../common';
import { useState } from 'react';

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
    const [filtrosTemporales, setFiltrosTemporales] = useState(filtros);
    const [errorPeriodo, setErrorPeriodo] = useState<string>("");
    const anioActual = new Date().getFullYear();
    const cantidadAnios = 10;
    const anios: number[] = Array.from({ length: cantidadAnios }, (_, i) => anioActual - i);

    function aplicarFiltros() {
        if ((!filtrosTemporales.mes && !filtrosTemporales.anio) || (filtrosTemporales.mes && filtrosTemporales.anio)){
            cambiarFiltros(filtrosTemporales);
            setErrorPeriodo('');
        } else {
            setErrorPeriodo("Debe seleccionar tanto el mes como el año para filtrar por fecha.");
        }
    }

    function vaciarFiltros(){
        setErrorPeriodo('');
        // Limpio el borrador que almacena los filtros temporales
        setFiltrosTemporales({
            mes: undefined,
            anio: undefined,
            tipo: undefined,
            categoriaId: undefined,
            medioPagoId: undefined
        });
        // Limpio los filtros aplicados en el componente padre
        limpiarFiltros();
    }

    function categoriasDisponibles(){
        if (filtrosTemporales.tipo === "INGRESO") {
            return categorias.filter((categoria) => categoria.tipo === "INGRESO");
        } else if (filtrosTemporales.tipo === "GASTO") {
            return categorias.filter((categoria) => categoria.tipo === "GASTO");
        } else {
            return categorias;
        }
    }
    
    return (
        <>
            <Tarjeta className="flex flex-col gap-4">
                <Selector 
                    label="Año" 
                    value={filtrosTemporales.anio ?? ""} 
                    onChange={(e) => setFiltrosTemporales({ ...filtrosTemporales, anio: e.target.value === "" ? undefined : Number(e.target.value) })}
                >
                    <option value="">Seleccionar año</option>
                    {anios.map((anio) => (
                        <option key={anio} value={anio}>{anio}</option>
                    ))}
                </Selector>
                <Selector
                    label="Mes"
                    value={filtrosTemporales.mes ?? ""}
                    onChange={(e) => setFiltrosTemporales({ ...filtrosTemporales, mes: e.target.value === "" ? undefined: Number(e.target.value) })}
                    error={errorPeriodo}
                >
                    <option value="">Seleccionar mes</option>
                    <option value="1">Enero</option>
                    <option value="2">Febrero</option>
                    <option value="3">Marzo</option>
                    <option value="4">Abril</option>
                    <option value="5">Mayo</option>
                    <option value="6">Junio</option>
                    <option value="7">Julio</option>
                    <option value="8">Agosto</option>
                    <option value="9">Septiembre</option>
                    <option value="10">Octubre</option>
                    <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                </Selector>
                <Selector
                    label="Tipo de movimiento"
                    value={filtrosTemporales.tipo ?? ""}
                    onChange={(e) => setFiltrosTemporales({
                        ...filtrosTemporales,
                        tipo: e.target.value === "" ? undefined : e.target.value === "INGRESO" ? "INGRESO" : "GASTO",
                        categoriaId: undefined,
                    })}
                >
                    <option value="">Todos los tipos</option>
                    <option value="INGRESO">Ingreso</option>
                    <option value="GASTO">Gasto</option>
                </Selector>
                <Selector
                    label="Categoría"
                    value={filtrosTemporales.categoriaId ?? ""}
                    onChange={(e) => setFiltrosTemporales({ ...filtrosTemporales, categoriaId: e.target.value === "" ? undefined : e.target.value })}
                >
                    <option value="">Todas las categorías</option>
                    {categoriasDisponibles().map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                            {categoria.nombre}
                        </option>
                    ))}
                </Selector>
                <Selector
                    label="Medio de pago"
                    value={filtrosTemporales.medioPagoId ?? ""}
                    onChange={(e) => setFiltrosTemporales({ ...filtrosTemporales, medioPagoId: e.target.value === "" ? undefined : e.target.value })}
                >
                    <option value="">Todos los medios de pago</option>
                    {mediosPago.map((medioPago) => (
                        <option key={medioPago.id} value={medioPago.id}>
                            {medioPago.nombre}
                        </option>
                    ))}
                </Selector>
                <Boton variante="primary" onClick={aplicarFiltros}>Aplicar Filtros</Boton>
                <Boton variante="secondary" onClick={vaciarFiltros}>Limpiar Filtros</Boton>
            </Tarjeta>
        </>
    )
    
}
