import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';

import { useResumen } from '../hooks/useResumen';
import { useMovimientos } from '../hooks/useMovimientos';
import { useApi } from '../hooks/useApi';

import { listarMonedasDisponibles } from '../services/moneda.service';

import { ResumenFinanciero } from '../components/dashboard/ResumenFinanciero';
import { MovimientosRecientes } from '../components/dashboard/MovimientosRecientes';
import { ResumenSkeleton } from '../components/dashboard/ResumenSkeleton';

export default function Dashboard() {
  const { resumen, cargando, error, recargar } = useResumen();

  const {
    movimientos,
    cargando: cargandoMovimientos,
    error: errorMovimientos,
    recargar: recargarMovimientos,
  } = useMovimientos();

  const {
    data: monedas,
    error: errorMonedas,
    ejecutar: cargarMonedas,
  } = useApi(listarMonedasDisponibles);

  useEffect(() => {
    void cargarMonedas().catch(() => undefined);
  }, [cargarMonedas]);

  // Relacionamos cada ID de moneda con su código.
  const codigosMoneda = new Map(
    (monedas ?? []).map((moneda) => [moneda.id, moneda.codigo])
  );

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-oliva sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Resumen de tu situación financiera
          </p>
        </div>

        <Link
          to="/movimientos?nuevo=1"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-oliva px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-oliva-oscuro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oliva"
        >
          <Plus size={18} aria-hidden="true" />
          Nuevo movimiento
        </Link>
      </div>

      {/* Resumen financiero */}
      {cargando ? (
        <ResumenSkeleton />
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
              className="mt-3 text-sm font-medium text-oliva hover:underline"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <>
            {errorMonedas && (
              <p className="text-sm text-red-600">
                No se pudieron cargar los códigos de moneda.

                <button
                  type="button"
                  onClick={() => void cargarMonedas().catch(() => undefined)}
                  className="ml-2 text-oliva hover:underline"
                >
                  Reintentar
                </button>
              </p>
            )}

            <MovimientosRecientes
              movimientos={movimientos}
              codigosMoneda={codigosMoneda}
            />
          </>
        )}
      </div>
    </section>
  );
}
