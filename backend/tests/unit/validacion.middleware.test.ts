import { once } from 'node:events';
import type { Server } from 'node:http';
import express from 'express';
import { z } from 'zod';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { errorHandler } from '../../src/middlewares/errorHandler.js';
import {
  validarCuerpo,
  validarParametros,
  validarQuery,
} from '../../src/middlewares/validacion.middleware.js';
import { crearCategoriaSchema } from '../../src/validation/categoria.schema.js';

const app = express();
const parametrosSchema = z.strictObject({ id: z.uuid('El identificador debe ser un UUID válido') });
const querySchema = z.strictObject({
  pagina: z.coerce.number().int().positive('La página debe ser un entero positivo'),
});

app.use(express.json());
app.post('/cuerpo', validarCuerpo(crearCategoriaSchema), (_req, res) => {
  res.json(_req.body);
});
app.get('/parametros/:id', validarParametros(parametrosSchema), (_req, res) => {
  res.sendStatus(204);
});
app.get('/query', validarQuery(querySchema), (req, res) => {
  res.json(req.query);
});
app.use(errorHandler);

describe('Middleware genérico de validación Zod', () => {
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

  it('valida el cuerpo y deja continuar cuando es válido', async () => {
    const response = await fetch(`${baseUrl}/cuerpo`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ nombre: ' Hogar ', color: '#aBc123', tipo: 'GASTO' }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ nombre: 'Hogar', color: '#aBc123', tipo: 'GASTO' });
  });

  it('convierte errores del cuerpo en ErrorDeValidacion', async () => {
    const response = await fetch(`${baseUrl}/cuerpo`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ nombre: '', color: 'rojo', tipo: 'OTRO' }),
    });

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.mensaje).toBe('Los datos enviados no son válidos');
    expect(payload.errores).toEqual(
      expect.arrayContaining([
        'nombre: El nombre es obligatorio',
        expect.stringContaining('color:'),
        'tipo: El tipo debe ser INGRESO o GASTO',
      ]),
    );
  });

  it('valida parámetros usando el schema recibido', async () => {
    const valido = await fetch(`${baseUrl}/parametros/123e4567-e89b-12d3-a456-426614174000`);
    const invalido = await fetch(`${baseUrl}/parametros/no-es-un-uuid`);

    expect(valido.status).toBe(204);
    expect(invalido.status).toBe(400);
  });

  it('valida query params usando el schema recibido', async () => {
    const valido = await fetch(`${baseUrl}/query?pagina=2`);
    const invalido = await fetch(`${baseUrl}/query?pagina=0`);

    expect(valido.status).toBe(200);
    expect(await valido.json()).toEqual({ pagina: 2 });
    expect(invalido.status).toBe(400);
    expect((await invalido.json()).mensaje).toBe('Los datos enviados no son válidos');
  });
});
