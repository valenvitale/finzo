export interface MovimientoProps {
  readonly id: string;
  fecha: Date;
  monto: number;
  descripcion: string | null;
  readonly perfilId: string;
  monedaId: string;
  categoriaId: string;
  medioPagoId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Movimiento {
  readonly id: string;
  fecha: Date;
  monto: number;
  descripcion: string | null;
  readonly perfilId: string;
  monedaId: string;
  categoriaId: string;
  medioPagoId: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: MovimientoProps) {
    this.id = props.id;
    this.fecha = props.fecha;
    this.monto = props.monto;
    this.descripcion = props.descripcion;
    this.perfilId = props.perfilId;
    this.monedaId = props.monedaId;
    this.categoriaId = props.categoriaId;
    this.medioPagoId = props.medioPagoId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}