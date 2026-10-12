export interface MonedaProps {
  readonly id: string;
  nombre: string;
  codigo: string;
  simbolo: string;
}

export class Moneda {
  readonly id: string;
  nombre: string;
  codigo: string;
  simbolo: string;

  constructor(props: MonedaProps) {
    this.id = props.id;
    this.nombre = props.nombre;
    this.codigo = props.codigo;
    this.simbolo = props.simbolo;
  }
}
