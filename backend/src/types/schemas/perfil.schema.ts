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

export const actualizarPerfilSchema = z
  .strictObject({
    nombre: camposPerfil.nombre.optional(),
    apellido: camposPerfil.apellido.optional(),
    foto_perfil: camposPerfil.foto_perfil,
    email: z.email('El correo debe ser válido').optional(),
    currentPassword: z.string().min(1, 'La contraseña actual es obligatoria').optional(),
    newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres').optional(),
  })
  .refine((datos) => (!datos.email && !datos.newPassword) || Boolean(datos.currentPassword), {
    message: 'La contraseña actual es obligatoria para cambiar el correo o la contraseña',
    path: ['currentPassword'],
  })
  .refine((datos) => !datos.currentPassword || Boolean(datos.email || datos.newPassword), {
    message: 'La contraseña actual solo puede enviarse junto con un cambio de correo o contraseña',
    path: ['currentPassword'],
  })
  .refine(
    (datos) =>
      [datos.nombre, datos.apellido, datos.foto_perfil, datos.email, datos.newPassword].some(
        (valor) => valor !== undefined
      ),
    {
      message: 'Debe enviar al menos un campo para actualizar',
    }
  );
