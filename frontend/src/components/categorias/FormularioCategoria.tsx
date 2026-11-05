import type { CategoriaResponseDTO, CrearCategoriaDTO, TipoMovimiento } from '../../types/categoria.types';
import { Boton, Modal } from '../common';
import { useState, type SubmitEvent } from 'react';
import { InputTexto } from '../common/InputTexto';
import { Selector } from '../common/Selector';
import { iconosCategoria } from '../../utils/iconosCategoria';

interface FormularioCategoriaProps {
  abierto: boolean;
  onCerrar: () => void;
  onGuardar: (datos: CrearCategoriaDTO) => Promise<void>;
  categoria?: CategoriaResponseDTO;
}

export function FormularioCategoria({ abierto, onCerrar, onGuardar, categoria }: FormularioCategoriaProps) {
  const [nombre, setNombre] = useState(categoria?.nombre ?? '');
  const [tipo, setTipo] = useState<TipoMovimiento>(categoria?.tipo ?? 'GASTO');
  const [color, setColor] = useState(categoria?.color ?? '#F59E0B');
  const [icono, setIcono] = useState(categoria?.icono ?? 'tag');

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cerrar = () => {
    if (!guardando) onCerrar();
  };

  const manejarSubmit = async (evento: SubmitEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (guardando) return;

    setError(null);

    if (!nombre.trim()) {
      setError('Ingresá un nombre para la categoría');
      return;
    }

    try {
      setGuardando(true);

      await onGuardar({ nombre: nombre.trim(), tipo, color, icono });

      onCerrar();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la categoría');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal abierto={abierto} onCerrar={cerrar} titulo={categoria ? 'Editar categoría' : 'Nueva categoría'}>
      <form onSubmit={manejarSubmit} className="space-y-4" aria-busy={guardando}>
        <InputTexto
          label="Nombre"
          value={nombre}
          onChange={(evento) => setNombre(evento.target.value)}
          required
          maxLength={30}
          disabled={guardando}
        />

        <Selector
          label="Tipo"
          value={tipo}
          disabled={guardando}
          onChange={(evento) => {
            const valor = evento.target.value;

            if (valor === 'INGRESO' || valor === 'GASTO') {
              setTipo(valor);
            }
          }}
        >
          <option value="GASTO">Gasto</option>
          <option value="INGRESO">Ingreso</option>
        </Selector>

        <InputTexto
          label="Color"
          type="color"
          value={color}
          onChange={(evento) => setColor(evento.target.value)}
          disabled={guardando}
          className="h-12 cursor-pointer p-1"
        />

        <fieldset disabled={guardando}>
          <legend className="mb-2 text-sm font-medium text-slate-700">Icono</legend>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {iconosCategoria.map(({ id, nombre: nombreIcono, Icono }) => (
              <button
                key={id}
                type="button"
                aria-pressed={icono === id}
                onClick={() => setIcono(id)}
                className={`flex flex-col items-center justify-center gap-2
                  rounded-xl border p-3 transition-colors duration-200
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-naranja focus-visible:ring-offset-2
                  disabled:cursor-not-allowed disabled:opacity-50 ${
                    icono === id
                      ? 'border-oliva bg-oliva-claro text-oliva ring-1 ring-oliva'
                      : 'border-slate-200 text-slate-600 enabled:hover:border-naranja enabled:hover:bg-naranja-claro enabled:hover:text-oliva'
                  }`}
              >
                <Icono size={24} aria-hidden="true" />
                <span className="text-xs">{nombreIcono}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Boton type="button" variante="secondary" onClick={cerrar} disabled={guardando}>
            Cancelar
          </Boton>

          <Boton type="submit" cargando={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </Boton>
        </div>
      </form>
    </Modal>
  );
}
