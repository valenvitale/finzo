export type TipoMovimiento = 'INGRESO' | 'GASTO';

export interface Categoria {
    id: string;
    nombre: string;
    color: string;
    tipo: TipoMovimiento;
    id_perfil: string | null; // null indica una categoría global, sin perfil asociado.
    created_at: Date;
    updated_at: Date;
}