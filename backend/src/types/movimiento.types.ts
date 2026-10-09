export type TipoMovimiento = 'INGRESO' | 'GASTO';
// DTOs
export interface CrearMovimientoDTO {
  fecha: Date;
  monto: number;
  descripcion?: string | null;
  monedaId: string;
  categoriaId: string;
  medioPagoId: string;
}

export interface ActualizarMovimientoDTO {
  fecha?: Date;
  monto?: number;
  descripcion?: string | null;
  monedaId?: string;
  categoriaId?: string;
  medioPagoId?: string;
}

export interface FiltrosMovimientoDTO {
  descripcion?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  mes?: number;
  anio?: number;
  montoMinimo?: number;
  montoMaximo?: number;
  categoriaId?: string;
  monedaId?: string;
  medioPagoId?: string;
  tipo?: TipoMovimiento;
}

export interface MovimientoResponseDTO {
  id: string;
  fecha: Date;
  monto: number;
  descripcion: string | null;
  perfilId: string;
  monedaId: string;
  categoriaId: string;
  medioPagoId: string;
  tipo: TipoMovimiento;
  createdAt: Date;
  updatedAt: Date;
}
