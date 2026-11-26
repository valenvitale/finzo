export interface CrearPresupuestoDTO {
  categoriaId: string;
  limiteMensual: number;
  mes: number;
  anio: number;
}

export interface ActualizarPresupuestoDTO {
  limiteMensual: number;
}

export interface PresupuestoDTO {
  id: string;
  categoriaId: string;
  categoriaNombre: string;
  categoriaColor: string;
  limiteMensual: number;
  gastoActual: number;
  disponible: number;
  porcentajeUsado: number;
  mes: number;
  anio: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResumenPresupuestosDTO {
  mes: number;
  anio: number;
  moneda: {
    codigo: string;
    simbolo: string;
  };
  totalLimiteMensual: number;
  totalGastado: number;
  totalDisponible: number;
  porcentajeUsado: number;
  presupuestos: PresupuestoDTO[];
}
