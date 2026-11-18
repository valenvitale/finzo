export interface PerfilResponseDTO {
  id: string;
  nombre: string;
  apellido: string;
  foto_perfil: string | null;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface ActualizarPerfilDTO {
  nombre?: string;
  apellido?: string;
  foto_perfil?: string | null;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}
