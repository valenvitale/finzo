import { describe, expect, it } from 'vitest';
import { actualizarCategoriaSchema, crearCategoriaSchema } from '../../src/validation/categoria.schema.js';
import { actualizarPerfilSchema, crearPerfilSchema } from '../../src/validation/perfil.schema.js';
import {
  asignarMonedaSchema,
  actualizarMonedaSchema,
  crearMonedaSchema,
} from '../../src/validation/moneda.schema.js';
import { actualizarMedioPagoSchema, crearMedioPagoSchema } from '../../src/validation/medio-pago.schema.js';
import {
  crearMovimientoSchema,
  actualizarMovimientoSchema,
  movimientoIdParamsSchema,
} from '../../src/validation/movimiento.schema.js';

describe('Schemas del sistema', () => {
  it('valida categorías según los límites del modelo', () => {
    expect(crearCategoriaSchema.safeParse({ nombre: ' Hogar ', color: '#aBc123', tipo: 'GASTO' }).success).toBe(true);
    expect(crearCategoriaSchema.safeParse({ nombre: 'Hogar', color: 'rojo', tipo: 'GASTO' }).success).toBe(false);
    expect(
      crearCategoriaSchema.safeParse({ nombre: 'Hogar', color: '#A1B2C3', tipo: 'GASTO', extra: true }).success
    ).toBe(false);
    expect(actualizarCategoriaSchema.safeParse({ color: '#A1B2C3' }).success).toBe(true);
  });

  it('valida perfiles y permite quitar la foto de perfil', () => {
    expect(crearPerfilSchema.safeParse({ nombre: 'Máximo', apellido: 'Messina' }).success).toBe(true);
    expect(actualizarPerfilSchema.safeParse({ foto_perfil: null }).success).toBe(true);
    expect(crearPerfilSchema.safeParse({ nombre: 'Máximo', apellido: '' }).success).toBe(false);
    expect(
      actualizarPerfilSchema.safeParse({
        email: 'maximo@example.com',
        currentPassword: 'actual',
        newPassword: 'contraseña-segura',
      }).success
    ).toBe(true);
    expect(actualizarPerfilSchema.safeParse({ email: 'maximo@example.com' }).success).toBe(false);
    expect(actualizarPerfilSchema.safeParse({ currentPassword: 'actual' }).success).toBe(false);
    expect(actualizarPerfilSchema.safeParse({}).success).toBe(false);
  });

  it('valida monedas con código ISO de tres letras mayúsculas', () => {
    expect(crearMonedaSchema.safeParse({ nombre: 'Peso', codigo: 'ARS', simbolo: '$' }).success).toBe(true);
    expect(crearMonedaSchema.safeParse({ nombre: 'Peso', codigo: 'ars', simbolo: '$' }).success).toBe(false);
    expect(actualizarMonedaSchema.safeParse({ simbolo: '$' }).success).toBe(true);
    expect(asignarMonedaSchema.safeParse({ monedaId: '123e4567-e89b-12d3-a456-426614174000' }).success).toBe(true);
    expect(asignarMonedaSchema.safeParse({ monedaId: 'no-es-un-uuid' }).success).toBe(false);
    expect(
      asignarMonedaSchema.safeParse({ monedaId: '123e4567-e89b-12d3-a456-426614174000', extra: true }).success
    ).toBe(false);
  });

  it('valida medios de pago según los límites del modelo', () => {
    expect(crearMedioPagoSchema.safeParse({ nombre: 'Tarjeta', icono: 'credit-card' }).success).toBe(true);
    expect(crearMedioPagoSchema.safeParse({ nombre: '', icono: 'cash' }).success).toBe(false);
    expect(actualizarMedioPagoSchema.safeParse({ icono: 'cash' }).success).toBe(true);
  });

  it('valida movimientos y su parámetro id', () => {
    expect(movimientoIdParamsSchema.safeParse({ id: '123e4567-e89b-12d3-a456-426614174000' }).success).toBe(true);
    expect(movimientoIdParamsSchema.safeParse({ id: 'id-invalido' }).success).toBe(false);
    expect(
      crearMovimientoSchema.safeParse({
        fecha: '2026-10-12',
        monto: 1500,
        monedaId: '123e4567-e89b-12d3-a456-426614174000',
        categoriaId: '123e4567-e89b-12d3-a456-426614174001',
        medioPagoId: '123e4567-e89b-12d3-a456-426614174002',
      }).success
    ).toBe(true);
    expect(
      crearMovimientoSchema.safeParse({
        fecha: 'fecha-invalida',
        monto: -50,
        monedaId: 'invalido',
        categoriaId: 'invalido',
        medioPagoId: 'invalido',
      }).success
    ).toBe(false);
    expect(actualizarMovimientoSchema.safeParse({}).success).toBe(false);
    expect(actualizarMovimientoSchema.safeParse({ monto: 200 }).success).toBe(true);
  });
});
