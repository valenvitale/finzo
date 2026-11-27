import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import { Boton } from './Boton';

interface PaginadorProps {
  pagina: number;
  total: number;
  elementosPorPagina: number;
  onCambiarPagina: (pagina: number) => void;
}

export function Paginador({ pagina, total, elementosPorPagina, onCambiarPagina }: PaginadorProps) {
  if (total === 0) return null;

  const totalPaginas = Math.ceil(total / elementosPorPagina);
  const primerElemento = (pagina - 1) * elementosPorPagina + 1;
  const ultimoElemento = Math.min(pagina * elementosPorPagina, total);
  const rango = primerElemento === ultimoElemento ? primerElemento : `${primerElemento}–${ultimoElemento}`;
  const inicio = Math.max(2, Math.min(pagina - 1, totalPaginas - 3));
  const fin = Math.min(totalPaginas - 1, inicio + 2);
  const paginas = [1, ...Array.from({ length: Math.max(0, fin - inicio + 1) }, (_, i) => inicio + i), totalPaginas];

  return (
    <div className="flex min-h-8 flex-col items-center gap-1.5">
      {totalPaginas > 1 && (
        <nav aria-label="Paginación" className="flex items-center gap-1">
          <Boton
            variante="secondary"
            tamanio="icon"
            className="h-8 min-w-8 sm:hidden"
            aria-label="Primera página"
            disabled={pagina === 1}
            onClick={() => onCambiarPagina(1)}
          >
            <ChevronFirst size={16} aria-hidden="true" />
          </Boton>
          <Boton
            variante="secondary"
            tamanio="icon"
            className="h-8 min-w-8"
            aria-label="Página anterior"
            disabled={pagina === 1}
            onClick={() => onCambiarPagina(pagina - 1)}
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </Boton>
          <span className="whitespace-nowrap px-1 text-sm tabular-nums text-slate-600 sm:hidden">
            Página {pagina} de {totalPaginas}
          </span>
          <div className="hidden items-center gap-1 sm:flex">
            {paginas.map((numero, indice) => (
              <Fragment key={numero}>
                {indice > 0 && numero - paginas[indice - 1] > 1 && (
                  <span className="px-1 text-sm text-slate-500" aria-hidden="true">
                    …
                  </span>
                )}
                <Boton
                  variante={numero === pagina ? 'primary' : 'ghost'}
                  tamanio="icon"
                  className="h-8 min-w-8 text-sm tabular-nums"
                  aria-label={`Página ${numero}`}
                  aria-current={numero === pagina ? 'page' : undefined}
                  onClick={() => onCambiarPagina(numero)}
                >
                  {numero}
                </Boton>
              </Fragment>
            ))}
          </div>
          <Boton
            variante="secondary"
            tamanio="icon"
            className="h-8 min-w-8"
            aria-label="Página siguiente"
            disabled={pagina === totalPaginas}
            onClick={() => onCambiarPagina(pagina + 1)}
          >
            <ChevronRight size={16} aria-hidden="true" />
          </Boton>
          <Boton
            variante="secondary"
            tamanio="icon"
            className="h-8 min-w-8 sm:hidden"
            aria-label="Última página"
            disabled={pagina === totalPaginas}
            onClick={() => onCambiarPagina(totalPaginas)}
          >
            <ChevronLast size={16} aria-hidden="true" />
          </Boton>
        </nav>
      )}
      <p className="text-center text-sm tabular-nums text-slate-600" aria-live="polite">
        Mostrando {rango} de {total}
      </p>
    </div>
  );
}
