import { z } from 'zod';

const importe = z
  .number('El importe debe ser un número')
  .min(0.01, 'El importe debe ser de al menos 0,01')
  .max(9_999_999_999.99, 'El importe es demasiado alto')
  .refine((valor) => Number(valor.toFixed(2)) === valor, 'El importe admite hasta dos decimales');

export const listarPresupuestosQuerySchema = z.strictObject({
  mes: z.coerce
    .number('El mes debe ser un número')
    .int('El mes debe ser un número entero')
    .min(1, 'El mes debe estar entre 1 y 12')
    .max(12, 'El mes debe estar entre 1 y 12')
    .optional(),
  anio: z.coerce
    .number('El año debe ser un número')
    .int('El año debe ser un número entero')
    .min(1900, 'El año debe ser mayor o igual a 1900')
    .max(9999, 'El año no puede ser mayor a 9999')
    .optional(),
});

export const crearPresupuestoSchema = z.strictObject({
  categoriaId: z.uuid('El identificador de categoría debe ser un UUID válido'),
  monedaId: z.uuid('El identificador de moneda debe ser un UUID válido'),
  limiteMensual: importe,
  mes: z.number().int().min(1).max(12),
  anio: z.number().int().min(1900).max(9999),
});

export const actualizarPresupuestoSchema = z.strictObject({
  limiteMensual: importe,
});

export const guardarMetaAhorroSchema = z.strictObject({
  monto: importe,
  monedaId: z.uuid('El identificador de moneda debe ser un UUID válido'),
  mes: z.number().int().min(1).max(12),
  anio: z.number().int().min(1900).max(9999),
});

export const presupuestoIdParamsSchema = z.strictObject({
  id: z.uuid('El identificador del presupuesto debe ser un UUID válido'),
});

export type ListarPresupuestosQuery = z.infer<typeof listarPresupuestosQuerySchema>;
