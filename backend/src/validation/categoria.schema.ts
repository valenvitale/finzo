import { z } from 'zod';

const camposCategoria = {
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(30, 'El nombre no puede superar los 30 caracteres'),
  color: z.string().regex(/^#[\da-fA-F]{6}$/, 'El color debe ser un código hexadecimal válido, por ejemplo #A1B2C3'),
  tipo: z.enum(['INGRESO', 'GASTO'], { error: 'El tipo debe ser INGRESO o GASTO' }),
  icono: z
    .enum([
      'briefcase-business',
      'trending-up',
      'shopping-bag',
      'wallet',
      'utensils',
      'car',
      'zap',
      'heart-pulse',
      'graduation-cap',
      'gamepad-2',
      'tag',
    ])
    .default('tag'),
};

// Esquema de validación para crear una categoría
export const crearCategoriaSchema = z.strictObject(camposCategoria);

// Esquema de validación para actualizar una categoría
export const actualizarCategoriaSchema = z
  .strictObject({
    nombre: camposCategoria.nombre.optional(),
    color: camposCategoria.color.optional(),
    tipo: camposCategoria.tipo.optional(),
    icono: camposCategoria.icono.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debe enviar al menos un campo para actualizar',
  });

// Esquema de validación para el id de categoría en parámetros de ruta
export const categoriaIdParamsSchema = z.strictObject({
  id: z.uuid('El identificador de la categoría debe ser un UUID válido'),
});

export type CrearCategoria = z.infer<typeof crearCategoriaSchema>;
export type ActualizarCategoria = z.infer<typeof actualizarCategoriaSchema>;
export type CategoriaIdParams = z.infer<typeof categoriaIdParamsSchema>;
