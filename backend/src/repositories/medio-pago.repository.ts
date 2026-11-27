import type { PrismaClient } from '@prisma/client';
import { prisma as prismaSingleton } from '../config/prisma.js';
import type { MedioPago, CrearMedioPagoDTO, ActualizarMedioPagoDTO } from '../types/medio-pago.types.js';

export interface IMedioPagoRepository {
  listarPorPerfil(idPerfil: string): Promise<MedioPago[]>;
  obtenerPorId(id: string): Promise<MedioPago | null>;
  crear(idPerfil: string, datos: CrearMedioPagoDTO): Promise<MedioPago>;
  actualizar(id: string, datos: ActualizarMedioPagoDTO): Promise<MedioPago>;
  eliminar(id: string): Promise<void>;
}

export class MedioPagoRepository implements IMedioPagoRepository {
  constructor(private readonly prisma: PrismaClient = prismaSingleton) {}

  async listarPorPerfil(idPerfil: string): Promise<MedioPago[]> {
    return this.prisma.medioPago.findMany({
      where: {
        OR: [{ id_perfil: null }, { id_perfil: idPerfil }],
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async obtenerPorId(id: string): Promise<MedioPago | null> {
    return this.prisma.medioPago.findUnique({
      where: { id },
    });
  }

  async crear(idPerfil: string, datos: CrearMedioPagoDTO): Promise<MedioPago> {
    return this.prisma.medioPago.create({
      data: {
        nombre: datos.nombre,
        icono: datos.icono,
        id_perfil: idPerfil
      },
    });
  }

  async actualizar(id: string, datos: ActualizarMedioPagoDTO): Promise<MedioPago>{
    return this.prisma.medioPago.update({
      where: { id },
      data: {
        nombre: datos.nombre,
        icono: datos.icono
      },
    });
  }

  async eliminar(id: string): Promise<void>{
    await this.prisma.medioPago.delete({
      where: { id }
    });
  }
}
