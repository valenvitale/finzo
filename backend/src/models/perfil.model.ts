export interface PerfilProps {
  readonly id: string;
  nombre: string;
  apellido: string;
  fotoPerfil: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Perfil {
  readonly id: string;
  nombre: string;
  apellido: string;
  fotoPerfil: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: PerfilProps) {
    this.id = props.id;
    this.nombre = props.nombre;
    this.apellido = props.apellido;
    this.fotoPerfil = props.fotoPerfil;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
