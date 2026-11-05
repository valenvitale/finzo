import type { ReactNode } from 'react';
import { Tarjeta } from '../common/Tarjeta';

interface TarjetaMetricaProps {
  titulo: string;
  valor: string;
  icono: ReactNode;
  color: 'verde' | 'rojo' | 'neutro';
}

export function TarjetaMetrica({
  titulo,
  valor,
  icono,
  color
}: TarjetaMetricaProps) {
  const colores = {
    verde: 'text-green-600',
    rojo: 'text-red-600',
    neutro: 'text-slate-800'
  };

  return (
    <Tarjeta>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-500">
          {titulo}
        </h3>

        <span className={colores[color]}>
          {icono}
        </span>
      </div>

      <p className={`mt-3 text-2xl font-bold ${colores[color]}`}>
        {valor}
      </p>
    </Tarjeta>
  );
}
