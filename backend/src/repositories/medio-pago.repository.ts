import { PrismaClient } from '@prisma/client';
import { prisma as prismaSingleton } from '../config/prisma.js';
import { MedioPago } from '../models/medio-pago.model.js';

export interface IMedioPagoRepository {
  listarPorPerfil(idPerfil: string): Promise<MedioPago[]>;
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
}
