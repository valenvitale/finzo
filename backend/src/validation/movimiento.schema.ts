import { z } from 'zod';

function obtenerFechaActual(): string {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const { year, month, day } = Object.fromEntries(
    partes.map(({ type, value }) => [type, value])
  );

  return `${year}-${month}-${day}`;
}

// Esquema de validación para crear un movimiento
export const crearMovimientoSchema = z.strictObject({
  fecha: z.coerce.date('La fecha no es válida').refine(
    (fecha) =>
        fecha.getTime() <=
        new Date(`${obtenerFechaActual()}T23:59:59.999Z`).getTime(),
    {
        message: 'La fecha no puede ser posterior al día de hoy',
    }
  ),
  monto: z.number('El monto debe ser un número')
    .positive('El monto debe ser un número positivo'),
  descripcion: z.string()
    .max(100, 'La descripción no puede superar los 100 caracteres')
    .optional()
    .nullable(),
  monedaId: z.uuid('El ID de la moneda no es válido'),
  categoriaId: z.uuid('El ID de la categoría no es válido'),
  medioPagoId: z.uuid('El ID del medio de pago no es válido')
    .nullable()
    .optional(),
});

// Esquema de validación para actualizar un movimiento
export const actualizarMovimientoSchema = crearMovimientoSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debe enviar al menos un campo para actualizar',
  });

// Esquema de validación para filtrar movimientos
export const filtrosMovimientoSchema = z
  .strictObject({
    fechaDesde: z.coerce.date('La fecha no es válida').optional(),

    fechaHasta: z.coerce.date('La fecha no es válida').optional(),

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
      .max(
        new Date().getFullYear(),
        `El año no puede ser mayor a ${new Date().getFullYear()}`
      )
      .optional(),

    montoMinimo: z.coerce
      .number('El monto mínimo debe ser un número')
      .positive('El monto mínimo debe ser un número positivo')
      .optional(),

    montoMaximo: z.coerce
      .number('El monto máximo debe ser un número')
      .positive('El monto máximo debe ser un número positivo')
      .optional(),

    categoriaId: z.uuid('El ID de la categoría no es válido').optional(),

    monedaId: z.uuid('El ID de la moneda no es válido').optional(),

    medioPagoId: z.uuid('El ID del medio de pago no es válido').optional(),

    tipo: z
      .enum(
        ['INGRESO', 'GASTO'],
        'El tipo de movimiento debe ser INGRESO o GASTO'
      )
      .optional(),
  })
  .refine(
    (datos) =>
      datos.fechaDesde === undefined ||
      datos.fechaHasta === undefined ||
      datos.fechaDesde <= datos.fechaHasta,
    {
      message: 'La fecha desde no puede ser posterior a la fecha hasta',
      path: ['fechaHasta'],
    }
  )
  .refine(
    (datos) =>
      datos.montoMinimo === undefined ||
      datos.montoMaximo === undefined ||
      datos.montoMinimo <= datos.montoMaximo,
    {
      message: 'El monto mínimo no puede ser superior al monto máximo',
      path: ['montoMaximo'],
    }
  );

// Esquema de validación para el ID de movimiento
export const movimientoIdParamsSchema = z.strictObject({
  id: z.uuid('El identificador del movimiento debe ser un UUID válido'),
});

export type CrearMovimiento = z.infer<typeof crearMovimientoSchema>;
export type ActualizarMovimiento = z.infer<typeof actualizarMovimientoSchema>;
export type FiltrosMovimiento = z.infer<typeof filtrosMovimientoSchema>;
export type MovimientoIdParams = z.infer<typeof movimientoIdParamsSchema>;