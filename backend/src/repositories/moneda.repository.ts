import { Prisma, PrismaClient } from '@prisma/client';
import { prisma as prismaSingleton } from '../config/prisma.js';
import { Moneda } from '../models/moneda.model.js';
import { ErrorDeConflicto } from '../errors/errores.js';
import { MonedaPerfilResponseDTO, MonedaResponseDTO } from '../types/moneda.types.js';

type PerfilMonedaConMoneda = Prisma.PerfilMonedaGetPayload<{ include: { moneda: true } }>;

export interface IMonedaRepository {
  listarDisponibles(): Promise<MonedaResponseDTO[]>;
  obtenerDisponible(id: string): Promise<Moneda | null>;
  existePerfil(perfilId: string): Promise<boolean>;
  listarPorPerfil(perfilId: string): Promise<MonedaPerfilResponseDTO[]>;
  asignar(perfilId: string, monedaId: string, solicitarPrincipal?: boolean): Promise<MonedaPerfilResponseDTO>;
  eliminarAsignacion(perfilId: string, monedaId: string): Promise<boolean>;
}

function mapearMoneda(moneda: { id: string; nombre: string; codigo: string; simbolo: string }): Moneda {
  return new Moneda({
    id: moneda.id,
    nombre: moneda.nombre,
    codigo: moneda.codigo,
    simbolo: moneda.simbolo,
  });
}

function mapearAsignacion(asignacion: PerfilMonedaConMoneda): MonedaPerfilResponseDTO {
  return {
    id: asignacion.moneda.id,
    nombre: asignacion.moneda.nombre,
    codigo: asignacion.moneda.codigo,
    simbolo: asignacion.moneda.simbolo,
    esPrincipal: asignacion.es_principal,
  };
}

export class MonedaRepository implements IMonedaRepository {
  constructor(private readonly prisma: PrismaClient = prismaSingleton) {}

  async listarDisponibles(): Promise<MonedaResponseDTO[]> {
    const monedas = await this.prisma.moneda.findMany({ orderBy: { codigo: 'asc' } });
    return monedas.map((moneda) => mapearMoneda(moneda));
  }

  async obtenerDisponible(id: string): Promise<Moneda | null> {
    const moneda = await this.prisma.moneda.findUnique({ where: { id } });
    return moneda ? mapearMoneda(moneda) : null;
  }

  async existePerfil(perfilId: string): Promise<boolean> {
    return (await this.prisma.perfil.count({ where: { id: perfilId } })) > 0;
  }

  async listarPorPerfil(perfilId: string): Promise<MonedaPerfilResponseDTO[]> {
    const asignaciones = await this.prisma.perfilMoneda.findMany({
      where: { id_perfil: perfilId },
      include: { moneda: true },
      orderBy: [{ es_principal: 'desc' }, { moneda: { codigo: 'asc' } }],
    });
    return asignaciones.map(mapearAsignacion);
  }

  async asignar(perfilId: string, monedaId: string, solicitarPrincipal = false): Promise<MonedaPerfilResponseDTO> {
    try {
      const asignacion = await this.prisma.$transaction(async (tx) => {
        const existente = await tx.perfilMoneda.findUnique({
          where: { id_perfil_id_moneda: { id_perfil: perfilId, id_moneda: monedaId } },
        });

        if (existente) {
          if (!solicitarPrincipal) {
            throw new ErrorDeConflicto('La moneda ya está asignada al perfil');
          }

          await tx.perfilMoneda.updateMany({
            where: { id_perfil: perfilId, es_principal: true },
            data: { es_principal: false },
          });
          const promovida = await tx.perfilMoneda.update({
            where: { id_perfil_id_moneda: { id_perfil: perfilId, id_moneda: monedaId } },
            data: { es_principal: true },
            include: { moneda: true },
          });
          return promovida;
        }

        const principalActual = await tx.perfilMoneda.findFirst({
          where: { id_perfil: perfilId, es_principal: true },
        });
        const esPrincipal = solicitarPrincipal || !principalActual;

        if (esPrincipal) {
          await tx.perfilMoneda.updateMany({
            where: { id_perfil: perfilId, es_principal: true },
            data: { es_principal: false },
          });
        }

        return tx.perfilMoneda.create({
          data: { id_perfil: perfilId, id_moneda: monedaId, es_principal: esPrincipal },
          include: { moneda: true },
        });
      });

      return mapearAsignacion(asignacion);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ErrorDeConflicto('La moneda ya está asignada al perfil');
      }
      throw error;
    }
  }

  async eliminarAsignacion(perfilId: string, monedaId: string): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      const asignacion = await tx.perfilMoneda.findUnique({
        where: { id_perfil_id_moneda: { id_perfil: perfilId, id_moneda: monedaId } },
      });

      if (!asignacion) {
        return false;
      }

      await tx.perfilMoneda.delete({
        where: { id_perfil_id_moneda: { id_perfil: perfilId, id_moneda: monedaId } },
      });

      if (asignacion.es_principal) {
        const siguiente = await tx.perfilMoneda.findFirst({
          where: { id_perfil: perfilId },
          include: { moneda: true },
          orderBy: { moneda: { codigo: 'asc' } },
        });

        if (siguiente) {
          await tx.perfilMoneda.update({
            where: { id_perfil_id_moneda: { id_perfil: perfilId, id_moneda: siguiente.id_moneda } },
            data: { es_principal: true },
          });
        }
      }

      return true;
    });
  }
}
