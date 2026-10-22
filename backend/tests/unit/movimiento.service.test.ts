import { describe, expect, it, vi } from 'vitest';
import { MovimientoService } from '../../src/services/movimiento.service.js';
import { IMovimientoRepository } from '../../src/repositories/movimiento.repository.js';
import { ICategoriaRepository } from '../../src/repositories/categoria.repository.js';
import { IMedioPagoRepository } from '../../src/repositories/medio-pago.repository.js';
import { ErrorDeValidacion, ErrorNoEncontrado, ErrorProhibido } from '../../src/errors/errores.js';
import { CrearMovimientoDTO, MovimientoResponseDTO } from '../../src/types/movimiento.types.js';

describe('MovimientoService', () => {
  const mockMovimiento: MovimientoResponseDTO = {
    id: 'mov-1',
    monto: 1500,
    fecha: new Date('2026-10-12T10:00:00Z'),
    descripcion: 'Supermercado',
    perfilId: 'perfil-1',
    monedaId: 'moneda-1',
    categoriaId: 'cat-1',
    medioPagoId: 'medio-1',
    tipo: 'GASTO',
    createdAt: new Date('2026-10-12T10:00:00Z'),
    updatedAt: new Date('2026-10-12T10:00:00Z'),
  };

  const mockCategoria = {
    id: 'cat-1',
    nombre: 'Alimentos',
    color: '#FF0000',
    tipo: 'GASTO' as const,
    perfilId: 'perfil-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockMedioPago = {
    id: 'medio-1',
    nombre: 'Tarjeta de Débito',
    icono: 'credit-card',
    id_perfil: 'perfil-1',
    created_at: new Date(),
    updated_at: new Date(),
  };

  function preparar(
    mockMovRepoOverrides: Partial<IMovimientoRepository> = {},
    mockCatRepoOverrides: Partial<ICategoriaRepository> = {},
    mockMedioRepoOverrides: Partial<IMedioPagoRepository> = {}
  ) {
    const mockMovRepo: IMovimientoRepository = {
      crear: vi.fn().mockResolvedValue(mockMovimiento),
      actualizar: vi.fn().mockResolvedValue(mockMovimiento),
      eliminar: vi.fn().mockResolvedValue(undefined),
      obtenerPorId: vi.fn().mockResolvedValue(mockMovimiento),
      listarPorPerfil: vi.fn().mockResolvedValue([mockMovimiento]),
      ...mockMovRepoOverrides,
    };

    const mockCatRepo: ICategoriaRepository = {
      crear: vi.fn(),
      actualizar: vi.fn(),
      eliminar: vi.fn(),
      obtenerPorId: vi.fn().mockResolvedValue(mockCategoria),
      listarPorPerfil: vi.fn(),
      contarPersonalizadasPorPerfil: vi.fn(),
      contarMovimientosAsociados: vi.fn(),
      ...mockCatRepoOverrides,
    };

    const mockMedioRepo: IMedioPagoRepository = {
      listarPorPerfil: vi.fn(),
      obtenerPorId: vi.fn().mockResolvedValue(mockMedioPago),
      ...mockMedioRepoOverrides,
    };

    const service = new MovimientoService(mockMovRepo, mockCatRepo, mockMedioRepo);
    return { service, mockMovRepo, mockCatRepo, mockMedioRepo };
  }

  describe('crear', () => {
    const dtoValido: CrearMovimientoDTO = {
      monto: 1500,
      fecha: new Date('2026-10-12T10:00:00Z'),
      descripcion: 'Supermercado',
      monedaId: 'moneda-1',
      categoriaId: 'cat-1',
      medioPagoId: 'medio-1',
    };

    it('crea un movimiento correctamente cuando los datos y relaciones son válidos', async () => {
      const { service, mockMovRepo } = preparar();
      const resultado = await service.crear('perfil-1', dtoValido);

      expect(mockMovRepo.crear).toHaveBeenCalledWith('perfil-1', dtoValido);
      expect(resultado).toEqual(mockMovimiento);
    });

    it('lanza ErrorDeValidacion si el medio de pago especificado no existe', async () => {
      const { service } = preparar({}, {}, {
        obtenerPorId: vi.fn().mockResolvedValue(null),
      });

      await expect(service.crear('perfil-1', dtoValido)).rejects.toThrow(
        new ErrorDeValidacion('El medio de pago especificado no existe')
      );
    });

    it('lanza ErrorProhibido si el medio de pago pertenece a otro perfil', async () => {
      const { service } = preparar({}, {}, {
        obtenerPorId: vi.fn().mockResolvedValue({ ...mockMedioPago, id_perfil: 'otro-perfil' }),
      });

      await expect(service.crear('perfil-1', dtoValido)).rejects.toThrow(
        new ErrorProhibido('No tienes permiso para utilizar este medio de pago')
      );
    });

    it('permite utilizar un medio de pago global (id_perfil null)', async () => {
      const { service, mockMovRepo } = preparar({}, {}, {
        obtenerPorId: vi.fn().mockResolvedValue({ ...mockMedioPago, id_perfil: null }),
      });

      const resultado = await service.crear('perfil-1', dtoValido);
      expect(mockMovRepo.crear).toHaveBeenCalledWith('perfil-1', dtoValido);
      expect(resultado).toEqual(mockMovimiento);
    });

    it('lanza ErrorDeValidacion si la categoría especificada no existe', async () => {
      const { service } = preparar({}, {
        obtenerPorId: vi.fn().mockResolvedValue(null),
      });

      await expect(service.crear('perfil-1', dtoValido)).rejects.toThrow(
        new ErrorDeValidacion('La categoría especificada no existe')
      );
    });

    it('lanza ErrorProhibido si la categoría pertenece a otro perfil', async () => {
      const { service } = preparar({}, {
        obtenerPorId: vi.fn().mockResolvedValue({ ...mockCategoria, perfilId: 'otro-perfil' }),
      });

      await expect(service.crear('perfil-1', dtoValido)).rejects.toThrow(
        new ErrorProhibido('No tienes permiso para utilizar esta categoría')
      );
    });
  });

  describe('actualizar', () => {
    it('lanza ErrorNoEncontrado si el movimiento no existe', async () => {
      const { service } = preparar({
        obtenerPorId: vi.fn().mockResolvedValue(null),
      });

      await expect(service.actualizar('mov-1', 'perfil-1', { monto: 2000 })).rejects.toThrow(ErrorNoEncontrado);
    });

    it('lanza ErrorProhibido si el movimiento pertenece a otro perfil', async () => {
      const { service } = preparar({
        obtenerPorId: vi.fn().mockResolvedValue({ ...mockMovimiento, perfilId: 'otro-perfil' }),
      });

      await expect(service.actualizar('mov-1', 'perfil-1', { monto: 2000 })).rejects.toThrow(ErrorProhibido);
    });

    it('valida el medio de pago en la actualización si se envía', async () => {
      const { service } = preparar({}, {}, {
        obtenerPorId: vi.fn().mockResolvedValue(null),
      });

      await expect(service.actualizar('mov-1', 'perfil-1', { medioPagoId: 'medio-inexistente' })).rejects.toThrow(
        new ErrorDeValidacion('El medio de pago especificado no existe')
      );
    });
  });

  describe('eliminar', () => {
    it('elimina un movimiento propio', async () => {
      const { service, mockMovRepo } = preparar();
      await service.eliminar('mov-1', 'perfil-1');
      expect(mockMovRepo.eliminar).toHaveBeenCalledWith('mov-1');
    });

    it('lanza ErrorProhibido si se intenta eliminar el movimiento de otro usuario', async () => {
      const { service } = preparar({
        obtenerPorId: vi.fn().mockResolvedValue({ ...mockMovimiento, perfilId: 'otro-perfil' }),
      });

      await expect(service.eliminar('mov-1', 'perfil-1')).rejects.toThrow(ErrorProhibido);
    });
  });
});

