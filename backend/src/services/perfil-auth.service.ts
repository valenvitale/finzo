import { AppError, ErrorNoAutorizado } from '../utils/errores.js';
import { supabase, supabasePublic } from '../config/supabase.js';

export interface IPerfilAuthService {
  actualizarCredenciales(
    userId: string,
    emailActual: string,
    currentPassword: string,
    cambios: { email?: string; newPassword?: string }
  ): Promise<string>;
}

export class PerfilAuthService implements IPerfilAuthService {
  async actualizarCredenciales(
    userId: string,
    emailActual: string,
    currentPassword: string,
    cambios: { email?: string; newPassword?: string }
  ): Promise<string> {
    const { error: errorVerificacion } = await supabasePublic.auth.signInWithPassword({
      email: emailActual,
      password: currentPassword,
    });

    if (errorVerificacion) {
      if (errorVerificacion.status === 400 || errorVerificacion.status === 401) {
        throw new ErrorNoAutorizado('La contraseña actual es incorrecta');
      }
      throw new AppError('No se pudo verificar la contraseña con el proveedor de autenticación', 502);
    }

    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      email: cambios.email,
      password: cambios.newPassword,
    });

    if (error) {
      throw new AppError('No se pudieron actualizar las credenciales del usuario', 502);
    }

    return data.user.email ?? emailActual;
  }
}
