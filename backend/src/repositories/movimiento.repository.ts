import { PrismaClient, Prisma } from '@prisma/client';
import { prisma as prismaSingleton } from '../config/prisma.js';
import {
  CrearMovimientoDTO,
  ActualizarMovimientoDTO,
  FiltrosMovimientoDTO,
  MovimientoResponseDTO,
} from '../types/movimiento.types.js';

export interface IMovimientoRepository {
  crear(perfilId: string, datosMovimiento: CrearMovimientoDTO): Promise<MovimientoResponseDTO>;
  actualizar(id: string, datosActualizacion: ActualizarMovimientoDTO): Promise<MovimientoResponseDTO>;
  eliminar(id: string): Promise<void>;
  obtenerPorId(id: string): Promise<MovimientoResponseDTO | null>;
  listarPorPerfil(perfilId: string, filtros?: FiltrosMovimientoDTO): Promise<MovimientoResponseDTO[]>;
}

// Tipo exacto que devuelve Prisma cuando incluimos la categoría
type MovimientoConCategoria = Prisma.MovimientoGetPayload<{
  include: { categoria: true };
}>;

export class MovimientoRepository implements IMovimientoRepository {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient = prismaSingleton) {
    this.prisma = prismaClient;
  }

  // Mapper reutilizable para todos los metodos CRUD de Movimientos
  private mapearADto(movimiento: MovimientoConCategoria): MovimientoResponseDTO {
    return {
      id: movimiento.id,
      monto: movimiento.monto.toNumber(),
      fecha: movimiento.fecha,
      descripcion: movimiento.descripcion,
      perfilId: movimiento.id_perfil,
      monedaId: movimiento.id_moneda,
      categoriaId: movimiento.id_categoria,
      medioPagoId: movimiento.id_medio_pago,
      tipo: movimiento.categoria.tipo,
      createdAt: movimiento.created_at,
      updatedAt: movimiento.updated_at,
    };
  }

  // Crea un movimiento en BD y devuelve la creacion como DTO
  async crear(perfilId: string, datosMovimiento: CrearMovimientoDTO): Promise<MovimientoResponseDTO> {
    const nuevoMovimiento = await this.prisma.movimiento.create({
      data: {
        id_perfil: perfilId,
        monto: datosMovimiento.monto,
        fecha: datosMovimiento.fecha,
        descripcion: datosMovimiento.descripcion,
        id_moneda: datosMovimiento.monedaId,
        id_categoria: datosMovimiento.categoriaId,
        id_medio_pago: datosMovimiento.medioPagoId,
      },
      include: {
        categoria: true,
      },
    });

    return this.mapearADto(nuevoMovimiento);
  }

  async actualizar(id: string, datosActualizacion: ActualizarMovimientoDTO): Promise<MovimientoResponseDTO> {
    const movimientoActualizado = await this.prisma.movimiento.update({
      where: { id },
      data: {
        fecha: datosActualizacion.fecha,
        monto: datosActualizacion.monto,
        descripcion: datosActualizacion.descripcion,
        id_moneda: datosActualizacion.monedaId,
        id_categoria: datosActualizacion.categoriaId,
        id_medio_pago: datosActualizacion.medioPagoId
      },
      include: {
        categoria: true,
      },
    });

    return this.mapearADto(movimientoActualizado);
  }

  // Elimina un movimiento
  async eliminar(id: string): Promise<void> {
    await this.prisma.movimiento.delete({
      where: {id}
    });
    
  }
  // Obtener toda la informacion del movimiento por id de movimiento
  async obtenerPorId(id: string): Promise<MovimientoResponseDTO | null> {
    const movimientoSolicitado = await this.prisma.movimiento.findUnique({
      where: {id},
      include: {
        categoria: true
      }
    });
    if (!movimientoSolicitado){
      return null;
    }
    return this.mapearADto(movimientoSolicitado);
  }

  async listarPorPerfil(perfilId: string, filtros?: FiltrosMovimientoDTO): Promise<MovimientoResponseDTO[]> {
    
    let filtroFecha: {gte?: Date; lte?: Date} | undefined;
    if (filtros?.fechaDesde || filtros?.fechaHasta) {
      filtroFecha = {
        gte: filtros.fechaDesde,
        lte: filtros.fechaHasta
      };
    } else if (filtros?.mes && filtros?.anio) {
        const inicio = new Date(filtros.anio, filtros.mes - 1, 1, 0, 0, 0, 0);
        const fin = new Date(filtros.anio, filtros.mes, 0, 23, 59, 59, 999);
        filtroFecha = {
          gte: inicio,
          lte: fin
        };
    }
    const movimientos = await this.prisma.movimiento.findMany({
      where: {
        id_perfil: perfilId,
        id_categoria: filtros?.categoriaId,
        id_medio_pago: filtros?.medioPagoId,
        id_moneda: filtros?.monedaId,
        fecha: filtroFecha
      },
      include: {
        categoria: true,
      },
      orderBy: {
        fecha: 'desc'
      }
    }
    );
    const movimientosDtos = movimientos.map((m) => this.mapearADto(m));
    return movimientosDtos;
  }
}
