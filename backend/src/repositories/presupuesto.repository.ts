import { Prisma, type PrismaClient } from '@prisma/client';
import { ErrorDeConflicto, ErrorNoEncontrado } from '../errors/errores.js';
import { prisma as prismaSingleton } from '../config/prisma.js';
import type { ActualizarPresupuestoDTO, CrearPresupuestoDTO, PresupuestoDTO } from '../types/presupuesto.types.js';

type PresupuestoConCategoria = Prisma.PresupuestoGetPayload<{
  include: { categoria: true };
}>;

export interface ICategoriaParaPresupuesto {
  id: string;
  nombre: string;
  color: string;
  tipo: 'INGRESO' | 'GASTO';
  perfilId: string | null;
}

export interface IMonedaPrincipal {
  id: string;
  codigo: string;
  simbolo: string;
}

export interface IPresupuestoRepository {
  obtenerCategoria(id: string): Promise<ICategoriaParaPresupuesto | null>;
  obtenerMonedaPrincipal(perfilId: string): Promise<IMonedaPrincipal | null>;
  listarPorPeriodo(perfilId: string, mes: number, anio: number, monedaId: string): Promise<PresupuestoDTO[]>;
  crear(perfilId: string, datos: CrearPresupuestoDTO): Promise<PresupuestoDTO>;
  obtenerPorId(id: string, perfilId: string): Promise<PresupuestoDTO | null>;
  actualizar(id: string, perfilId: string, datos: ActualizarPresupuestoDTO): Promise<PresupuestoDTO>;
  eliminar(id: string, perfilId: string): Promise<void>;
}

function mapearPresupuesto(presupuesto: PresupuestoConCategoria, gastoActual: number): PresupuestoDTO {
  const limiteMensual = presupuesto.limite_mensual.toNumber();

  return {
    id: presupuesto.id,
    categoriaId: presupuesto.id_categoria,
    categoriaNombre: presupuesto.categoria.nombre,
    categoriaColor: presupuesto.categoria.color,
    limiteMensual,
    gastoActual,
    disponible: limiteMensual - gastoActual,
    porcentajeUsado: limiteMensual === 0 ? 0 : (gastoActual / limiteMensual) * 100,
    mes: presupuesto.mes,
    anio: presupuesto.anio,
    createdAt: presupuesto.created_at,
    updatedAt: presupuesto.updated_at,
  };
}

export class PresupuestoRepository implements IPresupuestoRepository {
  constructor(private readonly prisma: PrismaClient = prismaSingleton) {}

  async obtenerCategoria(id: string): Promise<ICategoriaParaPresupuesto | null> {
    const categoria = await this.prisma.categoria.findUnique({ where: { id } });
    if (!categoria) return null;

    return {
      id: categoria.id,
      nombre: categoria.nombre,
      color: categoria.color,
      tipo: categoria.tipo,
      perfilId: categoria.id_perfil,
    };
  }

  async obtenerMonedaPrincipal(perfilId: string): Promise<IMonedaPrincipal | null> {
    const asignacion = await this.prisma.perfilMoneda.findFirst({
      where: { id_perfil: perfilId, es_principal: true },
      include: { moneda: true },
    });

    if (!asignacion) return null;
    return {
      id: asignacion.moneda.id,
      codigo: asignacion.moneda.codigo,
      simbolo: asignacion.moneda.simbolo,
    };
  }

  async listarPorPeriodo(perfilId: string, mes: number, anio: number, monedaId: string): Promise<PresupuestoDTO[]> {
    const inicio = new Date(Date.UTC(anio, mes - 1, 1));
    const fin = new Date(Date.UTC(anio, mes, 1));
    const [presupuestos, gastos] = await Promise.all([
      this.prisma.presupuesto.findMany({
        where: { id_perfil: perfilId, mes, anio },
        include: { categoria: true },
        orderBy: { categoria: { nombre: 'asc' } },
      }),
      this.prisma.movimiento.groupBy({
        by: ['id_categoria'],
        where: {
          id_perfil: perfilId,
          id_moneda: monedaId,
          fecha: { gte: inicio, lt: fin },
          categoria: { tipo: 'GASTO' },
        },
        _sum: { monto: true },
      }),
    ]);

    const gastoPorCategoria = new Map(
      gastos.map(({ id_categoria, _sum }) => [id_categoria, _sum.monto?.toNumber() ?? 0])
    );

    return presupuestos.map((presupuesto) =>
      mapearPresupuesto(presupuesto, gastoPorCategoria.get(presupuesto.id_categoria) ?? 0)
    );
  }

  async crear(perfilId: string, datos: CrearPresupuestoDTO): Promise<PresupuestoDTO> {
    try {
      const presupuesto = await this.prisma.presupuesto.create({
        data: {
          id_perfil: perfilId,
          id_categoria: datos.categoriaId,
          limite_mensual: datos.limiteMensual,
          mes: datos.mes,
          anio: datos.anio,
        },
        include: { categoria: true },
      });

      return mapearPresupuesto(presupuesto, 0);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ErrorDeConflicto('Ya existe un presupuesto para esa categoría y período');
      }
      throw error;
    }
  }

  async obtenerPorId(id: string, perfilId: string): Promise<PresupuestoDTO | null> {
    const presupuesto = await this.prisma.presupuesto.findFirst({
      where: { id, id_perfil: perfilId },
      include: { categoria: true },
    });

    return presupuesto ? mapearPresupuesto(presupuesto, 0) : null;
  }

  async actualizar(id: string, perfilId: string, datos: ActualizarPresupuestoDTO): Promise<PresupuestoDTO> {
    try {
      const presupuesto = await this.prisma.presupuesto.update({
        where: { id, id_perfil: perfilId },
        data: { limite_mensual: datos.limiteMensual },
        include: { categoria: true },
      });

      return mapearPresupuesto(presupuesto, 0);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ErrorNoEncontrado('No se encontró el presupuesto');
      }
      throw error;
    }
  }

  async eliminar(id: string, perfilId: string): Promise<void> {
    try {
      await this.prisma.presupuesto.delete({ where: { id, id_perfil: perfilId } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ErrorNoEncontrado('No se encontró el presupuesto');
      }
      throw error;
    }
  }
}
