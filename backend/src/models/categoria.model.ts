export type TipoMovimiento = 'INGRESO' | 'GASTO';

export interface CategoriaProps {
  readonly id: string;
  nombre: string;
  color: string;
  tipo: TipoMovimiento;
  readonly perfilId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Categoria {
  readonly id: string;
  nombre: string;
  color: string;
  tipo: TipoMovimiento;
  readonly perfilId: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: CategoriaProps) {
    this.id = props.id;
    this.nombre = props.nombre;
    this.color = props.color;
    this.tipo = props.tipo;
    this.perfilId = props.perfilId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
