# Configuración de Supabase — FINZO

Esta guía complementa el [README](../README.md) y permite reproducir los objetos de autenticación y seguridad que configuramos mediante SQL Editor y que no están incluidos en las migraciones de Prisma.

## 1. Preparar el proyecto

Utilizar una instancia de desarrollo de Supabase. Configurar la autenticación mediante correo electrónico y contraseña y obtener la URL del proyecto, las claves necesarias y las cadenas de conexión, tal como describe el README. La confirmación por correo y la configuración de redirecciones dependen de la instancia; revisar sus ajustes antes de probar el registro.

Ejecutar primero `pnpm exec prisma generate` y `pnpm exec prisma migrate deploy` desde `backend/` con el archivo `.env` configurado. Las tablas del esquema `public` deben existir antes de ejecutar los bloques SQL siguientes.

> [!WARNING]
> Los bloques están destinados a una instancia nueva, sin el trigger ni las políticas ya creadas. En una instancia compartida o existente, comparar primero las definiciones con las consultas de verificación del final. No ejecutar indiscriminadamente comandos de eliminación ni reemplazar políticas de otros integrantes.

### Actualización del modelo — Sprint 3

En `develop` (`d70bb6d`) incorporamos las migraciones `20261126000100_agregar_presupuestos` y `20261126000200_metas_ahorro_moneda`. El esquema actual incluye las tablas `presupuestos` y `metas_ahorro` relacionadas con `perfiles` y `monedas`; `presupuestos` se relaciona también con `categorias`. Sus combinaciones de unicidad son perfil/categoría/moneda/mes/año y perfil/moneda/mes/año, respectivamente.

**Alcance de esta guía:** las definiciones SQL siguientes reproducen las políticas recuperadas antes de esta ampliación. Revisamos los SQL de ambas migraciones: ninguna contiene instrucciones `ENABLE ROW LEVEL SECURITY` ni `CREATE POLICY`. Esto no demuestra si RLS fue habilitado manualmente o por otra configuración de la instancia. Consultar la sección 6 para confirmar el estado efectivo antes de exponer las tablas. No aplicar políticas nuevas a una instancia compartida sin coordinar con el equipo.

### Precaución al migrar una base existente

La primera migración crea `presupuestos` con límite positivo, mes entre 1 y 12 y año mayor o igual a 1900. La segunda agrega `id_moneda` obligatorio, modifica la clave única para incluir la moneda y crea `metas_ahorro` con monto positivo, mes entre 1 y 12 y año entre 1900 y 9999. Ambas usan `Decimal(12,2)` para los importes. Las claves foráneas de perfil y categoría eliminan presupuestos en cascada; las de moneda restringen el borrado. Las metas se eliminan en cascada con su perfil.

La segunda migración se ejecuta dentro de una transacción y comprueba si existen filas en `presupuestos`: en ese caso lanza una excepción antes de imponer la moneda obligatoria. No asigna una moneda por defecto ni borra registros. En una instancia nueva, sin presupuestos previos, esta condición no se cumple. En una instancia existente con presupuestos, detener el procedimiento, coordinar con el equipo una migración de datos que identifique la moneda de cada registro, realizar una copia de seguridad y probarla en una instancia de desarrollo. No borrar datos ni modificar el historial de migraciones aplicado para forzar su ejecución. La existencia del esquema en Git no demuestra que las migraciones estén aplicadas en la base compartida.

## 2. Creación automática del perfil

En SQL Editor, ejecutar la función y el trigger recuperados de la configuración existente. La función se ejecuta con los permisos de su propietario (`SECURITY DEFINER`), establece un `search_path` vacío y utiliza el nombre calificado `public.perfiles`.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.perfiles (
    id,
    nombre,
    apellido,
    foto_perfil,
    updated_at
  )
  VALUES (
    NEW.id::text,
    COALESCE(NEW.raw_user_meta_data ->> 'nombre', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'apellido', ''),
    NEW.raw_user_meta_data ->> 'foto_perfil',
    CURRENT_TIMESTAMP
  );

  RETURN NEW;
