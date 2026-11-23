export interface ResumenResponseDTO {
  totalIngresos: number;
  totalGastos: number;
  balance: number;
  moneda: string;
}

export interface FiltrosResumenDTO {
  mes?: number;
  anio?: number;
}
