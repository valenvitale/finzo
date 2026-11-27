import { z } from 'zod';

// este codigo define un schema de validacion para los query parameters de una solicitud HTTP.
// se utiliza para validar 'mes' y 'anio' en la query string d ela solicitud.
// tambien permite que los parametros 'anio' y 'mes' sean opcionales, pero si se proporcionan, deben cumplir con ciertas reglas de validacion.
export const resumenQuerySchema = z
  .object({
    mes: z
      .string()
      .regex(/^\d+$/, 'El mes debe ser un número entero')
      .transform(Number)
      .refine((valor) => valor >= 1 && valor <= 12, {
        message: 'El mes debe estar entre 1 y 12',
      })
      .optional(),

    anio: z
      .string()
      .regex(/^\d{4}$/, 'El año debe tener 4 dígitos')
      .transform(Number)
      .refine((valor) => valor >= 2000, {
        message: 'El año no es válido',
      })
      .optional(),
  })
  .strict();