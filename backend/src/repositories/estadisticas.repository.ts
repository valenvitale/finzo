
import { Prisma, type PrismaClient } from '@prisma/client';
import { prisma as prismaSingleton } from '../config/prisma.js';
import type { FiltrosEstadisticasDTO } from '../types/estadisticas.types.js';

// Total de gastos agrupados por categoría y moneda.
export interface TotalPorCategoria {
  categoriaId: string;
  monedaId: string;
  total: number;
}

// Total de ingresos o gastos agrupados por mes y moneda.
export interface TotalMensual {
  monedaId: string;
  mes: string;
  tipo: 'INGRESO' | 'GASTO';
  total: number;
}

// Datos necesarios para calcular las estadísticas.
export interface MovimientoEstadistica {
  monto: number;
  fecha: Date;
  tipo: 'INGRESO' | 'GASTO';
  categoriaId: string;
  categoriaNombre: string;
  monedaId: string;
  codigoMoneda: string;
}

// Contrato del repositorio de estadísticas.
export interface IEstadisticasRepository {
  obtenerMovimientos(
    perfilId: string,
    filtros?: FiltrosEstadisticasDTO
  ): Promise<MovimientoEstadistica[]>;

  obtenerTotalesPorCategoria(
    perfilId: string,
    filtros?: FiltrosEstadisticasDTO
  ): Promise<TotalPorCategoria[]>;

  obtenerTotalesMensuales(
    perfilId: string,
    filtros?: FiltrosEstadisticasDTO
  ): Promise<TotalMensual[]>;
}

export class EstadisticasRepository implements IEstadisticasRepository {
  constructor(
    private readonly prisma: PrismaClient = prismaSingleton
  ) {}

  // Obtener los movimientos de un perfil.
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

  // Obtener los gastos totales por categoría y moneda.
  async obtenerTotalesPorCategoria(
    perfilId: string,
    filtros?: FiltrosEstadisticasDTO
  ): Promise<TotalPorCategoria[]> {
    const resultados = await this.prisma.movimiento.groupBy({
      by: ['id_categoria', 'id_moneda'],
      where: {
        id_perfil: perfilId,
        categoria: {
          tipo: 'GASTO',
        },
        fecha: {
          gte: filtros?.fechaDesde,
          lte: filtros?.fechaHasta,
        },
      },
      _sum: {
        monto: true,
      },
    });

    return resultados.map((resultado) => ({
      categoriaId: resultado.id_categoria,
      monedaId: resultado.id_moneda,
      total: resultado._sum.monto?.toNumber() ?? 0,
    }));
  }

  // Obtener los ingresos y gastos agrupados por mes y moneda.
  async obtenerTotalesMensuales(
    perfilId: string,
    filtros?: FiltrosEstadisticasDTO
  ): Promise<TotalMensual[]> {
    const resultados = await this.prisma.$queryRaw<
      {
        monedaId: string;
        mes: string;
        tipo: 'INGRESO' | 'GASTO';
        total: Prisma.Decimal;
      }[]
    >(Prisma.sql`
      SELECT
        m.id_moneda AS "monedaId",
        TO_CHAR(
          DATE_TRUNC('month', m.fecha),
          'YYYY-MM'
        ) AS "mes",
        c.tipo AS "tipo",
        SUM(m.monto) AS "total"
      FROM movimientos m
      INNER JOIN categorias c
        ON c.id = m.id_categoria
      WHERE m.id_perfil = ${perfilId}
        ${
          filtros?.fechaDesde
            ? Prisma.sql`AND m.fecha >= ${filtros.fechaDesde}`
            : Prisma.empty
        }
        ${
          filtros?.fechaHasta
            ? Prisma.sql`AND m.fecha <= ${filtros.fechaHasta}`
            : Prisma.empty
        }
      GROUP BY
        m.id_moneda,
        DATE_TRUNC('month', m.fecha),
        c.tipo
      ORDER BY
        DATE_TRUNC('month', m.fecha) ASC
    `);

    return resultados.map((resultado) => ({
      monedaId: resultado.monedaId,
      mes: resultado.mes,
      tipo: resultado.tipo,
      total: resultado.total.toNumber(),
    }));
  }
}