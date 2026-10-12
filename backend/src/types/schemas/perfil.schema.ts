import { z } from 'zod';

const camposPerfil = {
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(30, 'El nombre no puede superar los 30 caracteres'),
  apellido: z
    .string()
    .trim()
    .min(1, 'El apellido es obligatorio')
    .max(30, 'El apellido no puede superar los 30 caracteres'),
  foto_perfil: z.string().trim().min(1, 'La foto de perfil no puede estar vacía').nullable().optional(),
};

export const crearPerfilSchema = z.strictObject(camposPerfil);

export const actualizarPerfilSchema = z.strictObject({
  nombre: camposPerfil.nombre.optional(),
  apellido: camposPerfil.apellido.optional(),
  foto_perfil: camposPerfil.foto_perfil,
});
