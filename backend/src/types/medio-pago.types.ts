export interface CrearMedioPagoDTO {
    nombre: string;
    icono: string;
}

export interface ActualizarMedioPagoDTO {
    nombre?: string;
    icono?: string;
}

export interface MedioPagoResponseDTO {
    id: string;
    nombre: string;
    icono: string;
    id_perfil: string | null; // null indica un medio de pago global, sin perfil asociado.
    created_at: string; // Fecha serializada en formato ISO 8601.
    updated_at: string; // Fecha serializada en formato ISO 8601.
}
