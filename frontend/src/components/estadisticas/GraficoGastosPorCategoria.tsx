import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import type {
  GastoPorCategoriaDTO,
} from '../../types/estadisticas.types';

interface GraficoGastosPorCategoriaProps {
  datos: GastoPorCategoriaDTO[];
}

const COLORES = [
  '#6366f1',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
];

export function GraficoGastosPorCategoria({
  datos,
}: GraficoGastosPorCategoriaProps) {
  if (datos.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No hay gastos por categoría para mostrar.
      </p>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={datos}
            dataKey="total"
            nameKey="categoriaNombre"
            cx="50%"
            cy="50%"
            outerRadius={100}
          >
            {datos.map((categoria, indice) => (
              <Cell
                key={categoria.categoriaId}
                fill={COLORES[indice % COLORES.length]}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(valor) =>
              Number(valor).toLocaleString('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }
          />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}