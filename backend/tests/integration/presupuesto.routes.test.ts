import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  findCategory: vi.fn(),
  findPrincipal: vi.fn(),
  findMany: vi.fn(),
  groupBy: vi.fn(),
  aggregate: vi.fn(),
  findMeta: vi.fn(),
  upsertMeta: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  deleteBudget: vi.fn(),
  findBudget: vi.fn(),
}));

vi.mock('../../src/config/supabase.js', () => ({
  supabase: { auth: { getUser: mocks.getUser } },
  supabasePublic: { auth: { getUser: mocks.getUser } },
}));

vi.mock('../../src/config/prisma.js', () => ({
  prisma: {
    categoria: { findUnique: mocks.findCategory },
    perfilMoneda: { findFirst: mocks.findPrincipal },
    movimiento: { groupBy: mocks.groupBy, aggregate: mocks.aggregate },
    metaAhorro: { findUnique: mocks.findMeta, upsert: mocks.upsertMeta },
    presupuesto: {
      findMany: mocks.findMany,
      create: mocks.create,
      update: mocks.update,
      delete: mocks.deleteBudget,
      findFirst: mocks.findBudget,
    },
  },
}));

const perfilId = '11111111-1111-4111-8111-111111111111';
const categoriaId = '22222222-2222-4222-8222-222222222222';
const presupuestoId = '33333333-3333-4333-8333-333333333333';
const monedaId = '44444444-4444-4444-8444-444444444444';
const fecha = new Date('2026-05-01T00:00:00.000Z');
const decimal = (valor: number) => ({ toNumber: () => valor });
const categoria = {
  id: categoriaId,
  nombre: 'Comida',
  color: '#A1B2C3',
  tipo: 'GASTO',
  id_perfil: null,
  created_at: fecha,
  updated_at: fecha,
};

function crearPresupuesto(limite: number) {
  return {
    id: presupuestoId,
    id_perfil: perfilId,
    id_categoria: categoriaId,
    id_moneda: '44444444-4444-4444-8444-444444444444',
    limite_mensual: decimal(limite),
    mes: 5,
    anio: 2026,
    created_at: fecha,
    updated_at: fecha,
    categoria,
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.getUser.mockResolvedValue({
    data: { user: { id: perfilId, email: 'usuario@example.com' } },
    error: null,
  });
  mocks.findCategory.mockResolvedValue(categoria);
  mocks.findPrincipal.mockResolvedValue({
    moneda: { id: '44444444-4444-4444-8444-444444444444', codigo: 'ARS', simbolo: '$' },
  });
  mocks.findMany.mockResolvedValue([crearPresupuesto(10000)]);
  mocks.groupBy.mockResolvedValue([{ id_categoria: categoriaId, _sum: { monto: decimal(7500) } }]);
  mocks.aggregate.mockResolvedValue({ _sum: { monto: null } });
  mocks.findMeta.mockResolvedValue(null);
  mocks.upsertMeta.mockResolvedValue({});
});

