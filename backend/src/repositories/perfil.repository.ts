import { PrismaClient } from '@prisma/client';
import { prisma as prismaSingleton } from '../config/prisma.js';
import { Perfil } from '../models/perfil.model.js';

export interface IPerfilRepository {
  obtenerPorId(id: string): Promise<Perfil | null>;
  actualizar(id: string, datos: { nombre?: string; apellido?: string; foto_perfil?: string | null }): Promise<Perfil>;
}

export class PerfilRepository implements IPerfilRepository {
  constructor(private readonly prisma: PrismaClient = prismaSingleton) {}

  async obtenerPorId(id: string): Promise<Perfil | null> {
    const perfil = await this.prisma.perfil.findUnique({ where: { id } });
    if (!perfil) {
      return null;
    }

    return new Perfil({
      id: perfil.id,
      nombre: perfil.nombre,
      apellido: perfil.apellido,
      fotoPerfil: perfil.foto_perfil,
      createdAt: perfil.created_at,
      updatedAt: perfil.updated_at,
    });
  }

  async actualizar(
    id: string,
    datos: { nombre?: string; apellido?: string; foto_perfil?: string | null }
  ): Promise<Perfil> {
    const perfil = await this.prisma.perfil.update({
      where: { id },
      data: {
        nombre: datos.nombre,
        apellido: datos.apellido,
        foto_perfil: datos.foto_perfil,
      },
    });

    return new Perfil({
      id: perfil.id,
      nombre: perfil.nombre,
      apellido: perfil.apellido,
      fotoPerfil: perfil.foto_perfil,
      createdAt: perfil.created_at,
      updatedAt: perfil.updated_at,
    });
  }
}
