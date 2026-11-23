import { ListFilter } from 'lucide-react';
import { useState, type SubmitEvent } from 'react';
import type { FiltrosMovimientoDTO } from '@/types/movimiento.types';
import type { Categoria } from '@/types/categoria.types';
import type { MedioPago } from '@/types/medio-pago.types';
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
    const [filtrosTemporales, setFiltrosTemporales] = useState(filtros);
    const [errorPeriodo, setErrorPeriodo] = useState('');
    const anioActual = new Date().getFullYear();
    const anios = Array.from({ length: 10 }, (_, i) => anioActual - i);
    const categoriasDisponibles = filtrosTemporales.tipo
        ? categorias.filter((categoria) => categoria.tipo === filtrosTemporales.tipo)
        : categorias;

    function aplicarFiltros(evento: SubmitEvent<HTMLFormElement>) {
        evento.preventDefault();
        if (Boolean(filtrosTemporales.mes) !== Boolean(filtrosTemporales.anio)) {
            setErrorPeriodo('Seleccioná el mes y el año para filtrar por fecha.');
            return;
        }

        cambiarFiltros(filtrosTemporales.tipo === 'INGRESO'
            ? { ...filtrosTemporales, medioPagoId: undefined }
            : filtrosTemporales
        );
        setErrorPeriodo('');
    }

    function vaciarFiltros() {
        setErrorPeriodo('');
        setFiltrosTemporales({});
        limpiarFiltros();
    }

    return (
        <Tarjeta className="@container">
            <form aria-label="Filtros de movimientos" onSubmit={aplicarFiltros} className="space-y-2">
                <div className="flex flex-col gap-3 @4xl:flex-row @4xl:items-end">
                    <div className="grid min-w-0 flex-1 grid-cols-2 items-end gap-3 @lg:grid-cols-3 @3xl:grid-cols-[repeat(auto-fit,minmax(0,1fr))] [&_select]:text-sm">
                        <Selector
                            label="Año"
                            value={filtrosTemporales.anio ?? ''}
                            onChange={(e) => setFiltrosTemporales({ ...filtrosTemporales, anio: e.target.value ? Number(e.target.value) : undefined })}
                        >
                            <option value="">Todos</option>
                            {anios.map((anio) => <option key={anio} value={anio}>{anio}</option>)}
                        </Selector>
                        <Selector
                            label="Mes"
                            value={filtrosTemporales.mes ?? ''}
                            onChange={(e) => setFiltrosTemporales({ ...filtrosTemporales, mes: e.target.value ? Number(e.target.value) : undefined })}
                        >
                            <option value="">Todos</option>
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
                            value={filtrosTemporales.tipo ?? ''}
                            onChange={(e) => {
                                const valor = e.target.value;
                                const tipo = valor === 'INGRESO' || valor === 'GASTO' ? valor : undefined;
                                setFiltrosTemporales((actuales) => ({
                                    ...actuales,
                                    tipo,
                                    categoriaId: undefined,
                                    medioPagoId: tipo === 'INGRESO' ? undefined : actuales.medioPagoId,
                                }));
                            }}
                        >
                            <option value="">Todos los tipos</option>
                            <option value="INGRESO">Ingreso</option>
                            <option value="GASTO">Gasto</option>
                        </Selector>
                        <Selector
                            label="Categoría"
                            value={filtrosTemporales.categoriaId ?? ''}
                            onChange={(e) => setFiltrosTemporales({ ...filtrosTemporales, categoriaId: e.target.value || undefined })}
                        >
                            <option value="">Todas</option>
                            {categoriasDisponibles.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                            ))}
                        </Selector>
                        {filtrosTemporales.tipo !== 'INGRESO' && (
                            <Selector
                                label="Medio de pago"
                                value={filtrosTemporales.medioPagoId ?? ''}
                                onChange={(e) => setFiltrosTemporales({ ...filtrosTemporales, medioPagoId: e.target.value || undefined })}
                            >
                                <option value="">Todos</option>
                                {mediosPago.map((medioPago) => (
                                    <option key={medioPago.id} value={medioPago.id}>{medioPago.nombre}</option>
                                ))}
                            </Selector>
                        )}
                    </div>
                    <div className="flex shrink-0 flex-wrap justify-end gap-2">
                        <Boton variante="ghost" onClick={vaciarFiltros}>Limpiar</Boton>
                        <Boton variante="secondary" type="submit">
                            <ListFilter size={16} aria-hidden="true" /> Aplicar filtros
                        </Boton>
                    </div>
                </div>
                {errorPeriodo && <p role="alert" className="text-sm text-gasto">{errorPeriodo}</p>}
            </form>
        </Tarjeta>
    );
}
