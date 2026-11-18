import { describe, expect, it, vi } from 'vitest';
import type { NextFunction, Response } from 'express';
import { PerfilController } from '../../src/controllers/perfil.controller.js';
import type { AuthenticatedRequest } from '../../src/middlewares/auth.middleware.js';
import type { IPerfilService } from '../../src/services/perfil.service.js';

describe('PerfilController', () => {
  it('obtiene el perfil usando el servicio inyectado', async () => {
    const perfil = {
      id: 'usuario-123',
      nombre: 'Máximo',
      apellido: 'Messina',
      foto_perfil: null,
      email: 'maximo@example.com',
      created_at: new Date(),
      updated_at: new Date(),
    };
    const obtenerPerfil = vi.fn().mockResolvedValue(perfil);
    const servicioFalso: IPerfilService = {
      obtenerPerfil,
      actualizarPerfil: vi.fn(),
    };
    const controller = new PerfilController(servicioFalso);
    const req = { user: { id: 'usuario-123', email: 'maximo@example.com' } } as AuthenticatedRequest;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    await controller.obtenerPerfil(req, res, next);

    expect(obtenerPerfil).toHaveBeenCalledWith('usuario-123', 'maximo@example.com');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ exito: true, datos: perfil });
    expect(next).not.toHaveBeenCalled();
  });

  it('delegates service errors to Express', async () => {
    const error = new Error('Error del servicio');
    const servicioFalso: IPerfilService = {
      obtenerPerfil: vi.fn().mockRejectedValue(error),
      actualizarPerfil: vi.fn(),
    };
    const controller = new PerfilController(servicioFalso);
    const req = { user: { id: 'usuario-123', email: 'maximo@example.com' } } as AuthenticatedRequest;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    await controller.obtenerPerfil(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
