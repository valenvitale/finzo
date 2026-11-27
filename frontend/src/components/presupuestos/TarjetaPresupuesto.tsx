import { Pencil, Trash2 } from 'lucide-react';
import type { PresupuestoDTO } from '../../types/presupuesto.types';
import { formatearMonto, obtenerEstadoPresupuesto } from '../../utils/presupuesto';
import { Boton } from '../common';

interface TarjetaPresupuestoProps {
  presupuesto: PresupuestoDTO;
  codigoMoneda: string;
  onEditar: (presupuesto: PresupuestoDTO) => void;
  onEliminar: (presupuesto: PresupuestoDTO) => void;
}

const coloresEstado = {
  verde: 'bg-emerald-500',
  amarillo: 'bg-amber-400',
  rojo: 'bg-red-500',
};

export function TarjetaPresupuesto({ presupuesto, codigoMoneda, onEditar, onEliminar }: TarjetaPresupuestoProps) {
  const porcentaje = presupuesto.porcentajeUsado;
  const estado = obtenerEstadoPresupuesto(porcentaje);
  const progreso = Math.min(Math.max(porcentaje, 0), 100);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className="size-3 shrink-0 rounded-full"
            style={{ backgroundColor: presupuesto.categoriaColor }}
          />
          <h3 className="truncate font-semibold text-oliva">{presupuesto.categoriaNombre}</h3>
        </div>
        <div className="flex shrink-0 gap-1">
          <Boton
            variante="ghost"
            tamanio="icon"
            aria-label={`Editar presupuesto de ${presupuesto.categoriaNombre}`}
            onClick={() => onEditar(presupuesto)}
          >
            <Pencil size={16} aria-hidden="true" />
          </Boton>
          <Boton
            variante="ghost"
            tamanio="icon"
            aria-label={`Eliminar presupuesto de ${presupuesto.categoriaNombre}`}
            onClick={() => onEliminar(presupuesto)}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 size={16} aria-hidden="true" />
          </Boton>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-sm text-slate-600">
          {formatearMonto(presupuesto.gastoActual, codigoMoneda)} de{' '}
          {formatearMonto(presupuesto.limiteMensual, codigoMoneda)}
        </p>
        <p className="text-sm font-semibold text-slate-800">{porcentaje.toFixed(1)}%</p>
      </div>
      <div
        role="progressbar"
        aria-label={`Uso del presupuesto de ${presupuesto.categoriaNombre}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progreso}
        className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100"
      >
        <div
          className={`h-full rounded-full transition-[width] ${coloresEstado[estado]}`}
          style={{ width: `${progreso}%` }}
        />
      </div>
      <p className={`mt-2 text-sm ${presupuesto.disponible < 0 ? 'text-red-600' : 'text-slate-500'}`}>
        {presupuesto.disponible < 0 ? 'Excedido por ' : 'Disponible: '}
        {formatearMonto(Math.abs(presupuesto.disponible), codigoMoneda)}
      </p>
    </article>
  );
}
