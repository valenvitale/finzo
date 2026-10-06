export interface MedioPago {
    id: string;
    nombre: string;
    icono: string;
    id_perfil: string | null; // null indica un medio de pago global, sin perfil asociado. 
    created_at: Date;
    updated_at: Date;
}