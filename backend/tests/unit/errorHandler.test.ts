import { once } from 'node:events';
import type { Server } from 'node:http';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import express from 'express';
import { errorHandler } from '../../src/middlewares/errorHandler.js';
import { AppError, ErrorDeValidacion, ErrorNoEncontrado } from '../../src/utils/errores.js';

const app = express();

app.get('/not-found', (_req, _res, next) => {
  next(new ErrorNoEncontrado('Movimiento no encontrado'));
});

app.get('/validation', (_req, _res, next) => {
  next(new ErrorDeValidacion('Datos inválidos', ['monto debe ser positivo']));
});

app.get('/unexpected', (_req, _res, next) => {
  next(new Error('Detalle interno'));
});

app.get('/non-operational', (_req, _res, next) => {
  next(new AppError('Detalle interno', 400, false));
});

app.use(errorHandler);

describe('Middleware global de errores', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    server = app.listen(0);
    await once(server, 'listening');
    const address = server.address();

    if (!address || typeof address === 'string') {
      throw new Error('No se pudo obtener el puerto del servidor de pruebas');
    }

    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  });

  it('responde el código y el payload unificado para errores de aplicación', async () => {
    const response = await fetch(`${baseUrl}/not-found`);

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      exito: false,
      mensaje: 'Movimiento no encontrado',
      errores: [],
    });
  });

  it('incluye el arreglo de errores de validación', async () => {
    const response = await fetch(`${baseUrl}/validation`);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      exito: false,
      mensaje: 'Datos inválidos',
      errores: ['monto debe ser positivo'],
    });
  });

  it('oculta el detalle de errores 500 en producción', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    try {
      const response = await fetch(`${baseUrl}/unexpected`);

      expect(response.status).toBe(500);
      await expect(response.json()).resolves.toEqual({
        exito: false,
        mensaje: 'Error interno del servidor',
        errores: [],
      });
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it('trata errores no operacionales como errores internos', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    try {
      const response = await fetch(`${baseUrl}/non-operational`);

      expect(response.status).toBe(500);
      await expect(response.json()).resolves.toEqual({
        exito: false,
        mensaje: 'Error interno del servidor',
        errores: [],
      });
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
