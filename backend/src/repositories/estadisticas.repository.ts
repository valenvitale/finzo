import type { PrismaClient } from '@prisma/client';
import { prisma as prismaSingleton } from '../config/prisma.js';
import type { FiltrosEstadisticasDTO } from '../types/estadisticas.types.js';

// Representa los datos que necesita el servicio
// para calcular las estadísticas.
export interface MovimientoEstadistica {
  monto: number;
  fecha: Date;
  tipo: 'INGRESO' | 'GASTO';
  categoriaId: string;
  categoriaNombre: string;
  monedaId: string;
  codigoMoneda: string;
}

export interface IEstadisticasRepository {
  obtenerMovimientos(
    perfilId: string,
    filtros?: FiltrosEstadisticasDTO
  ): Promise<MovimientoEstadistica[]>;
}

export class EstadisticasRepository implements IEstadisticasRepository {
  constructor(
    private readonly prisma: PrismaClient = prismaSingleton
  ) {}

  async obtenerMovimientos(
    perfilId: string,
    filtros?: FiltrosEstadisticasDTO
  ): Promise<MovimientoEstadistica[]> {
    const movimientos = await this.prisma.movimiento.findMany({
      where: {
        id_perfil: perfilId,
        fecha: {
          gte: filtros?.fechaDesde,
          lte: filtros?.fechaHasta,
        },
      },
      select: {
        monto: true,
        fecha: true,
        id_categoria: true,
        id_moneda: true,
        categoria: {
          select: {
            nombre: true,
            tipo: true,
          },
        },
        moneda: {
          select: {
            codigo: true,
          },
        },
      },
      orderBy: {
        fecha: 'asc',
      },
    });

    return movimientos.map((movimiento) => ({
      monto: movimiento.monto.toNumber(),
      fecha: movimiento.fecha,
      tipo: movimiento.categoria.tipo,
      categoriaId: movimiento.id_categoria,
      categoriaNombre: movimiento.categoria.nombre,
      monedaId: movimiento.id_moneda,
      codigoMoneda: movimiento.moneda.codigo,
    }));
  }
}
