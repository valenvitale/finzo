BEGIN;

ALTER TABLE "presupuestos" ADD COLUMN "id_moneda" TEXT;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "presupuestos") THEN
    RAISE EXCEPTION 'Existen presupuestos sin moneda identificable; se requiere migración manual de esos datos';
  END IF;
END $$;

ALTER TABLE "presupuestos" ALTER COLUMN "id_moneda" SET NOT NULL;
ALTER TABLE "presupuestos" ADD CONSTRAINT "presupuestos_id_moneda_fkey"
  FOREIGN KEY ("id_moneda") REFERENCES "monedas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
DROP INDEX "presupuestos_id_perfil_id_categoria_mes_anio_key";
CREATE UNIQUE INDEX "presupuestos_id_perfil_id_categoria_id_moneda_mes_anio_key"
  ON "presupuestos"("id_perfil", "id_categoria", "id_moneda", "mes", "anio");

CREATE TABLE "metas_ahorro" (
  "id" TEXT NOT NULL,
  "id_perfil" TEXT NOT NULL,
  "id_moneda" TEXT NOT NULL,
  "monto" DECIMAL(12,2) NOT NULL,
  "mes" INTEGER NOT NULL,
  "anio" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "metas_ahorro_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "metas_ahorro_monto_check" CHECK ("monto" > 0),
  CONSTRAINT "metas_ahorro_mes_check" CHECK ("mes" BETWEEN 1 AND 12),
  CONSTRAINT "metas_ahorro_anio_check" CHECK ("anio" BETWEEN 1900 AND 9999)
);

CREATE UNIQUE INDEX "metas_ahorro_id_perfil_id_moneda_mes_anio_key"
  ON "metas_ahorro"("id_perfil", "id_moneda", "mes", "anio");
ALTER TABLE "metas_ahorro" ADD CONSTRAINT "metas_ahorro_id_perfil_fkey"
  FOREIGN KEY ("id_perfil") REFERENCES "perfiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "metas_ahorro" ADD CONSTRAINT "metas_ahorro_id_moneda_fkey"
  FOREIGN KEY ("id_moneda") REFERENCES "monedas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;
