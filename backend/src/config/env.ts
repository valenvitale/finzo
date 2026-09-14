import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  SUPABASE_URL: z.string().min(1, 'SUPABASE_URL es requerida'),
  SUPABASE_ANON_KEY: z.string().min(1, 'SUPABASE_ANON_KEY es requerida'),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, 'SUPABASE_SERVICE_ROLE_KEY es requerida'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    '❌ Variables de entorno inválidas o faltantes en el backend:',
    parsed.error.format(),
  );
  throw new Error('Configuración de variables de entorno inválida');
}

export const env = parsed.data;
