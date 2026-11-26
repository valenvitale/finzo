import type { ResumenPresupuestosDTO } from '../../types/presupuesto.types';
import { formatearMonto, obtenerEstadoPresupuesto } from '../../utils/presupuesto';

interface ResumenMetaGlobalProps {
  resumen: ResumenPresupuestosDTO;
}

const coloresEstado = {
  verde: 'bg-emerald-500',
  amarillo: 'bg-amber-400',
  rojo: 'bg-red-500',
};

export function ResumenMetaGlobal({ resumen }: ResumenMetaGlobalProps) {
  const porcentaje = resumen.porcentajeUsado;
  const estado = obtenerEstadoPresupuesto(porcentaje);
  const progreso = Math.min(Math.max(porcentaje, 0), 100);

  return (
    <section
      aria-labelledby="titulo-meta-global"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="titulo-meta-global" className="text-lg font-semibold text-oliva">
            Meta global de ahorro
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Seguimiento del gasto frente a los límites mensuales que definiste.
          </p>
        </div>
        <p className="rounded-full bg-oliva-claro px-3 py-1 text-sm font-semibold text-oliva">
          {resumen.mes}/{resumen.anio}
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-sm text-slate-500">Límites totales</p>
          <p className="mt-1 text-xl font-semibold text-oliva">
            {formatearMonto(resumen.totalLimiteMensual, resumen.moneda.codigo)}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Gastado</p>
          <p className="mt-1 text-xl font-semibold text-slate-800">
            {formatearMonto(resumen.totalGastado, resumen.moneda.codigo)}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500">{resumen.totalDisponible < 0 ? 'Excedido' : 'Disponible'}</p>
          <p
            className={`mt-1 text-xl font-semibold ${
              resumen.totalDisponible < 0 ? 'text-red-600' : 'text-emerald-700'
            }`}
          >
            {formatearMonto(Math.abs(resumen.totalDisponible), resumen.moneda.codigo)}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
          <span className="font-medium text-slate-700">Uso de los límites</span>
          <span className="font-semibold text-slate-800">{porcentaje.toFixed(1)}%</span>
        </div>
        <div
          role="progressbar"
          aria-label="Porcentaje global de presupuestos utilizados"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progreso}
          className="h-3 overflow-hidden rounded-full bg-slate-100"
        >
          <div
            className={`h-full rounded-full transition-[width] ${coloresEstado[estado]}`}
            style={{ width: `${progreso}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Disponible equivale a límites asignados menos gastos registrados en la moneda principal.
        </p>
      </div>
    </section>
  );
}
