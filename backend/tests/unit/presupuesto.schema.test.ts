import { describe, expect, it } from 'vitest';
import {
  actualizarPresupuestoSchema,
  crearPresupuestoSchema,
  guardarMetaAhorroSchema,
  listarPresupuestosQuerySchema,
  presupuestoIdParamsSchema,
} from '../../src/validation/presupuesto.schema.js';

describe('schemas de presupuestos', () => {
  const categoriaId = '123e4567-e89b-12d3-a456-426614174000';

  it('valida límites mensuales y rechaza campos adicionales', () => {
    expect(
      crearPresupuestoSchema.safeParse({
        categoriaId,
        monedaId: categoriaId,
        limiteMensual: 1200.5,
        mes: 11,
        anio: 2026,
      }).success
    ).toBe(true);
    expect(
      crearPresupuestoSchema.safeParse({
        categoriaId,
        monedaId: categoriaId,
        limiteMensual: 1200.555,
        mes: 11,
        anio: 2026,
      }).success
    ).toBe(false);
    expect(
      crearPresupuestoSchema.safeParse({
        categoriaId,
        monedaId: categoriaId,
        limiteMensual: 0,
        mes: 11,
        anio: 2026,
      }).success
    ).toBe(false);
    expect(actualizarPresupuestoSchema.safeParse({ limiteMensual: -1 }).success).toBe(false);
  });

  it.each([
    [0.000000001, false],
    [0.01, true],
    [0.29, true],
    [0.290000001, false],
    [9_999_999_999.99, true],
  ])('valida el importe %s con precisión de centavos', (importe, valido) => {
    const datos = { monedaId: categoriaId, mes: 11, anio: 2026 };
    expect(crearPresupuestoSchema.safeParse({ ...datos, categoriaId, limiteMensual: importe }).success).toBe(valido);
    expect(actualizarPresupuestoSchema.safeParse({ limiteMensual: importe }).success).toBe(valido);
    expect(guardarMetaAhorroSchema.safeParse({ ...datos, monto: importe }).success).toBe(valido);
  });

  it('valida el período opcional y el identificador de ruta', () => {
    expect(listarPresupuestosQuerySchema.safeParse({ mes: '11', anio: '2026' }).success).toBe(true);
    expect(listarPresupuestosQuerySchema.safeParse({ mes: '1', anio: '2030' }).success).toBe(true);
    expect(listarPresupuestosQuerySchema.safeParse({ mes: '13', anio: '2026' }).success).toBe(false);
    expect(listarPresupuestosQuerySchema.safeParse({ inesperado: '1' }).success).toBe(false);
    expect(presupuestoIdParamsSchema.safeParse({ id: categoriaId }).success).toBe(true);
    expect(presupuestoIdParamsSchema.safeParse({ id: 'no-es-uuid' }).success).toBe(false);
  });

  it('requiere una meta positiva con precisión monetaria y período válido', () => {
    expect(
      guardarMetaAhorroSchema.safeParse({ monedaId: categoriaId, monto: 1200.5, mes: 11, anio: 2026 }).success
    ).toBe(true);
    expect(guardarMetaAhorroSchema.safeParse({ monedaId: categoriaId, monto: 0, mes: 11, anio: 2026 }).success).toBe(
      false
    );
    expect(
      guardarMetaAhorroSchema.safeParse({ monedaId: categoriaId, monto: 0.001, mes: 11, anio: 2026 }).success
    ).toBe(false);
    expect(guardarMetaAhorroSchema.safeParse({ monedaId: categoriaId, monto: 5, mes: 13, anio: 2026 }).success).toBe(
      false
    );
  });
});
