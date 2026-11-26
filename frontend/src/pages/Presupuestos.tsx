import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Boton, EstadoVacio } from '../components/common';
import { FormularioPresupuesto } from '../components/presupuestos/FormularioPresupuesto';
import { ResumenMetaGlobal } from '../components/presupuestos/ResumenMetaGlobal';
import { TarjetaPresupuesto } from '../components/presupuestos/TarjetaPresupuesto';
import { useCategorias } from '../hooks/useCategorias';
import { useApi } from '../hooks/useApi';
import {
  actualizarPresupuesto,
  crearPresupuesto,
  eliminarPresupuesto,
  guardarMetaAhorro,
  listarPresupuestos,
} from '../services/presupuesto.service';
import type { CategoriaResponseDTO } from '../types/categoria.types';
import type { ActualizarPresupuestoDTO, CrearPresupuestoDTO, PresupuestoDTO } from '../types/presupuesto.types';

type DatosPresupuesto = CrearPresupuestoDTO | ActualizarPresupuestoDTO;

const meses = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

function mensajeError(error: unknown): string {
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
}

function esCreacion(datos: DatosPresupuesto): datos is CrearPresupuestoDTO {
  return 'categoriaId' in datos;
}

export default function Presupuestos() {
  const ahora = new Date();
  const [mes, setMes] = useState(ahora.getMonth() + 1);
  const [anio, setAnio] = useState(ahora.getFullYear());
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState<PresupuestoDTO>();
  const { categoriasGasto, cargando: cargandoCategorias, error: errorCategorias } = useCategorias();
  const { data: resumen, loading, error, ejecutar } = useApi(listarPresupuestos);

  useEffect(() => {
    void ejecutar({ mes, anio }).catch(() => undefined);
  }, [ejecutar, mes, anio]);

  function abrirCrear() {
    setPresupuestoSeleccionado(undefined);
    setFormularioAbierto(true);
  }

  function abrirEditar(presupuesto: PresupuestoDTO) {
    setPresupuestoSeleccionado(presupuesto);
    setFormularioAbierto(true);
  }

  async function guardar(datos: DatosPresupuesto) {
    if (esCreacion(datos)) {
      await crearPresupuesto(datos);
    } else if (presupuestoSeleccionado) {
      await actualizarPresupuesto(presupuestoSeleccionado.id, datos);
    }
    await ejecutar({ mes, anio });
    toast.success('Presupuesto guardado.');
  }

  async function eliminar(presupuesto: PresupuestoDTO) {
    if (!window.confirm(`¿Querés eliminar el presupuesto de ${presupuesto.categoriaNombre}?`)) return;
    try {
      await eliminarPresupuesto(presupuesto.id);
      await ejecutar({ mes, anio });
      toast.success('Presupuesto eliminado.');
    } catch (errorCapturado) {
      toast.error(mensajeError(errorCapturado));
    }
  }

  const categoriasDisponibles = categoriasGasto.filter(
    (categoria: CategoriaResponseDTO) =>
      !resumen?.presupuestos.some((presupuesto) => presupuesto.categoriaId === categoria.id)
  );
  const resumenActual = !loading && !error && resumen?.mes === mes && resumen.anio === anio ? resumen : undefined;

  return (
    <section className="mx-auto max-w-6xl space-y-6 pb-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-oliva sm:text-3xl">Presupuestos y metas</h1>
          <p className="mt-1 text-sm text-slate-500">
            Definí límites de gasto por categoría y seguí tu progreso mensual.
          </p>
        </div>
        <Boton
          onClick={abrirCrear}
          disabled={!resumenActual || cargandoCategorias || categoriasDisponibles.length === 0}
        >
          <Plus size={17} aria-hidden="true" /> Nuevo presupuesto
        </Boton>
      </header>

      <div className="flex flex-wrap items-end gap-3">
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          <span>Mes</span>
          <select
            value={mes}
            onChange={(evento) => setMes(Number(evento.target.value))}
            className="block min-h-11 rounded-lg border border-slate-300 bg-white px-3"
          >
            {meses.map((nombre, indice) => (
              <option key={nombre} value={indice + 1}>
                {nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          <span>Año</span>
          <input
            type="number"
            min="1900"
            max="9999"
            value={anio}
            onChange={(evento) => setAnio(Number(evento.target.value))}
            className="block min-h-11 w-28 rounded-lg border border-slate-300 bg-white px-3"
          />
        </label>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {mensajeError(error)}
          <button
            type="button"
            className="ml-2 underline"
            onClick={() => void ejecutar({ mes, anio }).catch(() => undefined)}
          >
            Reintentar
          </button>
        </div>
      )}
      {errorCategorias && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          No se pudieron cargar las categorías: {errorCategorias}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Cargando presupuestos...
        </div>
      ) : resumenActual ? (
        <>
          <ResumenMetaGlobal
            key={`${mes}-${anio}-${resumenActual.moneda.codigo}`}
            resumen={resumenActual}
            onGuardarMeta={async (monto) => {
              await guardarMetaAhorro(resumenActual.moneda.id, mes, anio, monto);
              await ejecutar({ mes, anio });
              toast.success('Meta de ahorro guardada.');
            }}
          />
          <p className="text-sm text-slate-500">
            Se muestran los presupuestos y la meta de tu moneda principal ({resumenActual.moneda.codigo}). Al cambiarla,
            los importes anteriores permanecen en su moneda original.
          </p>
          <section aria-labelledby="titulo-presupuestos" className="space-y-4">
            <h2 id="titulo-presupuestos" className="text-lg font-semibold text-oliva">
              Límites por categoría
            </h2>
            {resumenActual.presupuestos.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {resumenActual.presupuestos.map((presupuesto) => (
                  <TarjetaPresupuesto
                    key={presupuesto.id}
                    presupuesto={presupuesto}
                    codigoMoneda={resumenActual.moneda.codigo}
                    onEditar={abrirEditar}
                    onEliminar={(item) => void eliminar(item)}
                  />
                ))}
              </div>
            ) : (
              <EstadoVacio
                titulo="Todavía no hay presupuestos"
                descripcion="Agregá un límite mensual para empezar a seguir tus gastos por categoría."
              />
            )}
          </section>
        </>
      ) : null}

      {formularioAbierto && resumenActual && (
        <FormularioPresupuesto
          key={presupuestoSeleccionado?.id ?? `${mes}-${anio}-nuevo`}
          abierto={formularioAbierto}
          categorias={categoriasDisponibles}
          monedaId={resumenActual.moneda.id}
          mes={mes}
          anio={anio}
          presupuesto={presupuestoSeleccionado}
          onCerrar={() => setFormularioAbierto(false)}
          onGuardar={guardar}
        />
      )}
    </section>
  );
}
