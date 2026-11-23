export type TipoMovimiento = 'INGRESO' | 'GASTO';

export interface CategoriaResponseDTO {
  id: string;
  nombre: string;
  color: string;
  tipo: TipoMovimiento;
  icono: string;
  perfilId: string | null; // null indica una categoría global, sin perfil asociado.
  createdAt: string; // Fecha serializada en formato ISO 8601.
  updatedAt: string; // Fecha serializada en formato ISO 8601.
}

// Categoría recibida de la API.
export type Categoria = CategoriaResponseDTO;

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
