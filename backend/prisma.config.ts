/// <reference types="node" />
import { defineConfig, env } from 'prisma/config';

try {
  process.loadEnvFile();
} catch {
  // Ignorar si no existe el archivo .env
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DIRECT_URL'),
  },
});
