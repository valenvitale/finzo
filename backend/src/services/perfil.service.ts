import { ErrorNoAutorizado, ErrorNoEncontrado } from '../errors/errores.js';
import type { ActualizarPerfilDTO, PerfilResponseDTO } from '../types/perfil.types.js';
import type { IPerfilRepository } from '../repositories/perfil.repository.js';
import type { IPerfilAuthService } from './perfil-auth.service.js';

export class PerfilService {
  constructor(
    private readonly perfilRepository: IPerfilRepository,
    private readonly perfilAuthService: IPerfilAuthService
  ) {}

  async obtenerPerfil(id: string, email: string): Promise<PerfilResponseDTO> {
    const perfil = await this.perfilRepository.obtenerPorId(id);
    if (!perfil) {
      throw new ErrorNoEncontrado('No se encontró el perfil del usuario');
    }

    return {
      id: perfil.id,
      nombre: perfil.nombre,
      apellido: perfil.apellido,
      foto_perfil: perfil.fotoPerfil,
      email,
      created_at: perfil.createdAt,
      updated_at: perfil.updatedAt,
    };
  }

  async actualizarPerfil(id: string, emailActual: string, datos: ActualizarPerfilDTO): Promise<PerfilResponseDTO> {
    const perfilExistente = await this.perfilRepository.obtenerPorId(id);
    if (!perfilExistente) {
      throw new ErrorNoEncontrado('No se encontró el perfil del usuario');
    }

    const cambiosCredenciales =
      (datos.email !== undefined && datos.email !== emailActual) || datos.newPassword !== undefined;
    let email = emailActual;

    if (cambiosCredenciales) {
      if (!datos.currentPassword || !emailActual) {
        throw new ErrorNoAutorizado('Se requiere la contraseña actual para actualizar las credenciales');
      }

      email = await this.perfilAuthService.actualizarCredenciales(id, emailActual, datos.currentPassword, {
        email: datos.email === emailActual ? undefined : datos.email,
        newPassword: datos.newPassword,
      });
    }

    const perfil =
      datos.nombre !== undefined || datos.apellido !== undefined || datos.foto_perfil !== undefined
        ? await this.perfilRepository.actualizar(id, {
            nombre: datos.nombre,
            apellido: datos.apellido,
            foto_perfil: datos.foto_perfil,
          })
        : perfilExistente;

    return {
      id: perfil.id,
      nombre: perfil.nombre,
      apellido: perfil.apellido,
      foto_perfil: perfil.fotoPerfil,
      email,
      created_at: perfil.createdAt,
      updated_at: perfil.updatedAt,
    };
  }
}
