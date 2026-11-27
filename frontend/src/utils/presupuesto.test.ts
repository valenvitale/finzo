import { describe, expect, it } from 'vitest';
import { formatearMonto, obtenerEstadoPresupuesto } from './presupuesto';

describe('utilidades de presupuesto', () => {
  it('aplica los umbrales visuales de consumo del presupuesto', () => {
    expect(obtenerEstadoPresupuesto(74.99)).toBe('verde');
    expect(obtenerEstadoPresupuesto(75)).toBe('amarillo');
    expect(obtenerEstadoPresupuesto(90)).toBe('amarillo');
    expect(obtenerEstadoPresupuesto(90.01)).toBe('rojo');
  });

  it('formatea montos usando el código de moneda recibido', () => {
    expect(formatearMonto(1234.5, 'ARS')).toContain('1.234,5');
  });
});