END;
$function$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
```

Al registrarse un usuario, Supabase Auth inserta una fila en `auth.users`. El trigger crea el perfil con el mismo identificador y recupera el nombre, apellido y foto opcional de los metadatos. No crea movimientos ni asigna monedas. No se aplica retroactivamente a usuarios existentes.

## 3. Habilitar Row Level Security (RLS)

```sql
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medios_de_pago ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfiles_monedas ENABLE ROW LEVEL SECURITY;
```

Las cinco tablas contienen datos vinculados a un usuario. `monedas` contiene el catálogo global y `_prisma_migrations` registra el historial de migraciones; no tienen RLS habilitado en la instancia revisada. Revisar sus permisos y exposición de manera independiente.

## 4. Crear políticas

Las 20 políticas recuperadas de la instancia existente son permisivas y se aplican al rol `authenticated`. En `perfiles` se compara `auth.uid()` convertido a texto con `id`; en las demás tablas se compara con `id_perfil`. `USING` delimita las filas accesibles para consulta, actualización y eliminación; `WITH CHECK` comprueba los valores de filas nuevas o actualizadas. Las categorías y los medios de pago globales (`id_perfil IS NULL`) también pueden consultarse, pero no modificarse mediante estas políticas por usuarios autenticados.

### `perfiles`

```sql
CREATE POLICY perfiles_select ON public.perfiles
AS PERMISSIVE FOR SELECT TO authenticated
USING (((( SELECT auth.uid() AS uid))::text = id));

CREATE POLICY perfiles_insert ON public.perfiles
AS PERMISSIVE FOR INSERT TO authenticated
WITH CHECK (((( SELECT auth.uid() AS uid))::text = id));

CREATE POLICY perfiles_update ON public.perfiles
AS PERMISSIVE FOR UPDATE TO authenticated
USING (((( SELECT auth.uid() AS uid))::text = id))
WITH CHECK (((( SELECT auth.uid() AS uid))::text = id));

CREATE POLICY perfiles_delete ON public.perfiles
AS PERMISSIVE FOR DELETE TO authenticated
USING (((( SELECT auth.uid() AS uid))::text = id));

```

### `movimientos`

```sql
CREATE POLICY movimientos_select ON public.movimientos
AS PERMISSIVE FOR SELECT TO authenticated
USING (((( SELECT auth.uid() AS uid))::text = id_perfil));

CREATE POLICY movimientos_insert ON public.movimientos
AS PERMISSIVE FOR INSERT TO authenticated
WITH CHECK (((( SELECT auth.uid() AS uid))::text = id_perfil));

CREATE POLICY movimientos_update ON public.movimientos
AS PERMISSIVE FOR UPDATE TO authenticated
USING (((( SELECT auth.uid() AS uid))::text = id_perfil))
WITH CHECK (((( SELECT auth.uid() AS uid))::text = id_perfil));

CREATE POLICY movimientos_delete ON public.movimientos
AS PERMISSIVE FOR DELETE TO authenticated
USING (((( SELECT auth.uid() AS uid))::text = id_perfil));

```

### `categorias`

```sql
CREATE POLICY categorias_select ON public.categorias
AS PERMISSIVE FOR SELECT TO authenticated
USING (((id_perfil IS NULL) OR ((( SELECT auth.uid() AS uid))::text = id_perfil)));

CREATE POLICY categorias_insert ON public.categorias
AS PERMISSIVE FOR INSERT TO authenticated
WITH CHECK (((( SELECT auth.uid() AS uid))::text = id_perfil));

CREATE POLICY categorias_update ON public.categorias
AS PERMISSIVE FOR UPDATE TO authenticated
USING (((( SELECT auth.uid() AS uid))::text = id_perfil))
WITH CHECK (((( SELECT auth.uid() AS uid))::text = id_perfil));

CREATE POLICY categorias_delete ON public.categorias
AS PERMISSIVE FOR DELETE TO authenticated
USING (((( SELECT auth.uid() AS uid))::text = id_perfil));

```

### `medios_de_pago`

```sql
CREATE POLICY medios_pago_select ON public.medios_de_pago
AS PERMISSIVE FOR SELECT TO authenticated
USING (((id_perfil IS NULL) OR ((( SELECT auth.uid() AS uid))::text = id_perfil)));

CREATE POLICY medios_pago_insert ON public.medios_de_pago
AS PERMISSIVE FOR INSERT TO authenticated
WITH CHECK (((( SELECT auth.uid() AS uid))::text = id_perfil));

CREATE POLICY medios_pago_update ON public.medios_de_pago
AS PERMISSIVE FOR UPDATE TO authenticated
USING (((( SELECT auth.uid() AS uid))::text = id_perfil))
WITH CHECK (((( SELECT auth.uid() AS uid))::text = id_perfil));

CREATE POLICY medios_pago_delete ON public.medios_de_pago
AS PERMISSIVE FOR DELETE TO authenticated
USING (((( SELECT auth.uid() AS uid))::text = id_perfil));

