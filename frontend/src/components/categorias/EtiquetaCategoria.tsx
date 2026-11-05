import type { CategoriaResponseDTO } from '../../types/categoria.types';
import { componentesIcono } from '../../utils/iconosCategoria';

interface EtiquetaCategoriaProps {
  categoria: CategoriaResponseDTO;
}

export function EtiquetaCategoria({ categoria }: EtiquetaCategoriaProps) {
  const rojo = parseInt(categoria.color.slice(1, 3), 16);
  const verde = parseInt(categoria.color.slice(3, 5), 16);
  const azul = parseInt(categoria.color.slice(5, 7), 16);

  const canales = [rojo, verde, azul].map((valor) => {
    const canal = valor / 255;

    return canal <= 0.04045 ? canal / 12.92 : Math.pow((canal + 0.055) / 1.055, 2.4);
  });

  const luminancia = 0.2126 * canales[0] + 0.7152 * canales[1] + 0.0722 * canales[2];

  const colorTexto = luminancia > 0.179 ? '#000000' : '#FFFFFF';

  const Icono = componentesIcono[categoria.icono] ?? componentesIcono.tag;

  return (
    <span
      className="inline-flex min-w-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium"
      style={{
        backgroundColor: categoria.color,
        color: colorTexto,
      }}
    >
      <Icono size={14} className="shrink-0" aria-hidden="true" />
      <span className="break-words [overflow-wrap:anywhere]">{categoria.nombre}</span>
    </span>
  );
}
