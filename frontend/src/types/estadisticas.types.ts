export interface FiltrosEstadisticasDTO {
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface GastoPorCategoriaDTO {
  categoriaId: string;
  categoriaNombre: string;
  total: number;
  porcentaje: number;
}

export interface EvolucionMensualDTO {
  mes: string;
  ingresos: number;
  gastos: number;
  tasaAhorro: number;
}

export interface EstadisticasMonedaDTO {
  monedaId: string;
  codigoMoneda: string;
  gastosPorCategoria: GastoPorCategoriaDTO[];
  evolucionMensual: EvolucionMensualDTO[];
  promedioGastoDiario: number;
  tasaAhorro: number;
}

export interface EstadisticasResponseDTO {
  estadisticasPorMoneda: EstadisticasMonedaDTO[];
}