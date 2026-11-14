import { z } from 'zod';

const camposMedioPago = {
  nombre: z
    .string('El nombre debe ser un texto')
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(40, 'El nombre no puede superar los 40 caracteres'),
  icono: z
    .string('El ícono debe ser un texto')
    .trim()
    .min(1, 'El ícono es obligatorio')
    .max(20, 'El ícono no puede superar los 20 caracteres'),
};

export const crearMedioPagoSchema = z.strictObject(camposMedioPago);

export const actualizarMedioPagoSchema = z.strictObject({
  nombre: camposMedioPago.nombre.optional(),
  icono: camposMedioPago.icono.optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Debe enviar al menos un campo para actualizar',
});