describe('/api/presupuestos', () => {
  it('requiere autenticación', async () => {
    const respuesta = await request(app).get('/api/presupuestos?mes=5&anio=2026');

    expect(respuesta.status).toBe(401);
    expect(mocks.findPrincipal).not.toHaveBeenCalled();
  });

  it('devuelve los límites y el gasto agregado para el período y moneda principal', async () => {
    const respuesta = await request(app)
      .get('/api/presupuestos?mes=5&anio=2026')
      .set('Authorization', 'Bearer token-valido');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.datos).toMatchObject({
      mes: 5,
      anio: 2026,
      moneda: { id: monedaId, codigo: 'ARS', simbolo: '$' },
      totalLimiteMensual: 10000,
      totalGastado: 7500,
      totalDisponible: 2500,
      porcentajeUsado: 75,
    });
    expect(mocks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id_perfil: perfilId, id_moneda: '44444444-4444-4444-8444-444444444444', mes: 5, anio: 2026 },
      })
    );
    expect(mocks.groupBy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id_perfil: perfilId, id_moneda: '44444444-4444-4444-8444-444444444444' }),
      })
    );
  });

  it('valida la categoría y persiste un presupuesto', async () => {
    mocks.create.mockResolvedValue(crearPresupuesto(8000));
    mocks.findMany.mockResolvedValue([crearPresupuesto(8000)]);

    const respuesta = await request(app)
      .post('/api/presupuestos')
      .set('Authorization', 'Bearer token-valido')
      .send({ categoriaId, monedaId, limiteMensual: 8000, mes: 5, anio: 2026 });

    expect(respuesta.status).toBe(201);
    expect(respuesta.body.datos).toMatchObject({
      categoriaId,
      limiteMensual: 8000,
      gastoActual: 7500,
      porcentajeUsado: 93.75,
    });
    expect(mocks.create).toHaveBeenCalledWith({
      data: {
        id_perfil: perfilId,
        id_categoria: categoriaId,
        id_moneda: '44444444-4444-4444-8444-444444444444',
        limite_mensual: 8000,
        mes: 5,
        anio: 2026,
      },
      include: { categoria: true },
    });
  });

  it('rechaza importes inferiores a un centavo antes de persistir', async () => {
    const importe = 0.000000001;
    const alta = await request(app)
      .post('/api/presupuestos')
      .set('Authorization', 'Bearer token-valido')
      .send({ categoriaId, monedaId, limiteMensual: importe, mes: 5, anio: 2026 });
    const edicion = await request(app)
      .patch(`/api/presupuestos/${presupuestoId}`)
      .set('Authorization', 'Bearer token-valido')
      .send({ limiteMensual: importe });
    const meta = await request(app)
      .put('/api/presupuestos/meta')
      .set('Authorization', 'Bearer token-valido')
      .send({ monedaId, monto: importe, mes: 5, anio: 2026 });

    expect([alta.status, edicion.status, meta.status]).toEqual([400, 400, 400]);
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.update).not.toHaveBeenCalled();
    expect(mocks.upsertMeta).not.toHaveBeenCalled();
  });

  it('rechaza categorías de ingreso antes de persistir', async () => {
    mocks.findCategory.mockResolvedValue({ ...categoria, tipo: 'INGRESO' });

    const respuesta = await request(app)
      .post('/api/presupuestos')
      .set('Authorization', 'Bearer token-valido')
      .send({ categoriaId, monedaId, limiteMensual: 8000, mes: 5, anio: 2026 });

    expect(respuesta.status).toBe(409);
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it('guarda una meta mensual vinculada al perfil y la moneda', async () => {
    const respuesta = await request(app)
      .put('/api/presupuestos/meta')
      .set('Authorization', 'Bearer token-valido')
      .send({ monedaId, monto: 5000, mes: 5, anio: 2026 });

    expect(respuesta.status).toBe(204);
    expect(mocks.upsertMeta).toHaveBeenCalledWith({
      where: {
        id_perfil_id_moneda_mes_anio: {
          id_perfil: perfilId,
          id_moneda: '44444444-4444-4444-8444-444444444444',
          mes: 5,
          anio: 2026,
        },
      },
      create: {
        id_perfil: perfilId,
        id_moneda: '44444444-4444-4444-8444-444444444444',
        mes: 5,
        anio: 2026,
        monto: 5000,
      },
      update: { monto: 5000 },
    });
  });

  it('rechaza una meta inválida o sin autenticación', async () => {
    const sinToken = await request(app)
      .put('/api/presupuestos/meta')
      .send({ monedaId, monto: 5000, mes: 5, anio: 2026 });
    const invalida = await request(app)
      .put('/api/presupuestos/meta')
      .set('Authorization', 'Bearer token-valido')
      .send({ monedaId, monto: 0, mes: 5, anio: 2026 });

    expect(sinToken.status).toBe(401);
    expect(invalida.status).toBe(400);
    expect(mocks.upsertMeta).not.toHaveBeenCalled();
  });
});
