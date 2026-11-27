import { useState } from 'react';
import { useEstadisticas } from '../hooks/useEstadisticas';

import {
  Boton,
  Cargando,
  MensajeError,
} from '../components/common';

import { GraficoGastosPorCategoria } from '../components/estadisticas/GraficoGastosPorCategoria';
import { GraficoEvolucionMensual } from '../components/estadisticas/GraficoEvolucionMensual';
import { IndicadoresFinancieros } from '../components/estadisticas/IndicadoresFinancieros';

import type { FiltrosEstadisticasDTO } from '../types/estadisticas.types';

export default function Estadisticas() {
  const {
    estadisticas,
    cargando,
    error,
    setFiltros,
    recargar,
  } = useEstadisticas();

  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const [monedaSeleccionada, setMonedaSeleccionada] = useState('');

  const monedas = estadisticas.estadisticasPorMoneda;

  const monedaActual =
    monedas.find((moneda) => moneda.monedaId === monedaSeleccionada) ??
    monedas[0];

  function aplicarFiltros() {
    if (fechaDesde && fechaHasta && fechaDesde > fechaHasta) {
      return;
    }

    const nuevosFiltros: FiltrosEstadisticasDTO = {};

    if (fechaDesde) {
      nuevosFiltros.fechaDesde = fechaDesde;
    }

    if (fechaHasta) {
      nuevosFiltros.fechaHasta = fechaHasta;
    }

    setFiltros(nuevosFiltros);
  }

  function limpiarFiltros() {
    setFechaDesde('');
    setFechaHasta('');
    setFiltros({});
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-oliva sm:text-3xl">
          Estadísticas
        </h1>

        <p className="mt-1 text-sm text-slate-600">
          Analizá tus ingresos, gastos y hábitos financieros.
        </p>
      </header>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-oliva">
          Filtrar por período
        </h2>

        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Desde
            <input
              type="date"
              value={fechaDesde}
              max={fechaHasta || undefined}
              onChange={(evento) => setFechaDesde(evento.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Hasta
            <input
              type="date"
              value={fechaHasta}
              min={fechaDesde || undefined}
              onChange={(evento) => setFechaHasta(evento.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2"
            />
          </label>

          <Boton
            onClick={aplicarFiltros}
            disabled={
              Boolean(fechaDesde && fechaHasta && fechaDesde > fechaHasta)
            }
          >
            Aplicar filtros
          </Boton>

          <Boton variante="secondary" onClick={limpiarFiltros}>
            Limpiar
          </Boton>
        </div>

        {fechaDesde && fechaHasta && fechaDesde > fechaHasta && (
          <p className="mt-2 text-sm text-red-600">
            La fecha inicial no puede ser posterior a la fecha final.
          </p>
        )}
      </section>

      {cargando ? (
        <Cargando />
      ) : error ? (
        <div className="space-y-3">
          <MensajeError mensaje={error} />

          <Boton variante="secondary" onClick={recargar}>
            Reintentar
          </Boton>
        </div>
      ) : monedas.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="font-medium text-slate-700">
            Todavía no hay estadísticas para mostrar.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Registrá ingresos o gastos para comenzar a visualizar tus estadísticas.
          </p>
        </div>
      ) : (
        <>
          {monedas.length > 1 && (
            <div className="flex flex-wrap items-center gap-3">
              <label
                htmlFor="moneda-estadisticas"
                className="text-sm font-medium text-slate-700"
              >
                Moneda
              </label>

              <select
                id="moneda-estadisticas"
                value={monedaActual.monedaId}
                onChange={(evento) =>
                  setMonedaSeleccionada(evento.target.value)
                }
                className="rounded-lg border border-gray-300 bg-white px-3 py-2"
              >
                {monedas.map((moneda) => (
                  <option key={moneda.monedaId} value={moneda.monedaId}>
                    {moneda.codigoMoneda}
                  </option>
                ))}
              </select>
            </div>
          )}

          <IndicadoresFinancieros
            promedioGastoDiario={monedaActual.promedioGastoDiario}
            tasaAhorro={monedaActual.tasaAhorro}
            codigoMoneda={monedaActual.codigoMoneda}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 [&_svg.recharts-surface:focus:not(:focus-visible)]:outline-none">
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-oliva">
                Gastos por categoría
              </h2>

              <GraficoGastosPorCategoria
                datos={monedaActual.gastosPorCategoria}
              />
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-oliva">
                Evolución mensual
              </h2>

              <GraficoEvolucionMensual
                datos={monedaActual.evolucionMensual}
              />
            </section>
          </div>
        </>
      )}
    </div>
  );
}
