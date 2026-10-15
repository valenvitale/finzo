
import { describe, it, expect, vi } from 'vitest';
import { ResumenController } from '../../src/controllers/resumen.controller.js';
import type { IResumenService } from '../../src/services/resumen.service.js';
import type { AuthenticatedRequest } from '../../src/middlewares/auth.middleware.js';
import type { Response, NextFunction } from 'express';

describe('ResumenController', () => {
  it('obtiene el resumen usando un servicio simulado', async () => {
    const resumen = {
      totalIngresos: 1000,
      totalGastos: 300,
      balance: 700,
      moneda: 'ARS',
    };

    const obtenerResumen = vi.fn().mockResolvedValue(resumen);

    // Servicio falso: no utiliza Prisma ni Supabase.
    const servicioFalso: IResumenService = {
      obtenerResumen,
    };

    const controller = new ResumenController(servicioFalso);

    const req = {
      user: { id: 'usuario-123' },
      query: { mes: 10, anio: 2026 },
    } as unknown as AuthenticatedRequest;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const next = vi.fn() as NextFunction;

    await controller.obtenerResumen(req, res, next);

    expect(obtenerResumen).toHaveBeenCalledWith(
      'usuario-123',
      10,
      2026
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      exito: true,
      datos: resumen,
    });
    expect(next).not.toHaveBeenCalled();
  });
});
