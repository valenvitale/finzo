/**
 * Tests de integración
 * Pruebas HTTP con Supertest validando status 200, 201, 400, 401 y 403.
 */

import request from 'supertest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from '../../src/app.js';

// ----------- Declaración de mocks --------------------

// Mocks de funciones espia de repositorios y autenticación
const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  crearMedioPago: vi.fn(),
  listarMediosPago: vi.fn(),
  obtenerMedioPagoPorId: vi.fn(),
  actualizarMedioPago: vi.fn(),
  eliminarMedioPago: vi.fn(),
}));

// Mock de autenticación (Supabase)
vi.mock('../../src/config/supabase.js', () => ({
  supabase: { auth: { getUser: mocks.getUser } },
  supabasePublic: { auth: { getUser: mocks.getUser } },
}));

// Mock de repositorios
vi.mock('../../src/repositories/medio-pago.repository.js', () => ({
  MedioPagoRepository: class {
    crear = mocks.crearMedioPago;
    listarPorPerfil = mocks.listarMediosPago;
    obtenerPorId = mocks.obtenerMedioPagoPorId;
    actualizar = mocks.actualizarMedioPago;
    eliminar = mocks.eliminarMedioPago;
  },
}));

const perfilId = '11111111-1111-4111-8111-111111111111';
describe('MedioPago routes', () => {
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
    });

    it('devuelve 200 al listar medios de pago', async () =>{
        mocks.listarMediosPago.mockResolvedValue([]);

        const respuesta = await request(app)
            .get('/api/medios-pago')
            .set('Authorization', 'Bearer token-valido');

        expect(respuesta.status).toBe(200);
        expect(mocks.listarMediosPago).toHaveBeenCalledWith(perfilId);
    });

    it('devuelve 201 al crear un medio de pago', async () => {
        const datos = {
            nombre: 'Tarjeta de Débito',
            icono: 'credit-card',
        };

        mocks.crearMedioPago.mockResolvedValue({
            id: '44444444-4444-4444-8444-444444444444',
            ...datos,
            id_perfil: perfilId,
            created_at: new Date('2026-10-12T10:00:00Z'),
            updated_at: new Date('2026-10-12T10:00:00Z'),
        });

        const respuesta = await request(app)
            .post('/api/medios-pago')
            .set('Authorization', 'Bearer token-valido')
            .send(datos);

        expect(respuesta.status).toBe(201);
        expect(mocks.crearMedioPago).toHaveBeenCalledWith(perfilId, datos);
    });

    it('devuelve 400 si los datos enviados son inválidos', async () => {
        const respuesta = await request(app)
            .post('/api/medios-pago')
            .set('Authorization', 'Bearer token-valido')
            .send({
            nombre: 123,
            icono: 'credit-card',
            });

        expect(respuesta.status).toBe(400);
        expect(mocks.crearMedioPago).not.toHaveBeenCalled();
    });

    it('devuelve 401 si no se envía un token', async () => {
        const respuesta = await request(app)
            .get('/api/medios-pago');

        expect(respuesta.status).toBe(401);
        expect(mocks.listarMediosPago).not.toHaveBeenCalled();
    });

    it('devuelve 403 al editar un medio de pago del sistema', async () => {
        const medioId = '44444444-4444-4444-8444-444444444444';

        mocks.obtenerMedioPagoPorId.mockResolvedValue({
            id: medioId,
            nombre: 'Efectivo',
            icono: 'banknote',
            id_perfil: null,
            created_at: new Date('2026-10-12T10:00:00Z'),
            updated_at: new Date('2026-10-12T10:00:00Z'),
        });

        const respuesta = await request(app)
            .patch(`/api/medios-pago/${medioId}`)
            .set('Authorization', 'Bearer token-valido')
            .send({ nombre: 'Otro nombre' });

        expect(respuesta.status).toBe(403);
        expect(mocks.actualizarMedioPago).not.toHaveBeenCalled();
    });

    it('devuelve 403 al eliminar un medio de pago del sistema', async () => {
        const medioId = '44444444-4444-4444-8444-444444444444';

        mocks.obtenerMedioPagoPorId.mockResolvedValue({
            id: medioId,
            nombre: 'Efectivo',
            icono: 'banknote',
            id_perfil: null,
            created_at: new Date('2026-10-12T10:00:00Z'),
            updated_at: new Date('2026-10-12T10:00:00Z'),
        });

        const respuesta = await request(app)
            .delete(`/api/medios-pago/${medioId}`)
            .set('Authorization', 'Bearer token-valido');

        expect(respuesta.status).toBe(403);
        expect(mocks.eliminarMedioPago).not.toHaveBeenCalled();
    });

    it('devuelve 400 al editar con un ID inválido', async () => {
        const respuesta = await request(app)
            .patch('/api/medios-pago/no-es-uuid')
            .set('Authorization', 'Bearer token-valido')
            .send({ nombre: 'Otro nombre' });

        expect(respuesta.status).toBe(400);
        expect(mocks.obtenerMedioPagoPorId).not.toHaveBeenCalled();
    });

    it('devuelve 400 al eliminar con un ID inválido', async () => {
        const respuesta = await request(app)
            .delete('/api/medios-pago/no-es-uuid')
            .set('Authorization', 'Bearer token-valido');

        expect(respuesta.status).toBe(400);
        expect(mocks.obtenerMedioPagoPorId).not.toHaveBeenCalled();
    });
});
