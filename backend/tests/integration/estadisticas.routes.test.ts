import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

// Simulamos Supabase y el repositorio de estadísticas.
const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  obtenerMovimientos: vi.fn(),
  obtenerTotalesPorCategoria: vi.fn(),
  obtenerTotalesMensuales: vi.fn(),
}));

vi.mock('../../src/config/supabase.js', () => ({
  supabase: {
    auth: {
      getUser: mocks.getUser,
    },
  },
  supabasePublic: {
    auth: {
      getUser: mocks.getUser,
    },
  },
}));

vi.mock('../../src/repositories/estadisticas.repository.js', () => ({
  EstadisticasRepository: class {
    obtenerMovimientos = mocks.obtenerMovimientos;
    obtenerTotalesPorCategoria = mocks.obtenerTotalesPorCategoria;
    obtenerTotalesMensuales = mocks.obtenerTotalesMensuales;
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

  mocks.obtenerMovimientos.mockResolvedValue([
    {
      monto: 100000,
      fecha: new Date('2026-11-05T12:00:00Z'),
      tipo: 'INGRESO',
      categoriaId: 'sueldo',
      categoriaNombre: 'Sueldo',
      monedaId,
      codigoMoneda: 'ARS',
    },
    {
      monto: 30000,
      fecha: new Date('2026-11-07T12:00:00Z'),
      tipo: 'GASTO',
      categoriaId: 'comida',
      categoriaNombre: 'Comida',
      monedaId,
      codigoMoneda: 'ARS',
    },
  ]);

  mocks.obtenerTotalesPorCategoria.mockResolvedValue([
    {
      categoriaId: 'comida',
      monedaId,
      total: 30000,
    },
  ]);

  mocks.obtenerTotalesMensuales.mockResolvedValue([
    {
      monedaId,
      mes: '2026-11',
      tipo: 'INGRESO',
      total: 100000,
    },
    {
      monedaId,
      mes: '2026-11',
      tipo: 'GASTO',
      total: 30000,
    },
  ]);
});

describe('GET /api/estadisticas', () => {
  it('devuelve 200 con las estadísticas financieras', async () => {
    const respuesta = await request(app)
      .get('/api/estadisticas')
      .set('Authorization', 'Bearer token-valido');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.exito).toBe(true);

    expect(respuesta.body.datos).toEqual({
      estadisticasPorMoneda: [
        {
          monedaId,
          codigoMoneda: 'ARS',
          gastosPorCategoria: [
            {
              categoriaId: 'comida',
              categoriaNombre: 'Comida',
              total: 30000,
              porcentaje: 100,
            },
          ],
          evolucionMensual: [
            {
              mes: '2026-11',
              ingresos: 100000,
              gastos: 30000,
              tasaAhorro: 70,
            },
          ],
          promedioGastoDiario: 10000,
          tasaAhorro: 70,
        },
      ],
    });

    expect(mocks.obtenerMovimientos).toHaveBeenCalledWith(
      perfilId,
      {}
    );
  });

  it('devuelve 401 cuando no hay token', async () => {
    const respuesta = await request(app)
      .get('/api/estadisticas');

    expect(respuesta.status).toBe(401);

    expect(respuesta.body).toEqual({
      exito: false,
      mensaje: 'Token de autenticación ausente',
      errores: [],
    });

    expect(mocks.getUser).not.toHaveBeenCalled();
    expect(mocks.obtenerMovimientos).not.toHaveBeenCalled();
  });

  it('devuelve 401 cuando el token es inválido', async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: null },
      error: new Error('Token inválido'),
    });

    const respuesta = await request(app)
      .get('/api/estadisticas')
      .set('Authorization', 'Bearer token-invalido');

    expect(respuesta.status).toBe(401);
    expect(mocks.obtenerMovimientos).not.toHaveBeenCalled();
  });

  it('valida y transforma los filtros de fechas', async () => {
    const respuesta = await request(app)
      .get(
        '/api/estadisticas?fechaDesde=2026-11-01&fechaHasta=2026-11-30'
      )
      .set('Authorization', 'Bearer token-valido');

    expect(respuesta.status).toBe(200);

    expect(mocks.obtenerMovimientos).toHaveBeenCalledWith(
      perfilId,
      {
        fechaDesde: new Date('2026-11-01T00:00:00.000Z'),
        fechaHasta: new Date('2026-11-30T23:59:59.999Z'),
      }
    );
  });

  it('rechaza fechas inexistentes', async () => {
    const respuesta = await request(app)
      .get('/api/estadisticas?fechaDesde=2026-02-30')
      .set('Authorization', 'Bearer token-valido');

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.exito).toBe(false);

    expect(mocks.obtenerMovimientos).not.toHaveBeenCalled();
  });

  it('rechaza fechas en orden incorrecto', async () => {
    const respuesta = await request(app)
      .get(
        '/api/estadisticas?fechaDesde=2026-12-01&fechaHasta=2026-11-01'
      )
      .set('Authorization', 'Bearer token-valido');

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.exito).toBe(false);

    expect(mocks.obtenerMovimientos).not.toHaveBeenCalled();
  });

  it('rechaza parámetros adicionales', async () => {
    const respuesta = await request(app)
      .get('/api/estadisticas?otro=123')
      .set('Authorization', 'Bearer token-valido');

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.exito).toBe(false);

    expect(mocks.obtenerMovimientos).not.toHaveBeenCalled();
  });

  it('devuelve estadísticas vacías cuando no hay movimientos', async () => {
    mocks.obtenerMovimientos.mockResolvedValue([]);
    mocks.obtenerTotalesPorCategoria.mockResolvedValue([]);
    mocks.obtenerTotalesMensuales.mockResolvedValue([]);

    const respuesta = await request(app)
      .get('/api/estadisticas')
      .set('Authorization', 'Bearer token-valido');

    expect(respuesta.status).toBe(200);

    expect(respuesta.body).toEqual({
      exito: true,
      datos: {
        estadisticasPorMoneda: [],
      },
    });
  });
});
