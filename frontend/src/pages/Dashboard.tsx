import { Link } from 'react-router-dom';
import { Plus, Tags, RefreshCw } from 'lucide-react';

import { useResumen } from '../hooks/useResumen';
import { useMovimientos } from '../hooks/useMovimientos';

import { ResumenFinanciero } from '../components/dashboard/ResumenFinanciero';
import { MovimientosRecientes } from '../components/dashboard/MovimientosRecientes';

export default function Dashboard() {
  const { resumen, cargando, error, recargar } = useResumen();

  const {
    movimientos,
    cargando: cargandoMovimientos,
    error: errorMovimientos,
    recargar: recargarMovimientos,
  } = useMovimientos();

  return (
    <section className="space-y-6">
      {/* Encabezado del Dashboard */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Resumen de tu situación financiera
          </p>
        </div>

        {/* Acciones rápidas */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/movimientos"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Nuevo movimiento
          </Link>

          <Link
            to="/categorias"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Tags size={18} />
            Categorías
          </Link>
        </div>
      </div>

      {/* Resumen financiero */}
      {cargando ? (
        <p className="text-slate-500">
          Cargando resumen financiero...
        </p>
      ) : error ? (
        <div className="space-y-3">
          <p className="text-red-600">{error}</p>

          <button
            type="button"
            onClick={recargar}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm"
          >
            <RefreshCw size={16} />
            Reintentar
          </button>
        </div>
      ) : resumen ? (
        <ResumenFinanciero
          totalIngresos={resumen.totalIngresos}
          totalGastos={resumen.totalGastos}
          balance={resumen.balance}
          moneda={resumen.moneda}
        />
      ) : (
        <p className="text-slate-500">
          Todavía no hay información financiera disponible.
        </p>
      )}

      {/* Últimos cinco movimientos */}
      <div className="space-y-4">
        {cargandoMovimientos ? (
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-5 h-6 w-44 animate-pulse rounded bg-slate-200" />

            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-12 animate-pulse rounded bg-slate-100"
                />
              ))}
            </div>
          </div>
        ) : errorMovimientos ? (
          <div className="rounded-xl border border-red-200 bg-white p-5">
            <p className="text-sm text-red-600">
              No se pudieron cargar los movimientos.
            </p>

            <button
              type="button"
              onClick={recargarMovimientos}
              className="mt-3 text-sm font-medium text-blue-600 hover:underline"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <MovimientosRecientes movimientos={movimientos} />
        )}
      </div>
    </section>
  );
}