import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

// Se simulan los servicios externos; las rutas, middlewares, controller,
// service y repository se ejecutan con sus implementaciones reales.
const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  findMany: vi.fn(),
  count: vi.fn(),
  create: vi.fn(),
}));

vi.mock('../../src/config/supabase.js', () => ({
  supabase: { auth: { getUser: mocks.getUser } },
  supabasePublic: { auth: { getUser: mocks.getUser } },
}));

vi.mock('../../src/config/prisma.js', () => ({
  prisma: {
    categoria: {
      findMany: mocks.findMany,
      count: mocks.count,
      create: mocks.create,
    },
  },
}));

const perfilId = '11111111-1111-4111-8111-111111111111';
const fecha = new Date('2026-10-14T12:00:00Z');
const categoria = {
  id: '22222222-2222-4222-8222-222222222222',
  nombre: 'Supermercado',
  color: '#FF5733',
  tipo: 'GASTO',
  id_perfil: perfilId,
  created_at: fecha,
  updated_at: fecha,
};
const categoriaRespuesta = {
  id: categoria.id,
  nombre: categoria.nombre,
  color: categoria.color,
  tipo: categoria.tipo,
  perfilId,
  createdAt: fecha.toISOString(),
  updatedAt: fecha.toISOString(),
};

beforeEach(() => {
  vi.resetAllMocks();
  mocks.getUser.mockResolvedValue({
    data: { user: { id: perfilId, email: 'usuario@example.com' } },
    error: null,
  });
  mocks.findMany.mockResolvedValue([categoria]);
  mocks.count.mockResolvedValue(0);
  mocks.create.mockResolvedValue(categoria);
});

describe('GET /api/categorias', () => {
  it('devuelve 200 con las categorías del perfil autenticado', async () => {
    const respuesta = await request(app).get('/api/categorias').set('Authorization', 'Bearer token-valido');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({ exito: true, datos: [categoriaRespuesta] });
    expect(mocks.getUser).toHaveBeenCalledWith('token-valido');
    expect(mocks.findMany).toHaveBeenCalledWith({
      where: { OR: [{ id_perfil: null }, { id_perfil: perfilId }] },
      orderBy: [{ nombre: 'asc' }, { id: 'asc' }],
    });
  });

  it('devuelve 401 si no hay token', async () => {
    const respuesta = await request(app).get('/api/categorias');

    expect(respuesta.status).toBe(401);
    expect(respuesta.body).toEqual({
      exito: false,
      mensaje: 'Token de autenticación ausente',
      errores: [],
    });
    expect(mocks.getUser).not.toHaveBeenCalled();
    expect(mocks.findMany).not.toHaveBeenCalled();
  });
});

describe('POST /api/categorias', () => {
  it('devuelve 201 al crear una categoría con datos válidos', async () => {
    const datos = { nombre: 'Supermercado', color: '#FF5733', tipo: 'GASTO' };
    const respuesta = await request(app)
      .post('/api/categorias')
      .set('Authorization', 'Bearer token-valido')
      .send(datos);

    expect(respuesta.status).toBe(201);
    expect(respuesta.body).toEqual({ exito: true, datos: categoriaRespuesta });
    expect(mocks.count).toHaveBeenCalledWith({ where: { id_perfil: perfilId } });
    expect(mocks.create).toHaveBeenCalledWith({
      data: { id_perfil: perfilId, ...datos },
    });
  });

  it('devuelve 400 si el cuerpo contiene datos inválidos', async () => {
    const respuesta = await request(app)
      .post('/api/categorias')
      .set('Authorization', 'Bearer token-valido')
      .send({ nombre: '', color: 'rojo', tipo: 'OTRO' });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toEqual({
      exito: false,
      mensaje: 'Los datos enviados no son válidos',
      errores: expect.arrayContaining([
        expect.stringContaining('nombre:'),
        expect.stringContaining('color:'),
        expect.stringContaining('tipo:'),
      ]),
    });
    expect(mocks.count).not.toHaveBeenCalled();
    expect(mocks.create).not.toHaveBeenCalled();
  });
});
