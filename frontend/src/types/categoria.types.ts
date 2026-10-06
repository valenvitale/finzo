export type TipoMovimiento = 'INGRESO' | 'GASTO';

export interface CategoriaResponseDTO {
    id: string;
    nombre: string;
    color: string;
    tipo: TipoMovimiento;
    id_perfil: string | null; // null indica una categoría global, sin perfil asociado.
    created_at: string; // Fecha serializada en formato ISO 8601.
    updated_at: string; // Fecha serializada en formato ISO 8601.
}

// Categoría recibida de la API.
export type Categoria = CategoriaResponseDTO;

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
