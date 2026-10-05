-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('INGRESO', 'GASTO');

-- CreateTable
CREATE TABLE "monedas" (
    "id" TEXT NOT NULL,
    "nombre" VARCHAR(30) NOT NULL,
    "codigo" VARCHAR(3) NOT NULL,
    "simbolo" VARCHAR(5) NOT NULL,

    CONSTRAINT "monedas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfiles" (
    "id" TEXT NOT NULL,
    "nombre" VARCHAR(30) NOT NULL,
    "apellido" VARCHAR(30) NOT NULL,
    "foto_perfil" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perfiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL,
    "nombre" VARCHAR(30) NOT NULL,
    "color" VARCHAR(7) NOT NULL,
    "tipo" "TipoMovimiento" NOT NULL,
    "id_perfil" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfiles_monedas" (
    "id_perfil" TEXT NOT NULL,
    "id_moneda" TEXT NOT NULL,
    "es_principal" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "perfiles_monedas_pkey" PRIMARY KEY ("id_perfil","id_moneda")
);

-- CreateTable
CREATE TABLE "medios_de_pago" (
    "id" TEXT NOT NULL,
    "nombre" VARCHAR(40) NOT NULL,
    "icono" VARCHAR(20) NOT NULL,
    "id_perfil" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medios_de_pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimientos" (
    "id" TEXT NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descripcion" VARCHAR(100),
    "id_perfil" TEXT NOT NULL,
    "id_moneda" TEXT NOT NULL,
    "id_categoria" TEXT NOT NULL,
    "id_medio_pago" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movimientos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "monedas_codigo_key" ON "monedas"("codigo");

-- CreateIndex
CREATE INDEX "categorias_id_perfil_idx" ON "categorias"("id_perfil");

-- CreateIndex
CREATE INDEX "medios_de_pago_id_perfil_idx" ON "medios_de_pago"("id_perfil");

-- CreateIndex
CREATE INDEX "movimientos_id_perfil_idx" ON "movimientos"("id_perfil");

-- CreateIndex
CREATE INDEX "movimientos_fecha_idx" ON "movimientos"("fecha");

-- CreateIndex
CREATE INDEX "movimientos_id_perfil_fecha_idx" ON "movimientos"("id_perfil", "fecha");

-- CreateIndex
CREATE INDEX "movimientos_id_categoria_idx" ON "movimientos"("id_categoria");

-- CreateIndex
CREATE INDEX "movimientos_id_medio_pago_idx" ON "movimientos"("id_medio_pago");

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_id_perfil_fkey" FOREIGN KEY ("id_perfil") REFERENCES "perfiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfiles_monedas" ADD CONSTRAINT "perfiles_monedas_id_perfil_fkey" FOREIGN KEY ("id_perfil") REFERENCES "perfiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfiles_monedas" ADD CONSTRAINT "perfiles_monedas_id_moneda_fkey" FOREIGN KEY ("id_moneda") REFERENCES "monedas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medios_de_pago" ADD CONSTRAINT "medios_de_pago_id_perfil_fkey" FOREIGN KEY ("id_perfil") REFERENCES "perfiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_id_perfil_fkey" FOREIGN KEY ("id_perfil") REFERENCES "perfiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_id_moneda_fkey" FOREIGN KEY ("id_moneda") REFERENCES "monedas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_id_medio_pago_fkey" FOREIGN KEY ("id_medio_pago") REFERENCES "medios_de_pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
