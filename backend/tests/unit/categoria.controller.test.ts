import { describe, expect, it, vi } from 'vitest';
import type { Response } from 'express';
import type { AuthenticatedRequest } from '../../src/middlewares/auth.middleware.js';
import { CategoriaController } from '../../src/controllers/categoria.controller.js';
import { type CategoriaService } from '../../src/services/categoria.service.js';
import { ErrorNoAutorizado } from '../../src/errors/errores.js';

describe('CategoriaController', () => {
  const mockCategoria = {
    id: 'cat-1',
    nombre: 'Servicios',
    color: '#123456',
    tipo: 'GASTO' as const,
    perfilId: 'perfil-1',
    createdAt: new Date('2026-10-12T12:00:00Z'),
    updatedAt: new Date('2026-10-12T12:00:00Z'),
  };

  function preparar() {
    const mockService = {
      crear: vi.fn().mockResolvedValue(mockCategoria),
      obtenerPorId: vi.fn().mockResolvedValue(mockCategoria),
      actualizar: vi.fn().mockResolvedValue(mockCategoria),
      eliminar: vi.fn().mockResolvedValue(undefined),
      listarPorPerfil: vi.fn().mockResolvedValue([mockCategoria]),
    } as unknown as CategoriaService;

    const controller = new CategoriaController(mockService);
    const json = vi.fn();
    const send = vi.fn();
    const status = vi.fn().mockReturnValue({ json, send });
    const res = { status } as unknown as Response;
    const next = vi.fn();

    return { controller, mockService, json, send, status, res, next };
  }

  it('rechaza una consulta sin usuario autenticado', async () => {
    const { controller, res, next } = preparar();
    await controller.listar({} as AuthenticatedRequest, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ErrorNoAutorizado));
  });

  it('crea una categoría retornando 201 y formato estándar', async () => {
    const { controller, mockService, res, status, json, next } = preparar();
    const req = {
      user: { id: 'perfil-1' },
      body: { nombre: 'Servicios', color: '#123456', tipo: 'GASTO' },
    } as unknown as AuthenticatedRequest;

    await controller.crear(req, res, next);

    expect(mockService.crear).toHaveBeenCalledWith('perfil-1', req.body);
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({ exito: true, datos: mockCategoria });
    expect(next).not.toHaveBeenCalled();
  });

  it('obtiene una categoría por id con código 200', async () => {
    const { controller, mockService, res, status, json, next } = preparar();
    const req = {
      user: { id: 'perfil-1' },
      params: { id: 'cat-1' },
    } as unknown as AuthenticatedRequest;

    await controller.obtenerPorId(req, res, next);

    expect(mockService.obtenerPorId).toHaveBeenCalledWith('cat-1', 'perfil-1');
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ exito: true, datos: mockCategoria });
  });

  it('actualiza una categoría retornando 200 y datos actualizados', async () => {
    const { controller, mockService, res, status, json, next } = preparar();
    const req = {
      user: { id: 'perfil-1' },
      params: { id: 'cat-1' },
      body: { nombre: 'Servicios actualizados' },
    } as unknown as AuthenticatedRequest;

    await controller.actualizar(req, res, next);

    expect(mockService.actualizar).toHaveBeenCalledWith('cat-1', 'perfil-1', req.body);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ exito: true, datos: mockCategoria });
  });

  it('elimina una categoría retornando 204 sin contenido', async () => {
    const { controller, mockService, res, status, send, next } = preparar();
    const req = {
      user: { id: 'perfil-1' },
      params: { id: 'cat-1' },
    } as unknown as AuthenticatedRequest;

    await controller.eliminar(req, res, next);

    expect(mockService.eliminar).toHaveBeenCalledWith('cat-1', 'perfil-1');
    expect(status).toHaveBeenCalledWith(204);
    expect(send).toHaveBeenCalled();
  });

  it('lista categorías accesibles para el perfil autenticado', async () => {
    const { controller, mockService, res, status, json, next } = preparar();
    const req = {
      user: { id: 'perfil-1' },
    } as unknown as AuthenticatedRequest;

    await controller.listar(req, res, next);

    expect(mockService.listarPorPerfil).toHaveBeenCalledWith('perfil-1');
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ exito: true, datos: [mockCategoria] });
  });
});
