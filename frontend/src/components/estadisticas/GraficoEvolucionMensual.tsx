import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import type {
  EvolucionMensualDTO,
} from '../../types/estadisticas.types';

interface GraficoEvolucionMensualProps {
  datos: EvolucionMensualDTO[];
}

export function GraficoEvolucionMensual({
  datos,
}: GraficoEvolucionMensualProps) {
  if (datos.length === 0) {
    return (
      <p className="py-8 text-center text-gray-500">
        No hay movimientos mensuales para mostrar.
      </p>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={datos}
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="mes" />

          <YAxis
            tickFormatter={(valor: number) =>
              valor.toLocaleString('es-AR')
            }
          />

          <Tooltip
            formatter={(valor) =>
              Number(valor).toLocaleString('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }
          />

          <Legend />

          <Bar
            dataKey="ingresos"
            name="Ingresos"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
          />

          <Bar
            dataKey="gastos"
            name="Gastos"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}