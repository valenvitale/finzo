import { describe, expect, it, vi } from 'vitest';
import type { Response } from 'express';
import type { AuthenticatedRequest } from '../../src/middlewares/auth.middleware.js';
import { MedioPagoController } from '../../src/controllers/medio-pago.controller.js';
import { MedioPagoService } from '../../src/services/medio-pago.service.js';
import { ErrorNoAutorizado } from '../../src/errors/errores.js';

function preparar() {
  const listarPorPerfil = vi.fn().mockResolvedValue([]);
  const obtenerPorId = vi.fn().mockResolvedValue(null);
  const controller = new MedioPagoController(new MedioPagoService({ listarPorPerfil, obtenerPorId }));
  const json = vi.fn();
  const status = vi.fn().mockReturnValue({ json });
  const res = { status } as unknown as Response;
  const next = vi.fn();
  return { controller, listarPorPerfil, obtenerPorId, json, status, res, next };
}

describe('MedioPagoController', () => {
  it('rechaza una consulta sin usuario autenticado antes de acceder al repositorio', async () => {
    const { controller, listarPorPerfil, res, next, status } = preparar();
    await controller.listar({} as AuthenticatedRequest, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ErrorNoAutorizado));
    expect(listarPorPerfil).not.toHaveBeenCalled();
    expect(status).not.toHaveBeenCalled();
  });

  it('usa el perfil autenticado aunque el cliente envie otro perfil', async () => {
    const { controller, listarPorPerfil, res, next, status, json } = preparar();
    const fecha = new Date('2026-10-13T12:00:00Z');
    listarPorPerfil.mockResolvedValue([{
      id: 'medio-1', nombre: 'Efectivo', icono: 'cash', id_perfil: null,
      created_at: fecha, updated_at: fecha,
    }]);
    const req = {
      user: { id: 'perfil-autenticado', email: 'usuario@example.com' },
      query: { idPerfil: 'otro-perfil' },
      params: { idPerfil: 'otro-perfil' },
      body: { idPerfil: 'otro-perfil' },
    } as unknown as AuthenticatedRequest;

    await controller.listar(req, res, next);

    expect(listarPorPerfil).toHaveBeenCalledWith('perfil-autenticado');
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ exito: true, datos: [{
      id: 'medio-1', nombre: 'Efectivo', icono: 'cash', id_perfil: null,
      created_at: fecha.toISOString(), updated_at: fecha.toISOString(),
    }] });
    expect(next).not.toHaveBeenCalled();
  });

  it('propaga los errores al middleware central', async () => {
    const { controller, listarPorPerfil, res, next, status } = preparar();
    const error = new Error('Error de base de datos');
    listarPorPerfil.mockRejectedValue(error);
    const req = { user: { id: 'perfil-1', email: '' } } as AuthenticatedRequest;
    await controller.listar(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
    expect(status).not.toHaveBeenCalled();
  });
});
