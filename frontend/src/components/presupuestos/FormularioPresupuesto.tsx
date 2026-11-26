import { useState, type FormEvent } from 'react';
import type { CategoriaResponseDTO } from '../../types/categoria.types';
import type { ActualizarPresupuestoDTO, CrearPresupuestoDTO, PresupuestoDTO } from '../../types/presupuesto.types';
import { Boton, InputTexto, Modal, Selector } from '../common';

type DatosPresupuesto = CrearPresupuestoDTO | ActualizarPresupuestoDTO;

interface FormularioPresupuestoProps {
  abierto: boolean;
  categorias: CategoriaResponseDTO[];
  monedaId: string;
  mes: number;
  anio: number;
  presupuesto?: PresupuestoDTO;
  onCerrar: () => void;
  onGuardar: (datos: DatosPresupuesto) => Promise<void>;
}

export function FormularioPresupuesto({
  abierto,
  categorias,
  monedaId,
  mes,
  anio,
  presupuesto,
  onCerrar,
  onGuardar,
}: FormularioPresupuestoProps) {
  const [categoriaId, setCategoriaId] = useState(presupuesto?.categoriaId ?? categorias[0]?.id ?? '');
  const [limiteMensual, setLimiteMensual] = useState(presupuesto ? String(presupuesto.limiteMensual) : '');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function manejarSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (guardando) return;

    const limite = Number(limiteMensual);
    if (!Number.isFinite(limite) || limite <= 0) {
      setError('Ingresá un límite mensual mayor que cero.');
      return;
    }

    setError(null);
    setGuardando(true);
    try {
      if (presupuesto) {
        await onGuardar({ limiteMensual: limite });
      } else {
        await onGuardar({ categoriaId, monedaId, limiteMensual: limite, mes, anio });
      }
      onCerrar();
    } catch (errorCapturado) {
      setError(errorCapturado instanceof Error ? errorCapturado.message : 'No se pudo guardar el presupuesto.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal
      abierto={abierto}
      onCerrar={() => {
        if (!guardando) onCerrar();
      }}
      titulo={presupuesto ? 'Editar presupuesto' : 'Nuevo presupuesto'}
    >
      <form onSubmit={manejarSubmit} className="space-y-4" aria-busy={guardando}>
        {presupuesto ? (
          <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
            {presupuesto.categoriaNombre} · {presupuesto.mes}/{presupuesto.anio}
          </div>
        ) : (
          <Selector
            label="Categoría de gasto"
            value={categoriaId}
            onChange={(evento) => setCategoriaId(evento.target.value)}
            required
            disabled={guardando}
          >
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </Selector>
        )}

        <InputTexto
          label="Límite mensual"
          type="number"
          min="0.01"
          step="0.01"
          value={limiteMensual}
          onChange={(evento) => setLimiteMensual(evento.target.value)}
          required
          disabled={guardando}
          textoAyuda="El monto se expresa en tu moneda principal."
        />

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Boton variante="secondary" onClick={onCerrar} disabled={guardando}>
            Cancelar
          </Boton>
          <Boton type="submit" cargando={guardando}>
            Guardar
          </Boton>
        </div>
      </form>
    </Modal>
  );
}
