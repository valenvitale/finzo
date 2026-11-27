import { describe, expect, it } from 'vitest';
import { formatearFecha } from '../../src/utils/fecha';
import { formatearNumero, formatearPorcentaje } from '../../src/utils/formato';
import { formatearMoneda } from '../../src/utils/moneda';

describe('utilidades de formato', () => {
  it('formatea montos de acuerdo con la moneda y locale indicados', () => {
    expect(formatearMoneda(1234.5, 'USD', 'en-US')).toBe('$1,234.50');
  });

  it('permite personalizar el formato de fechas y números', () => {
    expect(
      formatearFecha('2026-11-18T12:00:00Z', 'en-US', {
        month: 'long',
        timeZone: 'UTC',
      })
    ).toBe('November 18, 2026');
    expect(formatearNumero(1234.5, 'en-US')).toBe('1,234.5');
    expect(formatearPorcentaje(0.25, 'en-US')).toBe('25%');
  });
});
