import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL no está definida en las variables de entorno');
}

// Pool administra varias conexiones reutilizables con PostgreSQL.
// Reutilizar conexiones es mas eficiente que abrir una nueva para cada consulta.
const pool = new pg.Pool({ connectionString });

// PrismaPg adapta el pool de node-postgres al formato que Prisma espera.
const adapter = new PrismaPg(pool);

// globalThis permite conservar la instancia entre recargas del modulo.
// Esto es especialmente importante en desarrollo, donde el servidor puede recargar archivos
// y crear accidentalmente muchos PrismaClient, agotando las conexiones disponibles.
const globalPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Patron Singleton
// Si ya existe una instancia global, se reutiliza.
// Si no existe, se crea un cliente nuevo usando el adaptador de PostgreSQL.
export const prisma = globalPrisma.prisma ?? new PrismaClient({ adapter });

// En desarrollo guardamos el cliente en globalThis para reutilizarlo en futuras recargas.
// En produccion no se guarda globalmente porque el proceso normalmente permanece estable
// y cada instancia de la aplicacion debe administrar su propio cliente.
if (process.env.NODE_ENV !== 'production') {
  globalPrisma.prisma = prisma;
}
