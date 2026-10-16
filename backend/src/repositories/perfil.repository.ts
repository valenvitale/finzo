import { PrismaClient } from '@prisma/client';
import { prisma as prismaSingleton } from '../config/prisma.js';
import { PerfilDTO } from '../types/perfil.types.js';

export interface IPerfilRepository {
  obtenerPorId(id: string): Promise<PerfilDTO | null>;
  actualizar(id: string, datos: { nombre?: string; apellido?: string; foto_perfil?: string | null }): Promise<PerfilDTO>;
}

export class PerfilRepository implements IPerfilRepository {
  constructor(private readonly prisma: PrismaClient = prismaSingleton) {}

  async obtenerPorId(id: string): Promise<PerfilDTO | null> {
    const perfil = await this.prisma.perfil.findUnique({ where: { id } });
    if (!perfil) {
      return null;
    }

    return {
      id: perfil.id,
      nombre: perfil.nombre,
      apellido: perfil.apellido,
      fotoPerfil: perfil.foto_perfil,
      createdAt: perfil.created_at,
      updatedAt: perfil.updated_at,
    };
  }

  async actualizar(
    id: string,
    datos: { nombre?: string; apellido?: string; foto_perfil?: string | null }
  ): Promise<PerfilDTO> {
    const perfil = await this.prisma.perfil.update({
      where: { id },
      data: {
        nombre: datos.nombre,
        apellido: datos.apellido,
        foto_perfil: datos.foto_perfil,
      },
    });

    return {
      id: perfil.id,
      nombre: perfil.nombre,
      apellido: perfil.apellido,
      fotoPerfil: perfil.foto_perfil,
      createdAt: perfil.created_at,
      updatedAt: perfil.updated_at,
    };
  }
}
