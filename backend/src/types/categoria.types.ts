import type { TipoMovimiento } from '../models/categoria.model.js';

export interface CrearCategoriaDTO {
  nombre: string;
  color: string;
  tipo: TipoMovimiento;
}

export interface ActualizarCategoriaDTO {
  nombre?: string;
  color?: string;
  tipo?: TipoMovimiento;
}

export interface CategoriaResponseDTO {
  id: string;
  nombre: string;
  color: string;
  tipo: TipoMovimiento;
  perfilId: string | null; // null indica una categoría global, sin perfil asociado.
  createdAt: Date;
  updatedAt: Date;
}
