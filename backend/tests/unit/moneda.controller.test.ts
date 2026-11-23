import { describe, expect, it, vi } from 'vitest';
import type { NextFunction, Response } from 'express';
import { MonedaController } from '../../src/controllers/moneda.controller.js';
import type { AuthenticatedRequest } from '../../src/middlewares/auth.middleware.js';
import type { IMonedaService } from '../../src/services/moneda.service.js';

describe('MonedaController', () => {
  it('lista las monedas disponibles usando el servicio inyectado', async () => {
    const monedas = [{ id: 'moneda-1', nombre: 'Peso argentino', codigo: 'ARS', simbolo: '$' }];
    const listarDisponibles = vi.fn().mockResolvedValue(monedas);
    const servicioFalso: IMonedaService = {
      listarDisponibles,
      listarPorPerfil: vi.fn(),
      asignar: vi.fn(),
      eliminar: vi.fn(),
    };
    const controller = new MonedaController(servicioFalso);
    const req = {} as AuthenticatedRequest;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    await controller.listarMonedas(req, res, next);

    expect(listarDisponibles).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ exito: true, datos: monedas });
    expect(next).not.toHaveBeenCalled();
  });

  it('delegates service errors to Express', async () => {
    const error = new Error('Error del servicio');
    const servicioFalso: IMonedaService = {
      listarDisponibles: vi.fn().mockRejectedValue(error),
      listarPorPerfil: vi.fn(),
      asignar: vi.fn(),
      eliminar: vi.fn(),
    };
    const controller = new MonedaController(servicioFalso);
    const req = {} as AuthenticatedRequest;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    await controller.listarMonedas(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
