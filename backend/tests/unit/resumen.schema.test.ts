
import { describe, it, expect } from 'vitest';
import { resumenQuerySchema } from '../../src/validation/resumen.schema.js';

describe('Validación del resumen con Zod', () => {
  it('acepta mes y año válidos y los convierte a números', () => {
    const resultado = resumenQuerySchema.parse({
      mes: '10',
      anio: '2026',
    });

    expect(resultado).toEqual({
      mes: 10,
      anio: 2026,
    });
  });

  it('rechaza un mes fuera de rango', () => {
    const resultado = resumenQuerySchema.safeParse({
      mes: '18',
      anio: '2026',
    });

    expect(resultado.success).toBe(false);
  });

  it('rechaza un año que no tiene cuatro dígitos', () => {
    const resultado = resumenQuerySchema.safeParse({
      mes: '10',
      anio: 'hola',
    });

    expect(resultado.success).toBe(false);
  });

  it('permite consultar sin indicar mes ni año', () => {
    const resultado = resumenQuerySchema.safeParse({});

    expect(resultado.success).toBe(true);
  });

  it('rechaza parámetros adicionales', () => {
    const resultado = resumenQuerySchema.safeParse({
      mes: '10',
      otro: '123',
    });

    expect(resultado.success).toBe(false);
  });
});
