import { Link } from 'react-router-dom';
import { ArrowDownLeft, ArrowUpRight, ArrowRight } from 'lucide-react';

import type { MovimientoResponseDTO } from '../../types/movimiento.types';
import { Tarjeta } from '../common/Tarjeta';
import { formatearMonto, formatearFecha } from '../../utils/formateadores';
import { formatearNumero } from '../../utils/formato';

interface MovimientosRecientesProps {
  movimientos: MovimientoResponseDTO[];
  codigosMoneda: ReadonlyMap<string, string>;
}

export function MovimientosRecientes({
  movimientos,
  codigosMoneda,
}: MovimientosRecientesProps) {
  // Ordenamos por fecha y mostramos los primeros cinco movimientos.
  const ultimosMovimientos = [...movimientos]
    .sort((a, b) => {
      const diferenciaFechas =
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime();

      return diferenciaFechas !== 0
        ? diferenciaFechas
        : new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime();
    })
    .slice(0, 5);

  return (
    <Tarjeta>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Últimos movimientos
        </h2>

        <Link
          to="/movimientos"
          className="inline-flex shrink-0 items-center gap-1 rounded-sm text-sm font-medium text-oliva hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oliva"
        >
          Ver más
          <ArrowRight size={16} />
        </Link>
      </div>

      {ultimosMovimientos.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500">
          Todavía no tenés movimientos registrados.
        </p>
      ) : (
        <div className="divide-y divide-slate-100">
          {ultimosMovimientos.map((movimiento) => {
            const esIngreso = movimiento.tipo === 'INGRESO';

            const codigo = codigosMoneda.get(movimiento.monedaId);

            const importe = codigo
              ? formatearMonto(movimiento.monto, codigo)
              : formatearNumero(movimiento.monto);

            return (
              <div
                key={movimiento.id}
                className="flex items-center gap-3 py-3"
              >
                <div
                  className={`rounded-lg p-2 ${
                    esIngreso
                      ? 'bg-green-50 text-green-600'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {esIngreso ? (
                    <ArrowUpRight size={20} />
                  ) : (
                    <ArrowDownLeft size={20} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {movimiento.descripcion || 'Sin descripción'}
                  </p>

                  <p className="text-xs text-slate-500">
                    {formatearFecha(movimiento.fecha)}
                  </p>
                </div>

                <span
                  className={`shrink-0 text-sm font-semibold ${
                    esIngreso ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {esIngreso ? '+ ' : '- '}
                  {importe}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Tarjeta>
  );
}
