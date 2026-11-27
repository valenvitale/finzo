interface IndicadoresFinancierosProps {
  promedioGastoDiario: number;
  tasaAhorro: number;
  codigoMoneda: string;
}

export function IndicadoresFinancieros({
  promedioGastoDiario,
  tasaAhorro,
  codigoMoneda,
}: IndicadoresFinancierosProps) {
  const formatoMoneda = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">
          Promedio de gasto diario
        </p>

        <p className="mt-2 text-2xl font-bold text-gray-900">
          {codigoMoneda} {formatoMoneda.format(promedioGastoDiario)}
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">
          Tasa de ahorro
        </p>

        <p
          className={`mt-2 text-2xl font-bold ${
            tasaAhorro >= 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {tasaAhorro.toLocaleString('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          %
        </p>
      </div>
    </div>
  );
}