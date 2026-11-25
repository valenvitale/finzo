import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  crearMovimientoSchema,
  actualizarMovimientoSchema,
} from '../../src/validation/movimiento.schema.js';

describe('Validación de fechas de movimientos', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-25T01:30:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const datosValidos = {
    monto: 1500,
    descripcion: 'Supermercado',
    monedaId: '22222222-2222-4222-8222-222222222222',
    categoriaId: '33333333-3333-4333-8333-333333333333',
    medioPagoId: '44444444-4444-4444-8444-444444444444',
  };

  it('permite crear movimientos con fechas anteriores', () => {
    const resultado = crearMovimientoSchema.safeParse({
      ...datosValidos,
      fecha: '2026-11-23',
    });

    expect(resultado.success).toBe(true);
  });

  it('permite crear movimientos con la fecha actual', () => {
    const resultado = crearMovimientoSchema.safeParse({
      ...datosValidos,
      fecha: '2026-11-24',
    });

    expect(resultado.success).toBe(true);
  });

  it('rechaza la creación de movimientos con fechas futuras', () => {
    const resultado = crearMovimientoSchema.safeParse({
      ...datosValidos,
      fecha: '2026-11-25',
    });

    expect(resultado.success).toBe(false);
  });

  it('rechaza la actualización con una fecha futura', () => {
    const resultado = actualizarMovimientoSchema.safeParse({
      fecha: '2026-11-25',
    });

    expect(resultado.success).toBe(false);
  });

  it('permite actualizar con la fecha actual', () => {
    const resultado = actualizarMovimientoSchema.safeParse({
      fecha: '2026-11-24',
    });

    expect(resultado.success).toBe(true);
  });

  it('permite actualizar otros campos sin enviar una fecha', () => {
    const resultado = actualizarMovimientoSchema.safeParse({
      monto: 2000,
    });

    expect(resultado.success).toBe(true);
  });
});