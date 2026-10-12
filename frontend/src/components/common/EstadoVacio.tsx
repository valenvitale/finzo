import type { ReactNode } from 'react';

interface EstadoVacioProps {
  titulo: string;
  descripcion?: string;
  accion?: ReactNode;
}

export function EstadoVacio({ titulo, descripcion, accion }: EstadoVacioProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center">
      <h2 className="text-lg font-semibold text-slate-800">{titulo}</h2>
      {descripcion && <p className="max-w-md text-sm text-slate-500">{descripcion}</p>}
      {accion}
    </div>
  );
}
