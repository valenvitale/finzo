import type { CategoriaResponseDTO } from '../../types/categoria.types';
import { EtiquetaCategoria } from './EtiquetaCategoria';
import { Pencil, Tags, Trash2 } from 'lucide-react';

interface ListaCategoriasProps {
  categorias: CategoriaResponseDTO[];
  onEditar: (categoria: CategoriaResponseDTO) => void;
  onEliminar: (id: string) => void;
}

export function ListaCategorias({ categorias, onEditar, onEliminar }: ListaCategoriasProps) {
  if (categorias.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-oliva/20 bg-oliva-claro/50 px-5 py-9 text-center">
        <span className="mb-1 rounded-full bg-white p-3 text-oliva"><Tags size={24} aria-hidden="true" /></span>
        <p className="text-sm font-medium text-oliva">Todavía no hay categorías</p>
        <p className="max-w-sm text-sm text-slate-500">Las categorías que agregues aparecerán acá.</p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {categorias.map((categoria) => (
        <li key={categoria.id} className="group flex min-w-0 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-colors duration-200 hover:border-oliva/30 hover:bg-oliva-claro/60 focus-within:border-oliva/30 focus-within:bg-oliva-claro/60">
          <div className="flex min-w-0 items-center justify-between gap-2">
            <EtiquetaCategoria categoria={categoria} />
            <span className={`shrink-0 text-xs font-medium ${categoria.tipo === 'INGRESO' ? 'text-ingreso' : 'text-slate-500'}`}>
              {categoria.tipo === 'INGRESO' ? 'Ingreso' : 'Gasto'}
            </span>
          </div>
          {categoria.perfilId !== null && (
            <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
              <button type="button" onClick={() => onEditar(categoria)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-oliva transition-colors hover:bg-oliva hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oliva focus-visible:ring-offset-2">
                <Pencil size={14} aria-hidden="true" /> Editar
              </button>
              <button type="button" onClick={() => onEliminar(categoria.id)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-gasto-fondo hover:text-gasto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gasto focus-visible:ring-offset-2">
                <Trash2 size={14} aria-hidden="true" /> Eliminar
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
