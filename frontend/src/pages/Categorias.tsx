import { useCategorias } from '../hooks/useCategorias';
import { useState } from 'react';
import type { CategoriaResponseDTO, CrearCategoriaDTO } from '../types/categoria.types';
import { FormularioCategoria } from '../components/categorias/FormularioCategoria';
import { ListaCategorias } from '../components/categorias/ListaCategorias';
import { Boton } from '../components/common/Boton';
import { LockKeyhole, Plus, Tags } from 'lucide-react';

export default function Categorias() {
  const { categorias, cargando, error, crear, actualizar, eliminar } = useCategorias();

  const categoriasSistema = categorias.filter((categoria) => categoria.perfilId === null);
  const categoriasPersonalizadas = categorias.filter((categoria) => categoria.perfilId !== null);

  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaResponseDTO | undefined>(undefined);

  const abrirCrear = () => {
    setCategoriaSeleccionada(undefined);
    setFormularioAbierto(true);
  };

  const abrirEditar = (categoria: CategoriaResponseDTO) => {
    setCategoriaSeleccionada(categoria);
    setFormularioAbierto(true);
  };

  const guardar = async (datos: CrearCategoriaDTO) => {
    if (categoriaSeleccionada) {
      await actualizar(categoriaSeleccionada.id, datos);
    } else {
      await crear(datos);
    }
  };

  const borrar = async (id: string) => {
    if (!window.confirm('¿Querés eliminar esta categoría?')) return;

    try {
      await eliminar(id);
    } catch {
      // El hook ya guarda el error y la página lo muestra.
    }
  };

  if (cargando) {
    return <p>Cargando categorías...</p>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-oliva sm:text-3xl">Categorías</h1>
        <p className="text-sm text-slate-500">Organizá tus ingresos y gastos a tu manera.</p>
      </header>

      {error && <p role="alert" className="rounded-xl border border-gasto-borde bg-gasto-fondo px-4 py-3 text-sm text-gasto">{error}</p>}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-oliva">Categorías del sistema</h2>
            <p className="mt-1 text-sm text-slate-500">Listas para usar en tus movimientos.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-oliva-claro px-3 py-1 text-xs font-medium text-oliva">
            <LockKeyhole size={13} aria-hidden="true" /> Solo lectura
          </span>
        </div>
        <ListaCategorias categorias={categoriasSistema} onEditar={abrirEditar} onEliminar={borrar} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-oliva">
              <Tags size={20} aria-hidden="true" /> Personalizadas
            </h2>
            <p className="mt-1 text-sm text-slate-500">Creá categorías para lo que es importante para vos.</p>
          </div>
          <Boton onClick={abrirCrear} disabled={categoriasPersonalizadas.length >= 8}>
            <Plus size={17} aria-hidden="true" /> Nueva categoría
          </Boton>
        </div>
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <p className="text-xs font-medium text-oliva">{categoriasPersonalizadas.length}/8 utilizadas</p>
          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-oliva-claro" aria-hidden="true">
            <div className="h-full rounded-full bg-oliva transition-all duration-300 motion-reduce:transition-none" style={{ width: `${Math.min(categoriasPersonalizadas.length / 8, 1) * 100}%` }} />
          </div>
          {categoriasPersonalizadas.length >= 8 && <p className="text-xs text-alerta">Alcanzaste el límite de categorías.</p>}
        </div>
        <ListaCategorias categorias={categoriasPersonalizadas} onEditar={abrirEditar} onEliminar={borrar} />
      </section>
      {formularioAbierto && (
        <FormularioCategoria
          key={categoriaSeleccionada?.id ?? 'nueva'}
          abierto={formularioAbierto}
          onCerrar={() => setFormularioAbierto(false)}
          onGuardar={guardar}
          categoria={categoriaSeleccionada}
        />
      )}
    </div>
  );
}
