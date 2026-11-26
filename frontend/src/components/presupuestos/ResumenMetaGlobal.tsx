import { useState, type FormEvent } from 'react';
import type { ResumenPresupuestosDTO } from '../../types/presupuesto.types';
import { formatearMonto, obtenerEstadoPresupuesto } from '../../utils/presupuesto';
import { Boton, InputTexto } from '../common';

interface ResumenMetaGlobalProps {
  resumen: ResumenPresupuestosDTO;
  onGuardarMeta: (monto: number) => Promise<void>;
}

const coloresEstado = {
  verde: 'bg-emerald-500',
  amarillo: 'bg-amber-400',
  rojo: 'bg-red-500',
};

export function ResumenMetaGlobal({ resumen, onGuardarMeta }: ResumenMetaGlobalProps) {
  const porcentaje = resumen.porcentajeUsado;
  const estado = obtenerEstadoPresupuesto(porcentaje);
  const progreso = Math.min(Math.max(porcentaje, 0), 100);
  const [montoMeta, setMontoMeta] = useState(resumen.metaAhorro ? String(resumen.metaAhorro.monto) : '');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function guardar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const monto = Number(montoMeta);
    if (
      !Number.isFinite(monto) ||
      monto <= 0 ||
      monto > 9_999_999_999.99 ||
      Math.abs(monto - Math.round(monto * 100) / 100) >= 0.00000001
    ) {
      setError('Ingresá un monto positivo de hasta dos decimales.');
      return;
    }
    setError(null);
    setGuardando(true);
    try {
      await onGuardarMeta(monto);
    } catch (errorCapturado) {
      setError(errorCapturado instanceof Error ? errorCapturado.message : 'No se pudo guardar la meta.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section
      aria-labelledby="titulo-meta-global"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="titulo-meta-global" className="text-lg font-semibold text-oliva">
            Resumen de presupuestos
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
      <div className="mt-6 border-t border-slate-200 pt-5">
        <h3 className="text-lg font-semibold text-oliva">Meta mensual de ahorro</h3>
        <p className="mt-1 text-sm text-slate-500">
          El ahorro es la diferencia entre todos los ingresos y gastos del mes en {resumen.moneda.codigo}.
        </p>
        {resumen.metaAhorro ? (
          <div className="mt-4">
            <p className="text-sm text-slate-700">
              Ahorro: {formatearMonto(resumen.metaAhorro.ahorroActual, resumen.moneda.codigo)} de{' '}
              {formatearMonto(resumen.metaAhorro.monto, resumen.moneda.codigo)} (
              {resumen.metaAhorro.porcentajeCumplido.toFixed(1)}%)
            </p>
            <progress
              aria-label="Cumplimiento de la meta de ahorro"
              max={100}
              value={Math.min(resumen.metaAhorro.porcentajeCumplido, 100)}
              className="mt-2 w-full accent-emerald-600"
            />
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-600">Todavía no definiste una meta para este período.</p>
        )}
        <form onSubmit={guardar} className="mt-4 flex flex-wrap items-end gap-3">
          <InputTexto
            label="Meta de ahorro mensual"
            type="number"
            min="0.01"
            max="9999999999.99"
            step="0.01"
            required
            value={montoMeta}
            onChange={(evento) => setMontoMeta(evento.target.value)}
            disabled={guardando}
          />
          <Boton type="submit" cargando={guardando}>
            Guardar meta
          </Boton>
        </form>
        {error && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
