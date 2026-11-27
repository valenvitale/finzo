export type TipoMovimiento = 'INGRESO' | 'GASTO';

export interface CrearCategoriaDTO {
  nombre: string;
  color: string;
  tipo: TipoMovimiento;
  icono: string;
}

export interface ActualizarCategoriaDTO {
  nombre?: string;
  color?: string;
  tipo?: TipoMovimiento;
  icono?: string;
}

export interface CategoriaResponseDTO {
  id: string;
  nombre: string;
  color: string;
  tipo: TipoMovimiento;
  icono: string;
  perfilId: string | null; // null indica una categoría global, sin perfil asociado.
  createdAt: Date;
  updatedAt: Date;
}
