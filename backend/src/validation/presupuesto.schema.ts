import { z } from 'zod';

const limiteMensual = z
  .number('El límite mensual debe ser un número')
  .positive('El límite mensual debe ser mayor que cero')
  .max(9_999_999_999.99, 'El límite mensual es demasiado alto')
  .refine(
    (valor) => Math.abs(valor - Math.round(valor * 100) / 100) < 0.00000001,
    'El límite mensual admite hasta dos decimales'
  );

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
  limiteMensual,
  mes: z.number().int().min(1).max(12),
  anio: z.number().int().min(1900).max(9999),
});

export const actualizarPresupuestoSchema = z.strictObject({
  limiteMensual,
});

export const presupuestoIdParamsSchema = z.strictObject({
  id: z.uuid('El identificador del presupuesto debe ser un UUID válido'),
});

export type ListarPresupuestosQuery = z.infer<typeof listarPresupuestosQuerySchema>;
