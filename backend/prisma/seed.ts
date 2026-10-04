import { PrismaClient, TipoMovimiento } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import process from "node:process";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const MONEDAS = [
  { codigo: "ARS", nombre: "Peso Argentino", simbolo: "$" },
  { codigo: "USD", nombre: "Dólar Estadounidense", simbolo: "US$" },
  { codigo: "EUR", nombre: "Euro", simbolo: "€" },
];

const CATEGORIAS_SISTEMA = [
  // Categorías de Ingreso
  {
    id: "c0000000-0000-4000-8000-000000000001",
    nombre: "Sueldo",
    tipo: TipoMovimiento.INGRESO,
    color: "#22C55E",
  },
  {
    id: "c0000000-0000-4000-8000-000000000002",
    nombre: "Inversiones",
    tipo: TipoMovimiento.INGRESO,
    color: "#10B981",
  },
  {
    id: "c0000000-0000-4000-8000-000000000003",
    nombre: "Ventas",
    tipo: TipoMovimiento.INGRESO,
    color: "#06B6D4",
  },
  {
    id: "c0000000-0000-4000-8000-000000000004",
    nombre: "Otros Ingresos",
    tipo: TipoMovimiento.INGRESO,
    color: "#84CC16",
  },
  // Categorías de Gasto
  {
    id: "c0000000-0000-4000-8000-000000000005",
    nombre: "Alimentación",
    tipo: TipoMovimiento.GASTO,
    color: "#EF4444",
  },
  {
    id: "c0000000-0000-4000-8000-000000000006",
    nombre: "Transporte",
    tipo: TipoMovimiento.GASTO,
    color: "#F97316",
  },
  {
    id: "c0000000-0000-4000-8000-000000000007",
    nombre: "Servicios",
    tipo: TipoMovimiento.GASTO,
    color: "#F59E0B",
  },
  {
    id: "c0000000-0000-4000-8000-000000000008",
    nombre: "Salud",
    tipo: TipoMovimiento.GASTO,
    color: "#EC4899",
  },
  {
    id: "c0000000-0000-4000-8000-000000000009",
    nombre: "Educación",
    tipo: TipoMovimiento.GASTO,
    color: "#8B5CF6",
  },
  {
    id: "c0000000-0000-4000-8000-000000000010",
    nombre: "Entretenimiento",
    tipo: TipoMovimiento.GASTO,
    color: "#3B82F6",
  },
  {
    id: "c0000000-0000-4000-8000-000000000011",
    nombre: "Otros Gastos",
    tipo: TipoMovimiento.GASTO,
    color: "#6B7280",
  },
];

const MEDIOS_PAGO_SISTEMA = [
  {
    id: "d0000000-0000-4000-8000-000000000001",
    nombre: "Efectivo",
    icono: "banknote",
  },
  {
    id: "d0000000-0000-4000-8000-000000000002",
    nombre: "Tarjeta de Débito",
    icono: "credit-card",
  },
  {
    id: "d0000000-0000-4000-8000-000000000003",
    nombre: "Tarjeta de Crédito",
    icono: "credit-card",
  },
  {
    id: "d0000000-0000-4000-8000-000000000004",
    nombre: "Transferencia",
    icono: "landmark",
  },
];

async function main() {
  console.log("🌱 Iniciando seed de datos para Finzo...");

  // 1. Monedas base del sistema
  console.log("\n🪙 Sembrando monedas base...");
  for (const m of MONEDAS) {
    const moneda = await prisma.moneda.upsert({
      where: { codigo: m.codigo },
      update: {
        nombre: m.nombre,
        simbolo: m.simbolo,
      },
      create: {
        nombre: m.nombre,
        codigo: m.codigo,
        simbolo: m.simbolo,
      },
    });
    console.log(`  ✓ Moneda: ${moneda.codigo} (${moneda.nombre})`);
  }

  // 2. Categorías predeterminadas del sistema (id_perfil: null)
  console.log("\n📁 Sembrando categorías del sistema...");
  for (const cat of CATEGORIAS_SISTEMA) {
    const existente = await prisma.categoria.findFirst({
      where: { nombre: cat.nombre, id_perfil: null },
    });

    if (existente) {
      await prisma.categoria.update({
        where: { id: existente.id },
        data: {
          color: cat.color,
          tipo: cat.tipo,
        },
      });
      console.log(`  ↺ Actualizada categoría: ${cat.nombre} [${cat.tipo}]`);
    } else {
      await prisma.categoria.create({
        data: {
          id: cat.id,
          nombre: cat.nombre,
          color: cat.color,
          tipo: cat.tipo,
          id_perfil: null,
        },
      });
      console.log(`  ✓ Creada categoría: ${cat.nombre} [${cat.tipo}]`);
    }
  }

  // 3. Medios de pago predeterminados del sistema (id_perfil: null)
  console.log("\n💳 Sembrando medios de pago del sistema...");
  for (const mp of MEDIOS_PAGO_SISTEMA) {
    const existente = await prisma.medioPago.findFirst({
      where: { nombre: mp.nombre, id_perfil: null },
    });

    if (existente) {
      await prisma.medioPago.update({
        where: { id: existente.id },
        data: {
          icono: mp.icono,
        },
      });
      console.log(`  ↺ Actualizado medio de pago: ${mp.nombre}`);
    } else {
      await prisma.medioPago.create({
        data: {
          id: mp.id,
          nombre: mp.nombre,
          icono: mp.icono,
          id_perfil: null,
        },
      });
      console.log(`  ✓ Creado medio de pago: ${mp.nombre}`);
    }
  }

  console.log("\n✅ Seed completado con éxito.");
}

main()
  .catch((e) => {
    console.error("❌ Error ejecutando seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
