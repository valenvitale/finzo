import { describe, expect, it } from 'vitest';
import {
  actualizarCategoriaSchema,
  crearCategoriaSchema,
} from '../../src/types/schemas/categoria.schema.js';
import {
  actualizarPerfilSchema,
  crearPerfilSchema,
} from '../../src/types/schemas/perfil.schema.js';
import {
  actualizarMonedaSchema,
  crearMonedaSchema,
} from '../../src/types/schemas/moneda.schema.js';
import {
  actualizarMedioPagoSchema,
  crearMedioPagoSchema,
} from '../../src/types/schemas/medio-pago.schema.js';

describe('Schemas del sistema', () => {
  it('valida categorías según los límites del modelo', () => {
    expect(crearCategoriaSchema.safeParse({ nombre: ' Hogar ', color: '#aBc123', tipo: 'GASTO' }).success).toBe(true);
    expect(crearCategoriaSchema.safeParse({ nombre: 'Hogar', color: 'rojo', tipo: 'GASTO' }).success).toBe(false);
    expect(crearCategoriaSchema.safeParse({ nombre: 'Hogar', color: '#A1B2C3', tipo: 'GASTO', extra: true }).success).toBe(
      false,
    );
    expect(actualizarCategoriaSchema.safeParse({ color: '#A1B2C3' }).success).toBe(true);
  });

  it('valida perfiles y permite quitar la foto de perfil', () => {
    expect(crearPerfilSchema.safeParse({ nombre: 'Máximo', apellido: 'Messina' }).success).toBe(true);
    expect(actualizarPerfilSchema.safeParse({ foto_perfil: null }).success).toBe(true);
    expect(crearPerfilSchema.safeParse({ nombre: 'Máximo', apellido: '' }).success).toBe(false);
  });

  it('valida monedas con código ISO de tres letras mayúsculas', () => {
    expect(crearMonedaSchema.safeParse({ nombre: 'Peso', codigo: 'ARS', simbolo: '$' }).success).toBe(true);
    expect(crearMonedaSchema.safeParse({ nombre: 'Peso', codigo: 'ars', simbolo: '$' }).success).toBe(false);
    expect(actualizarMonedaSchema.safeParse({ simbolo: '$' }).success).toBe(true);
  });

  it('valida medios de pago según los límites del modelo', () => {
    expect(crearMedioPagoSchema.safeParse({ nombre: 'Tarjeta', icono: 'credit-card' }).success).toBe(true);
    expect(crearMedioPagoSchema.safeParse({ nombre: '', icono: 'cash' }).success).toBe(false);
    expect(actualizarMedioPagoSchema.safeParse({ icono: 'cash' }).success).toBe(true);
  });
});
