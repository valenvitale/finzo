
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextFunction, Response } from 'express';

import {
  authMiddleware,
  type AuthenticatedRequest,
} from '../../src/middlewares/auth.middleware.js';

import { ErrorNoAutorizado } from '../../src/errors/errores.js';

// Simulamos Supabase para evitar llamadas reales.
vi.mock('../../src/config/supabase.js', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
  },
}));

import { supabase } from '../../src/config/supabase.js';

describe('authMiddleware', () => {
  const getUserMock = vi.mocked(supabase.auth.getUser);

  // Comprueba que el middleware devuelva un error 401.
  function verificarError401(error: unknown) {
    expect(error).toBeInstanceOf(ErrorNoAutorizado);

    if (!(error instanceof ErrorNoAutorizado)) {
      throw new Error('Se esperaba un ErrorNoAutorizado');
    }

    expect(error.statusCode).toBe(401);
  }

  // Prepara los objetos simulados de Express.
  function preparar(authorization?: string) {
    const req = {
      headers: authorization ? { authorization } : {},
    } as AuthenticatedRequest;

    const res = {} as Response;
    const next = vi.fn() as unknown as NextFunction;

    return { req, res, next };
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rechaza solicitudes sin token con error 401', async () => {
    const { req, res, next } = preparar();

    await authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();

    const error = vi.mocked(next).mock.calls[0][0];

    verificarError401(error);

    expect(getUserMock).not.toHaveBeenCalled();
  });

  it('rechaza un encabezado de autenticación malformado', async () => {
    const { req, res, next } = preparar('Token incorrecto');

    await authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();

    const error = vi.mocked(next).mock.calls[0][0];

    verificarError401(error);

    expect(getUserMock).not.toHaveBeenCalled();
  });

  it('rechaza un token inválido', async () => {
    getUserMock.mockResolvedValueOnce({
      data: {
        user: null,
      },
      error: {
        message: 'Invalid JWT',
      },
    } as Awaited<ReturnType<typeof supabase.auth.getUser>>);

    const { req, res, next } = preparar('Bearer token-invalido');

    await authMiddleware(req, res, next);

    expect(getUserMock).toHaveBeenCalledWith('token-invalido');
    expect(next).toHaveBeenCalledOnce();

    const error = vi.mocked(next).mock.calls[0][0];

    verificarError401(error);
  });

  it('rechaza un token expirado', async () => {
    getUserMock.mockResolvedValueOnce({
      data: {
        user: null,
      },
      error: {
        message: 'JWT expired',
      },
    } as Awaited<ReturnType<typeof supabase.auth.getUser>>);

    const { req, res, next } = preparar('Bearer token-expirado');

    await authMiddleware(req, res, next);

    expect(getUserMock).toHaveBeenCalledWith('token-expirado');
    expect(next).toHaveBeenCalledOnce();

    const error = vi.mocked(next).mock.calls[0][0];

    verificarError401(error);
  });

  it('inyecta los datos del usuario cuando el token es válido', async () => {
    getUserMock.mockResolvedValueOnce({
      data: {
        user: {
          id: 'usuario-123',
          email: 'usuario@finzo.com',
        },
      },
      error: null,
    } as Awaited<ReturnType<typeof supabase.auth.getUser>>);

    const { req, res, next } = preparar('Bearer token-valido');

    await authMiddleware(req, res, next);

    expect(getUserMock).toHaveBeenCalledWith('token-valido');

    expect(req.user).toEqual({
      id: 'usuario-123',
      email: 'usuario@finzo.com',
    });

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith();
  });
});
