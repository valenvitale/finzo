export type TipoMovimiento = 'INGRESO' | 'GASTO';
// DTOs
export interface CrearMovimientoDTO {
  fecha: string;
  monto: number;
  descripcion?: string | null;
  monedaId: string;
  categoriaId: string;
  medioPagoId: string;
}

export interface ActualizarMovimientoDTO {
  fecha?: string;
  monto?: number;
  descripcion?: string | null;
  monedaId?: string;
  categoriaId?: string;
  medioPagoId?: string;
}

export interface FiltrosMovimientoDTO {
  fechaDesde?: string;
  fechaHasta?: string;
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
  fecha: string;
  monto: number;
  descripcion: string | null;
  perfilId: string;
  monedaId: string;
  categoriaId: string;
  medioPagoId: string;
  tipo: TipoMovimiento;
  createdAt: string;
  updatedAt: string;
}
