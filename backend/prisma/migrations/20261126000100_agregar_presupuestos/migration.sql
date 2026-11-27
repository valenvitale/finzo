CREATE TABLE "presupuestos" (
    "id" TEXT NOT NULL,
    "id_perfil" TEXT NOT NULL,
    "id_categoria" TEXT NOT NULL,
    "limite_mensual" DECIMAL(12,2) NOT NULL,
    "mes" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "presupuestos_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "presupuestos_limite_mensual_check" CHECK ("limite_mensual" > 0),
    CONSTRAINT "presupuestos_mes_check" CHECK ("mes" >= 1 AND "mes" <= 12),
    CONSTRAINT "presupuestos_anio_check" CHECK ("anio" >= 1900)
);

CREATE UNIQUE INDEX "presupuestos_id_perfil_id_categoria_mes_anio_key"
ON "presupuestos"("id_perfil", "id_categoria", "mes", "anio");

CREATE INDEX "presupuestos_id_perfil_anio_mes_idx"
ON "presupuestos"("id_perfil", "anio", "mes");

ALTER TABLE "presupuestos"
ADD CONSTRAINT "presupuestos_id_perfil_fkey"
FOREIGN KEY ("id_perfil") REFERENCES "perfiles"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "presupuestos"
ADD CONSTRAINT "presupuestos_id_categoria_fkey"
FOREIGN KEY ("id_categoria") REFERENCES "categorias"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
