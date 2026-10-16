/**
 * Tests de integración
 * Pruebas HTTP con Supertest validando status 200, 201, 400 y 401.
 */

import request from 'supertest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from '../../src/app.js';

// ----------- Declaración de mocks --------------------

// Mocks de funciones espia de repositorios y autenticación
const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  crearMovimiento: vi.fn(),
  listarMovimientos: vi.fn(),
  obtenerMovimientoPorId: vi.fn(),
  actualizarMovimiento: vi.fn(),
  eliminarMovimiento: vi.fn(),
  obtenerCategoriaPorId: vi.fn(),
  obtenerMedioPagoPorId: vi.fn(),
}));

// Mock de autenticación (Supabase)
vi.mock('../../src/config/supabase.js', () => ({
  supabase: { auth: { getUser: mocks.getUser } },
  supabasePublic: { auth: { getUser: mocks.getUser } },
}));

// Mock de repositorios
vi.mock('../../src/repositories/movimiento.repository.js', () => ({
  MovimientoRepository: class {
    crear = mocks.crearMovimiento;
    listarPorPerfil = mocks.listarMovimientos;
    obtenerPorId = mocks.obtenerMovimientoPorId;
    actualizar = mocks.actualizarMovimiento;
    eliminar = mocks.eliminarMovimiento;
  },
}));

vi.mock('../../src/repositories/categoria.repository.js', () => ({
  CategoriaRepository: class {
    obtenerPorId = mocks.obtenerCategoriaPorId;
  },
}));

vi.mock('../../src/repositories/medio-pago.repository.js', () => ({
  MedioPagoRepository: class {
    obtenerPorId = mocks.obtenerMedioPagoPorId;
  },
}));

// ------------------------------------------------------

const perfilId = '11111111-1111-4111-8111-111111111111';
const monedaId = '22222222-2222-4222-8222-222222222222';
const categoriaId = '33333333-3333-4333-8333-333333333333';
const medioPagoId = '44444444-4444-4444-8444-444444444444';
const movimientoId = '55555555-5555-4555-8555-555555555555';
const fecha = new Date('2026-10-16T12:00:00.000Z');

const movimientoSimulado = {
  id: movimientoId,
  fecha,
  monto: 1500,
  descripcion: 'Supermercado semanal',
  perfilId,
  monedaId,
  categoriaId,
  medioPagoId,
  tipo: 'GASTO' as const,
  createdAt: fecha,
  updatedAt: fecha,
};

// Al responder con JSON en HTTP, los objetos Date se serializan a formato ISO en string
const movimientoRespuesta = {
  ...movimientoSimulado,
  fecha: fecha.toISOString(),
  createdAt: fecha.toISOString(),
  updatedAt: fecha.toISOString(),
};

beforeEach(() => {
  vi.resetAllMocks();

  // Simular sesión de usuario autenticado
  mocks.getUser.mockResolvedValue({
    data: {
      user: {
        id: perfilId,
        email: 'usuario@example.com',
      },
    },
    error: null,
  });

  // Validaciones del servicio de movimientos (categoría y medio de pago que pertenecen al perfil)
  mocks.obtenerCategoriaPorId.mockResolvedValue({
    id: categoriaId,
    perfilId,
    nombre: 'Supermercado',
  });

  mocks.obtenerMedioPagoPorId.mockResolvedValue({
    id: medioPagoId,
    id_perfil: perfilId,
    nombre: 'Efectivo',
  });
});

describe('GET /api/movimientos (Status 200 y 401)', () => {
  it('devuelve 200 con la lista de movimientos del perfil autenticado', async () => {
    // Arrange (Preparación)
    mocks.listarMovimientos.mockResolvedValue([movimientoSimulado]);

    // Act (Envío de la petición)
    const respuesta = await request(app).get('/api/movimientos').set('Authorization', 'Bearer token-valido');

    // Assert (Aserciones)
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({
      exito: true,
      datos: [movimientoRespuesta],
    });
    expect(mocks.getUser).toHaveBeenCalledWith('token-valido');
    expect(mocks.listarMovimientos).toHaveBeenCalledWith(perfilId, {});
  });

  it('devuelve 401 cuando no se envía el header Authorization', async () => {
    // Arrange (Preparación)
    // No enviamos header de Authorization

    // Act (Envío de la petición)
    const respuesta = await request(app).get('/api/movimientos');

    // Assert (Aserciones)
    expect(respuesta.status).toBe(401);
    expect(respuesta.body).toEqual({
      exito: false,
      mensaje: 'Token de autenticación ausente',
      errores: [],
    });
    expect(mocks.getUser).not.toHaveBeenCalled();
    expect(mocks.listarMovimientos).not.toHaveBeenCalled();
  });
});

describe('POST /api/movimientos (Status 201 y 400)', () => {
  it('devuelve 201 al crear un movimiento con datos válidos', async () => {
    // Arrange (Preparación)
    const datosNuevoMovimiento = {
      fecha: '2026-10-16T12:00:00.000Z',
      monto: 1500,
      descripcion: 'Supermercado semanal',
      monedaId,
      categoriaId,
      medioPagoId,
    };

    mocks.crearMovimiento.mockResolvedValue(movimientoSimulado);

    // Act (Envío de la petición)
    const respuesta = await request(app)
      .post('/api/movimientos')
      .set('Authorization', 'Bearer token-valido')
      .send(datosNuevoMovimiento);

    // Assert (Aserciones)
    expect(respuesta.status).toBe(201);
    expect(respuesta.body).toEqual({
      exito: true,
      datos: movimientoRespuesta,
    });
    expect(mocks.crearMovimiento).toHaveBeenCalledWith(
      perfilId,
      expect.objectContaining({
        monto: 1500,
        descripcion: 'Supermercado semanal',
        monedaId,
        categoriaId,
        medioPagoId,
      })
    );
  });

  it('devuelve 400 si el cuerpo contiene datos inválidos', async () => {
    // Arrange (Preparación): monto negativo y UUIDs inválidos para disparar error de Zod
    const datosInvalidos = {
      monto: -500,
      monedaId: 'id-no-valido',
    };

    // Act (Envío de la petición)
    const respuesta = await request(app)
      .post('/api/movimientos')
      .set('Authorization', 'Bearer token-valido')
      .send(datosInvalidos);

    // Assert (Aserciones)
    expect(respuesta.status).toBe(400);
    expect(respuesta.body.exito).toBe(false);
    expect(respuesta.body.errores).toEqual(expect.arrayContaining([expect.stringContaining('monto:')]));
    expect(mocks.crearMovimiento).not.toHaveBeenCalled();
  });
});
