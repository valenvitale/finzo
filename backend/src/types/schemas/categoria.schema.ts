import { z } from 'zod';

const camposCategoria = {
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(30, 'El nombre no puede superar los 30 caracteres'),
  color: z.string().regex(/^#[\da-fA-F]{6}$/, 'El color debe ser un código hexadecimal válido, por ejemplo #A1B2C3'),
  tipo: z.enum(['INGRESO', 'GASTO'], { error: 'El tipo debe ser INGRESO o GASTO' }),
};

export const crearCategoriaSchema = z.strictObject(camposCategoria);

export const actualizarCategoriaSchema = z.strictObject({
  nombre: camposCategoria.nombre.optional(),
  color: camposCategoria.color.optional(),
  tipo: camposCategoria.tipo.optional(),
});