```

### `perfiles_monedas`

```sql
CREATE POLICY perfiles_monedas_select ON public.perfiles_monedas
AS PERMISSIVE FOR SELECT TO authenticated
USING (((( SELECT auth.uid() AS uid))::text = id_perfil));

CREATE POLICY perfiles_monedas_insert ON public.perfiles_monedas
AS PERMISSIVE FOR INSERT TO authenticated
WITH CHECK (((( SELECT auth.uid() AS uid))::text = id_perfil));

CREATE POLICY perfiles_monedas_update ON public.perfiles_monedas
AS PERMISSIVE FOR UPDATE TO authenticated
USING (((( SELECT auth.uid() AS uid))::text = id_perfil))
WITH CHECK (((( SELECT auth.uid() AS uid))::text = id_perfil));

CREATE POLICY perfiles_monedas_delete ON public.perfiles_monedas
AS PERMISSIVE FOR DELETE TO authenticated
USING (((( SELECT auth.uid() AS uid))::text = id_perfil));

```

## 5. Cargar datos iniciales

Desde `backend/`, ejecutar `pnpm exec prisma db seed`. El seed crea o actualiza monedas, categorías globales y medios de pago globales. Requiere la conexión de base de datos configurada en `DATABASE_URL`.

## 6. Verificar la configuración

Ejecutar estas consultas de solo lectura en SQL Editor:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

SELECT tgname, pg_get_triggerdef(oid)
FROM pg_trigger
WHERE tgrelid = 'auth.users'::regclass
  AND tgname = 'on_auth_user_created';

SELECT pg_get_functiondef('public.handle_new_user()'::regprocedure);
```

Para inspeccionar específicamente las tablas nuevas sin modificar la instancia:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('presupuestos', 'metas_ahorro');

SELECT tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('presupuestos', 'metas_ahorro')
ORDER BY tablename, policyname;
```

Si no aparecen políticas o RLS está deshabilitado, revisar también los permisos y la exposición por la API de Supabase antes de utilizar datos reales. El estado de las tablas nuevas sigue pendiente de confirmar; no se incluyen políticas como si ya existieran. En una instancia nueva deben definirse y verificarse los controles de acceso de estas tablas antes de exponerlas a clientes.

En la instancia revisada el 24/11/2026 se confirmó la existencia del trigger y de la función, RLS habilitado en las cinco tablas y las 20 políticas descriptas. Para la versión actual, verificar también `presupuestos` y `metas_ahorro` en ambas consultas de tablas y políticas. La función, el trigger y las condiciones de las políticas de esta guía proceden de las definiciones recuperadas del proyecto. No hemos ejecutado estos bloques en una instancia nueva.

## 7. Verificar el comportamiento y sus límites

En una instancia de desarrollo, registrar dos usuarios diferentes con cuentas de prueba. Confirmar que se crea un perfil por usuario. Registrar movimientos y elementos personalizados con el primer usuario, iniciar sesión como el segundo y comprobar que no puede consultar, editar ni eliminar registros ajenos. Confirmar que ambos pueden consultar las categorías y medios de pago globales y que no pueden modificarlos a través de la API del usuario. Para verificar específicamente RLS, repetir operaciones mediante un cliente Supabase con la sesión de cada usuario, no desde SQL Editor con un rol privilegiado. Repetir la comprobación con presupuestos y metas de ahorro de cada perfil. Registrar los resultados y no utilizar datos reales.

**Importante:** Prisma accede a PostgreSQL mediante una conexión configurada por el backend. Un rol propietario o con `BYPASSRLS` puede eludir las políticas; estas no garantizan por sí solas el aislamiento de las operaciones realizadas mediante Prisma. La autorización del backend debe comprobar siempre la identidad y pertenencia de los datos. Las políticas tampoco sustituyen los permisos de acceso a tablas, que deben revisarse para la instancia utilizada.

La verificación del aislamiento efectivo con dos usuarios y la reproducción desde cero siguen pendientes. Los tests con mocks comprueban el comportamiento de los componentes aislados, no el funcionamiento de las políticas reales.

## 8. Storage y fotos de perfil

En la instancia revisada no se encontraron buckets en Supabase Storage. El esquema admite `foto_perfil` opcional, pero no se confirmó un flujo de carga de imágenes. No configuramos políticas de Storage ni afirmamos que la carga de fotos esté implementada. Si se incorpora esa funcionalidad, documentaremos su bucket, permisos y validaciones.
