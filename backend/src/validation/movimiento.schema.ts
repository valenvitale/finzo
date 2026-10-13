
import { z } from 'zod';

// Esquema de validación para crear un movimiento
export const crearMovimientoSchema = z.object({
    fecha: z.coerce.date('La fecha no es válida'),
    monto: z.number('El monto debe ser un número').positive('El monto debe ser un número positivo'),
    descripcion: z.string().max(100, 'La descripción no puede superar los 100 caracteres').optional().nullable(),
    monedaId: z.uuid('El ID de la moneda no es válido'),
    categoriaId: z.uuid('El ID de la categoría no es válido'),
    medioPagoId: z.uuid('El ID del medio de pago no es válido'),
})

// Esquema de validacion para actualizar un movimiento
export const actualizarMovimientoSchema = crearMovimientoSchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: 'Debe enviar al menos un campo para actualizar',
  });

// Esquema de validacion para filtrar movimientos
export const filtrosMovimientoSchema = z.object({
    fechaDesde: z.coerce.date('La fecha no es válida').optional(),
    fechaHasta: z.coerce.date('La fecha no es válida').optional(),
    mes: z.coerce.number('El mes debe ser un número').int('El mes debe ser un número entero').min(1, 'El mes debe estar entre 1 y 12').max(12, 'El mes debe estar entre 1 y 12').optional(),
    anio: z.coerce.number('El año debe ser un número').int('El año debe ser un número entero').min(1900, 'El año debe ser mayor o igual a 1900').max(new Date().getFullYear(), `El año no puede ser mayor a ${new Date().getFullYear()}`).optional(),
    montoMinimo: z.coerce.number('El monto mínimo debe ser un número').positive('El monto mínimo debe ser un número positivo').optional(),
    montoMaximo: z.coerce.number('El monto máximo debe ser un número').positive('El monto máximo debe ser un número positivo').optional(),
    categoriaId: z.uuid('El ID de la categoría no es válido').optional(),
    monedaId: z.uuid('El ID de la moneda no es válido').optional(),
    medioPagoId: z.uuid('El ID del medio de pago no es válido').optional(),
    tipo: z.enum(['INGRESO', 'GASTO'], 'El tipo de movimiento debe ser INGRESO o GASTO').optional(),
})

// Esquema de validacion para el id de movimiento en parámetros de ruta
export const movimientoIdParamsSchema = z.strictObject({
    id: z.uuid('El identificador del movimiento debe ser un UUID válido'),
});

export type CrearMovimiento = z.infer<typeof crearMovimientoSchema>;
export type ActualizarMovimiento = z.infer<typeof actualizarMovimientoSchema>;
export type FiltrosMovimiento = z.infer<typeof filtrosMovimientoSchema>;
export type MovimientoIdParams = z.infer<typeof movimientoIdParamsSchema>;