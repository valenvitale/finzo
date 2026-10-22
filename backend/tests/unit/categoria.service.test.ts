import { describe, expect, it, vi } from 'vitest';
import { CategoriaService } from '../../src/services/categoria.service.js';
import { type ICategoriaRepository } from '../../src/repositories/categoria.repository.js';
import { ErrorDeConflicto, ErrorNoEncontrado, ErrorProhibido } from '../../src/errors/errores.js';

describe('CategoriaService', () => {
  const mockCategoriaPropia = {
    id: 'cat-propia',
    nombre: 'Gimnasio',
    color: '#00FF00',
    tipo: 'GASTO' as const,
    perfilId: 'perfil-1',
    createdAt: new Date('2026-10-12T12:00:00Z'),
    updatedAt: new Date('2026-10-12T12:00:00Z'),
  };

  const mockCategoriaPredeterminada = {
    id: 'cat-sistema',
    nombre: 'Comida',
    color: '#FFAA00',
    tipo: 'GASTO' as const,
    perfilId: null,
    createdAt: new Date('2026-10-12T12:00:00Z'),
    updatedAt: new Date('2026-10-12T12:00:00Z'),
  };

  function preparar(mockRepoOverrides: Partial<ICategoriaRepository> = {}) {
    const mockRepo: ICategoriaRepository = {
      crear: vi.fn().mockResolvedValue(mockCategoriaPropia),
      actualizar: vi.fn().mockResolvedValue(mockCategoriaPropia),
      eliminar: vi.fn().mockResolvedValue(undefined),
      obtenerPorId: vi.fn().mockResolvedValue(mockCategoriaPropia),
      listarPorPerfil: vi.fn().mockResolvedValue([mockCategoriaPredeterminada, mockCategoriaPropia]),
      contarPersonalizadasPorPerfil: vi.fn().mockResolvedValue(2),
      contarMovimientosAsociados: vi.fn().mockResolvedValue(0),
      ...mockRepoOverrides,
    };
    const service = new CategoriaService(mockRepo);
    return { service, mockRepo };
  }

  describe('crear', () => {
    it('crea una categoría cuando el límite no fue alcanzado', async () => {
      const { service, mockRepo } = preparar();
      const resultado = await service.crear('perfil-1', {
        nombre: 'Gimnasio',
        color: '#00FF00',
        tipo: 'GASTO',
      });
      expect(mockRepo.crear).toHaveBeenCalledWith('perfil-1', {
        nombre: 'Gimnasio',
        color: '#00FF00',
        tipo: 'GASTO',
      });
      expect(resultado).toEqual(mockCategoriaPropia);
    });

    it('lanza ErrorDeConflicto si el perfil ya tiene 8 categorías personalizadas', async () => {
      const { service } = preparar({
        contarPersonalizadasPorPerfil: vi.fn().mockResolvedValue(8),
      });
      await expect(
        service.crear('perfil-1', {
          nombre: 'Extra',
          color: '#111111',
          tipo: 'GASTO',
        })
      ).rejects.toThrow(ErrorDeConflicto);
    });
  });

  describe('actualizar', () => {
    it('permite actualizar una categoría propia', async () => {
      const { service, mockRepo } = preparar();
      await service.actualizar('cat-propia', 'perfil-1', { nombre: 'Crossfit' });
      expect(mockRepo.actualizar).toHaveBeenCalledWith('cat-propia', { nombre: 'Crossfit' });
    });

    it('impide actualizar una categoría predeterminada', async () => {
      const { service } = preparar({
        obtenerPorId: vi.fn().mockResolvedValue(mockCategoriaPredeterminada),
      });
      await expect(service.actualizar('cat-sistema', 'perfil-1', { nombre: 'Nuevo' })).rejects.toThrow(ErrorProhibido);
    });

    it('impide actualizar una categoría perteneciente a otro perfil', async () => {
      const { service } = preparar({
        obtenerPorId: vi.fn().mockResolvedValue({ ...mockCategoriaPropia, perfilId: 'otro-perfil' }),
      });
      await expect(service.actualizar('cat-propia', 'perfil-1', { nombre: 'Nuevo' })).rejects.toThrow(ErrorProhibido);
    });

    it('impide cambiar el tipo si la categoría tiene movimientos asociados', async () => {
      const { service } = preparar({
        contarMovimientosAsociados: vi.fn().mockResolvedValue(3),
      });
      await expect(service.actualizar('cat-propia', 'perfil-1', { tipo: 'INGRESO' })).rejects.toThrow(ErrorDeConflicto);
    });
  });

  describe('eliminar', () => {
    it('elimina una categoría propia sin movimientos asociados', async () => {
      const { service, mockRepo } = preparar();
      await service.eliminar('cat-propia', 'perfil-1');
      expect(mockRepo.eliminar).toHaveBeenCalledWith('cat-propia');
    });

    it('impide eliminar una categoría con movimientos asociados', async () => {
      const { service } = preparar({
        contarMovimientosAsociados: vi.fn().mockResolvedValue(2),
      });
      await expect(service.eliminar('cat-propia', 'perfil-1')).rejects.toThrow(ErrorDeConflicto);
    });

    it('impide eliminar una categoría predeterminada', async () => {
      const { service } = preparar({
        obtenerPorId: vi.fn().mockResolvedValue(mockCategoriaPredeterminada),
      });
      await expect(service.eliminar('cat-sistema', 'perfil-1')).rejects.toThrow(ErrorProhibido);
    });
  });

  describe('obtenerPorId', () => {
    it('obtiene una categoría existente', async () => {
      const { service } = preparar();
      const resultado = await service.obtenerPorId('cat-propia', 'perfil-1');
      expect(resultado).toEqual(mockCategoriaPropia);
    });

    it('lanza ErrorNoEncontrado si la categoría no existe', async () => {
      const { service } = preparar({
        obtenerPorId: vi.fn().mockResolvedValue(null),
      });
      await expect(service.obtenerPorId('inexistente', 'perfil-1')).rejects.toThrow(ErrorNoEncontrado);
    });

    it('lanza ErrorProhibido si la categoría pertenece a otro perfil', async () => {
      const { service } = preparar({
        obtenerPorId: vi.fn().mockResolvedValue({ ...mockCategoriaPropia, perfilId: 'otro' }),
      });
      await expect(service.obtenerPorId('cat-propia', 'perfil-1')).rejects.toThrow(ErrorProhibido);
    });
  });
});
