import { describe, expect, it } from 'vitest';
import {
  actualizarPresupuestoSchema,
  crearPresupuestoSchema,
  listarPresupuestosQuerySchema,
  presupuestoIdParamsSchema,
} from '../../src/validation/presupuesto.schema.js';

describe('schemas de presupuestos', () => {
  const categoriaId = '123e4567-e89b-12d3-a456-426614174000';

  it('valida límites mensuales y rechaza campos adicionales', () => {
    expect(
      crearPresupuestoSchema.safeParse({
        categoriaId,
        limiteMensual: 1200.5,
        mes: 11,
        anio: 2026,
      }).success
    ).toBe(true);
    expect(
      crearPresupuestoSchema.safeParse({
        categoriaId,
        limiteMensual: 1200.555,
        mes: 11,
        anio: 2026,
      }).success
    ).toBe(false);
    expect(
      crearPresupuestoSchema.safeParse({
        categoriaId,
        limiteMensual: 0,
        mes: 11,
        anio: 2026,
      }).success
    ).toBe(false);
    expect(actualizarPresupuestoSchema.safeParse({ limiteMensual: -1 }).success).toBe(false);
  });

  it('valida el período opcional y el identificador de ruta', () => {
    expect(listarPresupuestosQuerySchema.safeParse({ mes: '11', anio: '2026' }).success).toBe(true);
    expect(listarPresupuestosQuerySchema.safeParse({ mes: '1', anio: '2030' }).success).toBe(true);
    expect(listarPresupuestosQuerySchema.safeParse({ mes: '13', anio: '2026' }).success).toBe(false);
    expect(listarPresupuestosQuerySchema.safeParse({ inesperado: '1' }).success).toBe(false);
    expect(presupuestoIdParamsSchema.safeParse({ id: categoriaId }).success).toBe(true);
    expect(presupuestoIdParamsSchema.safeParse({ id: 'no-es-uuid' }).success).toBe(false);
  });
});
