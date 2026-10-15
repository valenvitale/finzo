
import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

// Simulamos la autenticación y los repositorios.
const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  listarMonedas: vi.fn(),
  listarMovimientos: vi.fn(),
}));

vi.mock('../../src/config/supabase.js', () => ({
  supabase: { auth: { getUser: mocks.getUser } },
  supabasePublic: { auth: { getUser: mocks.getUser } },
}));

// Simulamos los métodos de los repositorios.
// El controlador, el servicio y los middlewares siguen siendo reales.
vi.mock('../../src/repositories/moneda.repository.js', () => ({
  MonedaRepository: class {
    listarPorPerfil = mocks.listarMonedas;
  },
}));

vi.mock('../../src/repositories/movimiento.repository.js', () => ({
  MovimientoRepository: class {
    listarPorPerfil = mocks.listarMovimientos;
  },
}));

const perfilId = '11111111-1111-4111-8111-111111111111';
const monedaId = '22222222-2222-4222-8222-222222222222';

beforeEach(() => {
  vi.resetAllMocks();

  mocks.getUser.mockResolvedValue({
    data: {
      user: {
        id: perfilId,
        email: 'usuario@example.com',
      },
    },
    error: null,
  });

  mocks.listarMonedas.mockResolvedValue([
    {
      id: monedaId,
      codigo: 'ARS',
      esPrincipal: true,
    },
  ]);

  mocks.listarMovimientos.mockResolvedValue([
    { tipo: 'INGRESO', monto: 1000 },
    { tipo: 'GASTO', monto: 300 },
  ]);
});

describe('GET /api/resumen', () => {
  it('devuelve 200 con el resumen financiero', async () => {
    const respuesta = await request(app)
      .get('/api/resumen?mes=10&anio=2026')
      .set('Authorization', 'Bearer token-valido');

    expect(respuesta.status).toBe(200);

    expect(respuesta.body).toEqual({
      exito: true,
      datos: {
        totalIngresos: 1000,
        totalGastos: 300,
        balance: 700,
        moneda: 'ARS',
      },
    });

    expect(mocks.listarMovimientos).toHaveBeenCalledWith(
      perfilId,
      {
        mes: 10,
        anio: 2026,
        monedaId,
      }
    );
  });

  it('devuelve 400 cuando el mes es inválido', async () => {
    const respuesta = await request(app)
      .get('/api/resumen?mes=18&anio=2026')
      .set('Authorization', 'Bearer token-valido');

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.exito).toBe(false);
    expect(respuesta.body.errores).toEqual(
      expect.arrayContaining([
        expect.stringContaining('mes:'),
      ])
    );

    expect(mocks.listarMonedas).not.toHaveBeenCalled();
    expect(mocks.listarMovimientos).not.toHaveBeenCalled();
  });

  it('devuelve 401 cuando no hay token', async () => {
    const respuesta = await request(app)
      .get('/api/resumen?mes=10&anio=2026');

    expect(respuesta.status).toBe(401);

    expect(respuesta.body).toEqual({
      exito: false,
      mensaje: 'Token de autenticación ausente',
      errores: [],
    });

    expect(mocks.getUser).not.toHaveBeenCalled();
    expect(mocks.listarMonedas).not.toHaveBeenCalled();
    expect(mocks.listarMovimientos).not.toHaveBeenCalled();
  });

  it('rechaza parámetros adicionales', async () => {
    const respuesta = await request(app)
      .get('/api/resumen?mes=10&otro=123')
      .set('Authorization', 'Bearer token-valido');

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.exito).toBe(false);

    expect(mocks.listarMovimientos).not.toHaveBeenCalled();
  });
});
