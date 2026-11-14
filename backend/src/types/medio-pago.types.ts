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

export interface MedioPago {
    id: string;
    nombre: string;
    icono: string;
    id_perfil: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface IMedioPagoService{
    listarPorPerfil(idPerfil: string): Promise<MedioPagoResponseDTO[]>;
    crear(idPerfil: string, datos: CrearMedioPagoDTO): Promise<MedioPagoResponseDTO>;
    actualizar(id: string, idPerfil: string, datos: ActualizarMedioPagoDTO): Promise<MedioPagoResponseDTO>;
    eliminar(id: string, idPerfil: string): Promise<void>;
}