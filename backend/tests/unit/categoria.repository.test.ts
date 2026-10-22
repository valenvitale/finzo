import { describe, expect, it, vi } from 'vitest';
import type { PrismaClient } from '@prisma/client';
import { CategoriaRepository } from '../../src/repositories/categoria.repository.js';
import type { CrearCategoriaDTO, ActualizarCategoriaDTO } from '../../src/types/categoria.types.js';

describe('CategoriaRepository', () => {
  const mockPrismaCategoria = {
    id: 'cat-1',
    nombre: 'Supermercado',
    color: '#FF5733',
    tipo: 'GASTO' as const,
    id_perfil: 'perfil-1',
    created_at: new Date('2026-10-12T12:00:00Z'),
    updated_at: new Date('2026-10-12T12:00:00Z'),
  };

  it('crea una categoría y la mapea correctamente a DTO', async () => {
    const mockPrisma = {
      categoria: {
        create: vi.fn().mockResolvedValue(mockPrismaCategoria),
      },
    } as unknown as PrismaClient;

    const repository = new CategoriaRepository(mockPrisma);
    const dto: CrearCategoriaDTO = {
      nombre: 'Supermercado',
      color: '#FF5733',
      tipo: 'GASTO',
    };

    const resultado = await repository.crear('perfil-1', dto);

    expect(mockPrisma.categoria.create).toHaveBeenCalledWith({
      data: {
        id_perfil: 'perfil-1',
        nombre: dto.nombre,
        color: dto.color,
        tipo: dto.tipo,
      },
    });

    expect(resultado).toEqual({
      id: 'cat-1',
      nombre: 'Supermercado',
      color: '#FF5733',
      tipo: 'GASTO',
      perfilId: 'perfil-1',
      createdAt: mockPrismaCategoria.created_at,
      updatedAt: mockPrismaCategoria.updated_at,
    });
  });

  it('obtiene una categoría por id', async () => {
    const mockPrisma = {
      categoria: {
        findUnique: vi.fn().mockResolvedValue(mockPrismaCategoria),
      },
    } as unknown as PrismaClient;

    const repository = new CategoriaRepository(mockPrisma);
    const resultado = await repository.obtenerPorId('cat-1');

    expect(mockPrisma.categoria.findUnique).toHaveBeenCalledWith({
      where: { id: 'cat-1' },
    });
    expect(resultado?.id).toBe('cat-1');
    expect(resultado?.nombre).toBe('Supermercado');
    expect(resultado?.perfilId).toBe('perfil-1');
  });

  it('retorna null si la categoría no existe', async () => {
    const mockPrisma = {
      categoria: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
    } as unknown as PrismaClient;

    const repository = new CategoriaRepository(mockPrisma);
    const resultado = await repository.obtenerPorId('cat-inexistente');

    expect(resultado).toBeNull();
  });

  it('actualiza una categoría y devuelve el DTO mapeado', async () => {
    const categoriaActualizadaMock = {
      ...mockPrismaCategoria,
      nombre: 'Supermercado e Hiper',
    };

    const mockPrisma = {
      categoria: {
        update: vi.fn().mockResolvedValue(categoriaActualizadaMock),
      },
    } as unknown as PrismaClient;

    const repository = new CategoriaRepository(mockPrisma);
    const dtoActualizacion: ActualizarCategoriaDTO = {
      nombre: 'Supermercado e Hiper',
    };

    const resultado = await repository.actualizar('cat-1', dtoActualizacion);

    expect(mockPrisma.categoria.update).toHaveBeenCalledWith({
      where: { id: 'cat-1' },
      data: {
        nombre: 'Supermercado e Hiper',
        color: undefined,
        tipo: undefined,
      },
    });
    expect(resultado.nombre).toBe('Supermercado e Hiper');
    expect(resultado.perfilId).toBe('perfil-1');
  });

  it('elimina una categoría por id', async () => {
    const mockPrisma = {
      categoria: {
        delete: vi.fn().mockResolvedValue(mockPrismaCategoria),
      },
    } as unknown as PrismaClient;

    const repository = new CategoriaRepository(mockPrisma);
    await repository.eliminar('cat-1');

    expect(mockPrisma.categoria.delete).toHaveBeenCalledWith({
      where: { id: 'cat-1' },
    });
  });

  it('lista categorías accesibles para un perfil (predeterminadas y propias)', async () => {
    const mockPrisma = {
      categoria: {
        findMany: vi.fn().mockResolvedValue([mockPrismaCategoria]),
      },
    } as unknown as PrismaClient;

    const repository = new CategoriaRepository(mockPrisma);
    const resultado = await repository.listarPorPerfil('perfil-1');

    expect(mockPrisma.categoria.findMany).toHaveBeenCalledWith({
      where: {
        OR: [{ id_perfil: null }, { id_perfil: 'perfil-1' }],
      },
      orderBy: [{ nombre: 'asc' }, { id: 'asc' }],
    });
    expect(resultado).toHaveLength(1);
    expect(resultado[0].perfilId).toBe('perfil-1');
  });

  it('cuenta categorías personalizadas por perfil', async () => {
    const mockPrisma = {
      categoria: {
        count: vi.fn().mockResolvedValue(3),
      },
    } as unknown as PrismaClient;

    const repository = new CategoriaRepository(mockPrisma);
    const cantidad = await repository.contarPersonalizadasPorPerfil('perfil-1');

    expect(mockPrisma.categoria.count).toHaveBeenCalledWith({
      where: { id_perfil: 'perfil-1' },
    });
    expect(cantidad).toBe(3);
  });

  it('cuenta movimientos asociados a una categoría', async () => {
    const mockPrisma = {
      movimiento: {
        count: vi.fn().mockResolvedValue(5),
      },
    } as unknown as PrismaClient;

    const repository = new CategoriaRepository(mockPrisma);
    const cantidad = await repository.contarMovimientosAsociados('cat-1');

    expect(mockPrisma.movimiento.count).toHaveBeenCalledWith({
      where: { id_categoria: 'cat-1' },
    });
    expect(cantidad).toBe(5);
  });
});
