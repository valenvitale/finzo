import { describe, expect, it, vi } from 'vitest';
import { MedioPagoService } from '../../src/services/medio-pago.service.js';
import type { IMedioPagoRepository } from '../../src/repositories/medio-pago.repository.js';
import { ErrorProhibido } from '../../src/errors/errores.js';

describe('MedioPagoService', () => {
  const mockMedioPago = {
    id: 'medio-1',
    nombre: 'Tarjeta de Débito',
    icono: 'credit-card',
    id_perfil: 'perfil-1',
    created_at: new Date('2026-10-12T10:00:00Z'),
    updated_at: new Date('2026-10-12T10:00:00Z'),
  };

  function preparar(overrides: Partial<IMedioPagoRepository> = {}) {
    const mockRepo: IMedioPagoRepository = {
      obtenerPorId: vi.fn().mockResolvedValue(mockMedioPago),
      crear: vi.fn().mockResolvedValue(mockMedioPago),
      actualizar: vi.fn().mockResolvedValue(mockMedioPago),
      listarPorPerfil: vi.fn().mockResolvedValue([mockMedioPago]),
      eliminar: vi.fn().mockResolvedValue(undefined),
      ...overrides,
    };

    const service = new MedioPagoService(mockRepo);

    return { service, mockRepo };
  }

    it('rechaza editar un medio de pago del sistema', async () => {
        const { service, mockRepo } = preparar({
            obtenerPorId: vi.fn().mockResolvedValue({
            ...mockMedioPago,
            id_perfil: null,
            }),
    });

    await expect(service.actualizar('medio-1', 'perfil-1', { nombre: 'Otro nombre' })).rejects.toThrow(ErrorProhibido);

    expect(mockRepo.actualizar).not.toHaveBeenCalled();

    });

    it('rechaza eliminar un medio de pago del sistema', async () => {
        const { service, mockRepo } = preparar({
            obtenerPorId: vi.fn().mockResolvedValue({
            ...mockMedioPago,
            id_perfil: null,
            }),
        });

        await expect(
            service.eliminar('medio-1', 'perfil-1')
            ).rejects.toThrow(ErrorProhibido);

        expect(mockRepo.eliminar).not.toHaveBeenCalled();

    });

    it('crea un medio de pago para el usuario', async () => {
        const { service, mockRepo } = preparar();
        const datos = {
            nombre: 'Tarjeta de Débito',
            icono: 'credit-card',
        };

        const resultado = await service.crear('perfil-1', datos);

        expect(mockRepo.crear).toHaveBeenCalledWith('perfil-1', datos);

        expect(resultado.id_perfil).toBe('perfil-1');
        expect(resultado.created_at).toBe(mockMedioPago.created_at.toISOString());
    });

    it('rechaza editar un medio de pago de otro usuario', async () => {
        const { service, mockRepo } = preparar({
            obtenerPorId: vi.fn().mockResolvedValue({
            ...mockMedioPago,
            id_perfil: 'otro-perfil',
            }),
        });

        await expect(service.actualizar('medio-1', 'perfil-1', { nombre: 'Otro nombre' })).rejects.toThrow('No tienes permiso para modificar este medio de pago.');

        expect(mockRepo.actualizar).not.toHaveBeenCalled();
    });
});