import { z } from 'zod';

// Valida fechas con formato YYYY-MM-DD.
const fechaSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}$/,
    'La fecha debe tener el formato YYYY-MM-DD'
  )
  .refine((valor) => {
    const fecha = new Date(`${valor}T00:00:00.000Z`);

    return (
      !Number.isNaN(fecha.getTime()) &&
      fecha.toISOString().slice(0, 10) === valor
    );
  }, 'La fecha ingresada no es válida');

// Valida los filtros opcionales de estadísticas.
export const estadisticasQuerySchema = z
  .object({
    fechaDesde: fechaSchema
      .transform((valor) => new Date(`${valor}T00:00:00.000Z`))
      .optional(),

    fechaHasta: fechaSchema
      .transform((valor) => new Date(`${valor}T23:59:59.999Z`))
      .optional(),
  })
  .strict()
  .refine(
    (datos) =>
      !datos.fechaDesde ||
      !datos.fechaHasta ||
      datos.fechaDesde <= datos.fechaHasta,
    {
      message: 'La fecha desde no puede ser posterior a la fecha hasta',
      path: ['fechaHasta'],
    }
  );