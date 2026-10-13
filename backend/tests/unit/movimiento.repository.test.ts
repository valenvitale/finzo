import { describe, expect, it, vi } from 'vitest';
import { Prisma, PrismaClient } from '@prisma/client';
import { MovimientoRepository } from '../../src/repositories/movimiento.repository.js';
import { CrearMovimientoDTO, ActualizarMovimientoDTO } from '../../src/types/movimiento.types.js';

describe('MovimientoRepository', () => {
  const mockPrismaMovimiento = {
    id: 'mov-1',
    monto: new Prisma.Decimal(2500.75),
    fecha: new Date('2026-10-12T12:00:00Z'),
    descripcion: 'Pago de servicios',
    id_perfil: 'perfil-1',
    id_moneda: 'moneda-1',
    id_categoria: 'categoria-1',
    id_medio_pago: 'medio-1',
    created_at: new Date('2026-10-12T12:00:00Z'),
    updated_at: new Date('2026-10-12T12:00:00Z'),
    categoria: {
      tipo: 'GASTO' as const,
    },
  };

  it('crea un movimiento y lo mapea correctamente a DTO', async () => {
    const mockPrisma = {
      movimiento: {
        create: vi.fn().mockResolvedValue(mockPrismaMovimiento),
      },
    } as unknown as PrismaClient;

    const repository = new MovimientoRepository(mockPrisma);
    const dto: CrearMovimientoDTO = {
      fecha: mockPrismaMovimiento.fecha,
      monto: 2500.75,
      descripcion: 'Pago de servicios',
      monedaId: 'moneda-1',
      categoriaId: 'categoria-1',
      medioPagoId: 'medio-1',
    };

    const resultado = await repository.crear('perfil-1', dto);

    expect(mockPrisma.movimiento.create).toHaveBeenCalledWith({
      data: {
        id_perfil: 'perfil-1',
        monto: dto.monto,
        fecha: dto.fecha,
        descripcion: dto.descripcion,
        id_moneda: dto.monedaId,
        id_categoria: dto.categoriaId,
        id_medio_pago: dto.medioPagoId,
      },
      include: {
        categoria: true,
      },
    });

    expect(resultado).toEqual({
      id: 'mov-1',
      monto: 2500.75,
      fecha: mockPrismaMovimiento.fecha,
      descripcion: 'Pago de servicios',
      perfilId: 'perfil-1',
      monedaId: 'moneda-1',
      categoriaId: 'categoria-1',
      medioPagoId: 'medio-1',
      tipo: 'GASTO',
      createdAt: mockPrismaMovimiento.created_at,
      updatedAt: mockPrismaMovimiento.updated_at,
    });
  });

  it('obtiene un movimiento por id', async () => {
    const mockPrisma = {
      movimiento: {
        findUnique: vi.fn().mockResolvedValue(mockPrismaMovimiento),
      },
    } as unknown as PrismaClient;

    const repository = new MovimientoRepository(mockPrisma);
    const resultado = await repository.obtenerPorId('mov-1');

    expect(mockPrisma.movimiento.findUnique).toHaveBeenCalledWith({
      where: { id: 'mov-1' },
      include: { categoria: true },
    });
    expect(resultado?.id).toBe('mov-1');
    expect(resultado?.tipo).toBe('GASTO');
  });

  it('retorna null si el movimiento no existe', async () => {
    const mockPrisma = {
      movimiento: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
    } as unknown as PrismaClient;

    const repository = new MovimientoRepository(mockPrisma);
    const resultado = await repository.obtenerPorId('mov-inexistente');

    expect(resultado).toBeNull();
  });

  it('actualiza un movimiento y devuelve el DTO mapeado', async () => {
    const mockPrisma = {
      movimiento: {
        update: vi.fn().mockResolvedValue(mockPrismaMovimiento),
      },
    } as unknown as PrismaClient;

    const repository = new MovimientoRepository(mockPrisma);
    const dtoActualizacion: ActualizarMovimientoDTO = {
      monto: 3000,
    };

    const resultado = await repository.actualizar('mov-1', dtoActualizacion);

    expect(mockPrisma.movimiento.update).toHaveBeenCalledWith({
      where: { id: 'mov-1' },
      data: {
        fecha: undefined,
        monto: 3000,
        descripcion: undefined,
        id_moneda: undefined,
        id_categoria: undefined,
        id_medio_pago: undefined,
      },
      include: {
        categoria: true,
      },
    });
    expect(resultado.id).toBe('mov-1');
  });

  it('elimina un movimiento por id', async () => {
    const mockPrisma = {
      movimiento: {
        delete: vi.fn().mockResolvedValue(mockPrismaMovimiento),
      },
    } as unknown as PrismaClient;

    const repository = new MovimientoRepository(mockPrisma);
    await repository.eliminar('mov-1');

    expect(mockPrisma.movimiento.delete).toHaveBeenCalledWith({
      where: { id: 'mov-1' },
    });
  });

  it('lista movimientos filtrando por perfil', async () => {
    const mockPrisma = {
      movimiento: {
        findMany: vi.fn().mockResolvedValue([mockPrismaMovimiento]),
      },
    } as unknown as PrismaClient;

    const repository = new MovimientoRepository(mockPrisma);
    const resultado = await repository.listarPorPerfil('perfil-1', {
      mes: 10,
      anio: 2026,
    });

    expect(mockPrisma.movimiento.findMany).toHaveBeenCalled();
    expect(resultado).toHaveLength(1);
    expect(resultado[0].perfilId).toBe('perfil-1');
  });

  it('lista movimientos filtrando por tipo y rango de montos', async () => {
    const mockPrisma = {
      movimiento: {
        findMany: vi.fn().mockResolvedValue([mockPrismaMovimiento]),
      },
    } as unknown as PrismaClient;

    const repository = new MovimientoRepository(mockPrisma);
    await repository.listarPorPerfil('perfil-1', {
      tipo: 'GASTO',
      montoMinimo: 1000,
      montoMaximo: 5000,
    });

    expect(mockPrisma.movimiento.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id_perfil: 'perfil-1',
          categoria: { tipo: 'GASTO' },
          monto: { gte: 1000, lte: 5000 },
        }),
      })
    );
  });
});
