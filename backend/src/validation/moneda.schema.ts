import { z } from 'zod';

const camposMoneda = {
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(30, 'El nombre no puede superar los 30 caracteres'),
  codigo: z.string().regex(/^[A-Z]{3}$/, 'El código debe contener exactamente tres letras mayúsculas'),
  simbolo: z.string().trim().min(1, 'El símbolo es obligatorio').max(5, 'El símbolo no puede superar los 5 caracteres'),
};

export const crearMonedaSchema = z.strictObject(camposMoneda);

export const actualizarMonedaSchema = z.strictObject({
  nombre: camposMoneda.nombre.optional(),
  codigo: camposMoneda.codigo.optional(),
  simbolo: camposMoneda.simbolo.optional(),
});

export const asignarMonedaSchema = z.strictObject({
  monedaId: z.uuid('El identificador de la moneda debe ser un UUID válido'),
  esPrincipal: z.boolean().optional(),
});

export const monedaIdParamsSchema = z.strictObject({
  monedaId: z.uuid('El identificador de la moneda debe ser un UUID válido'),
});
