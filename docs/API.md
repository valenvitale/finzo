## Índice

- [1. Convenciones y autenticación](#1-convenciones-y-autenticación)
- [2. Catálogo de endpoints](#2-catálogo-de-endpoints)
- [3. Perfil](#3-perfil)
- [4. Monedas](#4-monedas)
- [5. Movimientos](#5-movimientos)
- [6. Categorías](#6-categorías)
- [7. Medios de pago](#7-medios-de-pago)
- [8. Resumen financiero](#8-resumen-financiero)
- [9. Estadísticas](#9-estadísticas)
- [10. Presupuestos y metas de ahorro](#10-presupuestos-y-metas-de-ahorro)
- [11. Verificación de contratos y límites de esta referencia](#11-verificación-de-contratos-y-límites-de-esta-referencia)

# API REST — FINZO

Referencia técnica del backend al cierre del Sprint 3 (27/11/2026), basada en `develop` (`d70bb6d`) y en las rutas, controladores, servicios y esquemas revisados. Complementa el [README](../README.md) y la [guía de Supabase](configuracion-supabase.md). Los ejemplos usan datos ficticios; deben reemplazarse los identificadores por los de la instancia de desarrollo.

## 1. Convenciones y autenticación

- URL base local: `http://localhost:3000/api` (puerto configurable). `GET /` fuera de `/api` responde con texto y permite comprobar que el servidor HTTP está activo; no comprueba la base de datos.
- Los cuerpos se envían como JSON con `Content-Type: application/json`.
- Las operaciones de registro e inicio de sesión se realizan mediante Supabase Auth, no mediante endpoints de registro o login de Express.
- Excepto el catálogo público `GET /api/monedas`, las operaciones de la API requieren `Authorization: Bearer <access_token>`. El middleware obtiene la identidad mediante Supabase; el perfil se deriva del token y no de un campo `perfilId` enviado por el cliente.
- Los parámetros `:id` y `:monedaId` de recursos se validan como UUID. Los campos monetarios de entrada se envían como números JSON, sin separadores locales ni símbolos. Los DTO de salida con fechas se serializan a JSON como cadenas ISO 8601.
- Los esquemas estrictos rechazan propiedades adicionales. Las reglas particulares se indican en cada módulo. No se presupone que todos los endpoints admitan filtros o paginación.

Respuesta exitosa con contenido (200 o 201):

```json
{"exito": true, "datos": {}}
```

`datos` puede ser un objeto o una lista según el endpoint. Las operaciones con 204 no devuelven cuerpo.

Respuesta de error gestionada por el middleware global (ejemplo):

```json
{"exito": false, "mensaje": "Token de autenticación ausente", "errores": []}
```

| Estado | Significado |
| --- | --- |
| 200 | Consulta o actualización exitosa. |
| 201 | Creación o asignación exitosa. |
| 204 | Operación exitosa sin contenido. |
| 400 | Entrada rechazada por validación. `errores` contiene los detalles cuando corresponde a `ErrorDeValidacion`. |
| 401 | Autenticación ausente o inválida. |
| 403 | Operación prohibida por las reglas de acceso. |
| 404 | Recurso o perfil inexistente, según el servicio. |
| 409 | Conflicto con una regla de negocio o con el estado del recurso. |
| 500 | Error inesperado; en producción se evita exponer el mensaje interno. |
| 502 | Fallo del proveedor de autenticación durante la actualización de credenciales. |

Código de referencia: [rutas](../backend/src/routes/), [validaciones](../backend/src/validation/), [middleware de autenticación](../backend/src/middlewares/auth.middleware.ts), [middleware de validación](../backend/src/middlewares/validacion.middleware.ts), [manejo de errores](../backend/src/middlewares/errorHandler.ts) y [errores de dominio](../backend/src/errors/errores.ts).

## 2. Catálogo de endpoints

Todas las rutas de esta tabla se concatenan con `/api`. Los códigos indican el éxito esperado; los errores se detallan en las secciones siguientes.

| Método | Ruta | Objetivo | Éxito |
| --- | --- | --- | --- |
| GET | `/perfil` | Consultar el perfil propio | 200 |
| PATCH | `/perfil` | Modificar perfil o credenciales | 200 |
| GET | `/monedas` | Listar catálogo público | 200 |
| GET | `/perfil/monedas` | Listar monedas asignadas | 200 |
| POST | `/perfil/monedas` | Asignar moneda al perfil | 201 |
| DELETE | `/perfil/monedas/:monedaId` | Eliminar asignación | 204 |
| GET | `/movimientos` | Listar y filtrar movimientos propios | 200 |
| POST | `/movimientos` | Crear movimiento | 201 |
| GET | `/movimientos/:id` | Obtener movimiento propio | 200 |
| PATCH | `/movimientos/:id` | Actualizar movimiento | 200 |
| DELETE | `/movimientos/:id` | Eliminar movimiento | 204 |
| GET | `/categorias` | Listar categorías globales y propias | 200 |
| POST | `/categorias` | Crear categoría personalizada | 201 |
| GET | `/categorias/:id` | Obtener categoría accesible | 200 |
| PATCH | `/categorias/:id` | Actualizar categoría propia | 200 |
| DELETE | `/categorias/:id` | Eliminar categoría propia | 204 |
| GET | `/medios-pago` | Listar medios globales y propios | 200 |
| POST | `/medios-pago` | Crear medio de pago | 201 |
| PATCH | `/medios-pago/:id` | Actualizar medio propio | 200 |
| DELETE | `/medios-pago/:id` | Eliminar medio propio | 204 |
| GET | `/resumen` | Resumen financiero por período | 200 |
| GET | `/estadisticas` | Estadísticas agrupadas por moneda | 200 |
| GET | `/presupuestos` | Presupuestos y meta del período | 200 |
| POST | `/presupuestos` | Crear presupuesto | 201 |
| PATCH | `/presupuestos/:id` | Modificar límite mensual | 200 |
| DELETE | `/presupuestos/:id` | Eliminar presupuesto | 204 |
| PUT | `/presupuestos/meta` | Guardar meta de ahorro | 204 |

## 3. Perfil

Código: [rutas](../backend/src/routes/perfil.routes.ts), [esquema](../backend/src/validation/perfil.schema.ts), [servicio](../backend/src/services/perfil.service.ts), [servicio de credenciales](../backend/src/services/perfil-auth.service.ts).

### GET /api/perfil

Sin cuerpo ni filtros documentados. Obtiene el perfil autenticado y su correo de Auth. Devuelve 200 con `datos` de tipo `PerfilResponseDTO`:

```json
{"id":"perfil-ejemplo","nombre":"Ana","apellido":"Pérez","foto_perfil":null,"email":"ana@example.com","created_at":"2026-11-01T00:00:00.000Z","updated_at":"2026-11-01T00:00:00.000Z"}
```

Si no existe el perfil: 404.

### PATCH /api/perfil

Cuerpo con al menos un campo modificable:

| Campo | Validación |
| --- | --- |
| `nombre`, `apellido` | Texto no vacío, recortado, máximo 30 caracteres. |
| `foto_perfil` | Texto no vacío o `null`. |
| `email` | Correo válido. |
| `newPassword` | Texto de al menos 8 caracteres. |
| `currentPassword` | Obligatorio al enviar correo o nueva contraseña; no se admite solo. |

Ejemplo: `{"nombre":"Ana María"}`. Devuelve 200 con el perfil actualizado. Los cambios efectivos de credenciales verifican primero la contraseña actual con Supabase y luego actualizan el usuario de Auth. Si no hay cambios personales se conserva el perfil existente. No se devuelven contraseñas. Errores: 400 por cuerpo inválido, 401 por credenciales actuales requeridas en el servicio, 403 por contraseña incorrecta, 404 por perfil inexistente, 502 por fallo del proveedor. No constituye una transacción única entre Auth y PostgreSQL.

## 4. Monedas

Código: [rutas](../backend/src/routes/moneda.routes.ts), [validación](../backend/src/validation/moneda.schema.ts), [servicio](../backend/src/services/moneda.service.ts), [DTO](../backend/src/types/moneda.types.ts).

- `GET /api/monedas`: sin token; devuelve 200 y lista de monedas disponibles (`MonedaResponseDTO`: identificador, nombre, código y símbolo).
- `GET /api/perfil/monedas`: devuelve 200 y lista de monedas del perfil (`MonedaPerfilResponseDTO`, que incluye `esPrincipal` además de los datos de moneda); 404 si no existe el perfil.
- `POST /api/perfil/monedas`: cuerpo `{"monedaId":"11111111-1111-4111-8111-111111111111","esPrincipal":true}`. `monedaId` obligatorio UUID, `esPrincipal` booleano opcional. Devuelve 201 con la asignación; 400 por entrada inválida, 404 si no existe el perfil o la moneda. El repositorio gestiona la asignación.
- `DELETE /api/perfil/monedas/:monedaId`: UUID obligatorio; 204 sin cuerpo. Devuelve 404 si el perfil no existe o la moneda no está asignada. Elimina la asignación, no la moneda del catálogo.

## 5. Movimientos

Código: [rutas](../backend/src/routes/movimiento.routes.ts), [validación](../backend/src/validation/movimiento.schema.ts), [servicio](../backend/src/services/movimiento.service.ts), [repositorio](../backend/src/repositories/movimiento.repository.ts).

### GET /api/movimientos

Devuelve 200 con una lista de movimientos del perfil, ordenados por fecha descendente. Filtros opcionales:

| Parámetro | Validación |
| --- | --- |
| `fechaDesde`, `fechaHasta` | Fecha convertible a `Date`; desde no puede superar hasta. |
| `mes` | Entero de 1 a 12. |
| `anio` | Entero desde 1900 hasta el año actual según el esquema. |
| `montoMinimo`, `montoMaximo` | Números positivos; mínimo no puede superar máximo. |
| `categoriaId`, `monedaId`, `medioPagoId` | UUID. |
| `tipo` | `INGRESO` o `GASTO`. |

Los rangos admiten extremos iguales. El repositorio prioriza el intervalo de fechas explícito frente al filtro por mes/año, que se aplica cuando se envían ambos. Los parámetros adicionales y los rangos invertidos devuelven 400 desde la PR #34. Ejemplo: `GET /api/movimientos?mes=11&anio=2026&tipo=GASTO`.

### POST /api/movimientos

| Campo | Validación |
| --- | --- |
| `fecha` | Fecha válida, no posterior al día actual en `America/Argentina/Buenos_Aires`. Se compara el día calendario; no se prohíbe una hora posterior del mismo día. |
| `monto` | Número positivo. |
| `descripcion` | Texto de hasta 100 caracteres, opcional o nulo. |
| `monedaId`, `categoriaId` | UUID obligatorios. |
| `medioPagoId` | UUID opcional o nulo, sujeto a las reglas de negocio. |

Ejemplo:

```json
{"fecha":"2026-11-20","monto":2500,"descripcion":"Almuerzo","monedaId":"11111111-1111-4111-8111-111111111111","categoriaId":"22222222-2222-4222-8222-222222222222","medioPagoId":"33333333-3333-4333-8333-333333333333"}
```

Devuelve 201 con el movimiento. El tipo se deriva de la categoría, no de un campo `tipo` del cuerpo. La categoría debe existir y ser global o propia. Los gastos requieren un medio de pago válido y accesible; para ingresos se almacena `null` como medio de pago. Errores de validación 400, recurso asociado inexistente 404 y recurso ajeno 403, según el caso.

### GET, PATCH y DELETE /api/movimientos/:id

- GET devuelve 200 con el movimiento solicitado.
- PATCH acepta un subconjunto no vacío de los campos de creación y devuelve 200 con el movimiento actualizado. Conserva el medio de pago cuando corresponde; valida el estado resultante y lo elimina si el tipo pasa a ingreso. La fecha futura se rechaza también en PATCH.
- DELETE devuelve 204 sin cuerpo.
- El servicio verifica existencia (404) y pertenencia (403); la validación de identificadores y datos inválidos responde 400. Una actualización que pierde una modificación concurrente puede devolver 409 según el control del repositorio.

DTO de salida: `id`, `monto` (número), `fecha`, `descripcion` (texto o nulo), `perfilId`, `monedaId`, `categoriaId`, `medioPagoId` (UUID o nulo), `tipo`, `createdAt`, `updatedAt`. Los montos se mantienen en la moneda del movimiento; no se realiza una conversión implícita.

## 6. Categorías

Código: [rutas](../backend/src/routes/categoria.routes.ts), [esquema](../backend/src/validation/categoria.schema.ts), [servicio](../backend/src/services/categoria.service.ts).

- GET `/api/categorias`: 200, lista de globales y personalizadas del perfil.
- GET `/api/categorias/:id`: 200, categoría global o propia; 404 si no existe y 403 si es ajena.
- POST `/api/categorias`: 201, categoría personalizada; máximo ocho por perfil (409 al alcanzar el límite).
- PATCH `/api/categorias/:id`: 200, actualización parcial no vacía; no se permite cambiar el tipo si tiene movimientos asociados (409).
- DELETE `/api/categorias/:id`: 204, elimina categoría propia si no tiene movimientos asociados (409 en caso contrario). La relación de presupuestos tiene eliminación en cascada según el esquema de Prisma.

POST requiere `nombre` (1–30 caracteres), `color` (hexadecimal `#RRGGBB`) y `tipo` (`INGRESO` o `GASTO`). `icono` es opcional al crear y por defecto vale `tag`. Valores aceptados: `briefcase-business`, `trending-up`, `shopping-bag`, `wallet`, `utensils`, `car`, `zap`, `heart-pulse`, `graduation-cap`, `gamepad-2`, `tag`. PATCH admite los mismos campos como opcionales. Ejemplo: `{"nombre":"Estudio","color":"#A1B2C3","tipo":"GASTO","icono":"graduation-cap"}`.

DTO: `id`, `nombre`, `color`, `tipo`, `icono`, `perfilId` (nulo para categorías globales), `createdAt`, `updatedAt`. No se pueden modificar ni eliminar categorías globales ni ajenas (403). Identificadores/cuerpos inválidos: 400; inexistentes: 404.

## 7. Medios de pago

Código: [rutas](../backend/src/routes/medio-pago.routes.ts), [validación](../backend/src/validation/medio-pago.schema.ts), [servicio](../backend/src/services/medio-pago.service.ts).

- GET `/api/medios-pago`: 200 con lista de medios globales y propios.
- POST `/api/medios-pago`: 201 con el medio creado. Cuerpo obligatorio `nombre` (texto recortado de 1–40 caracteres), `icono` (texto recortado de 1–20 caracteres). Ejemplo: `{"nombre":"Billetera virtual","icono":"wallet"}`.
- PATCH `/api/medios-pago/:id`: 200 con el medio actualizado. Admite los mismos campos como opcionales, con al menos uno presente.
- DELETE `/api/medios-pago/:id`: 204 sin cuerpo.

DTO: `id`, `nombre`, `icono`, `id_perfil` (nulo para medios globales), `created_at`, `updated_at` (ISO). PATCH y DELETE validan UUID y rechazan modificaciones de medios del sistema o de otro perfil (403). Medio inexistente: 404; entrada inválida: 400. La relación con movimientos restringe el borrado en la base de datos; no se afirma un código HTTP específico para ese conflicto sin revisar el repositorio.

## 8. Resumen financiero

`GET /api/resumen?mes=11&anio=2026`

Código: [rutas](../backend/src/routes/resumen.routes.ts), [esquema](../backend/src/validation/resumen.schema.ts), [servicio](../backend/src/services/resumen.service.ts).

`mes` y `anio` son opcionales e independientes; si se omiten, el servicio toma el mes y año actuales del servidor. `mes` debe ser entero 1–12 y `anio` cuatro dígitos desde 2000. Se rechazan parámetros extra (400). El servicio exige una moneda principal configurada (409 si falta), consulta únicamente los movimientos del período en dicha moneda y acumula ingresos y gastos.

Ejemplo de respuesta 200 (datos ficticios):

```json
{"exito":true,"datos":{"totalIngresos":1000,"totalGastos":300,"balance":700,"moneda":"ARS"}}
```

`balance = totalIngresos - totalGastos`. No suma monedas distintas ni convierte montos. La diferencia de criterios de año entre este endpoint, movimientos y presupuestos queda registrada como mejora pendiente.

## 9. Estadísticas

`GET /api/estadisticas?fechaDesde=2026-11-01&fechaHasta=2026-11-30`

Código: [rutas](../backend/src/routes/estadisticas.routes.ts), [esquema](../backend/src/validation/estadisticas.schema.ts), [servicio](../backend/src/services/estadisticas.service.ts).

Ambos filtros son opcionales y deben ser fechas calendario reales `YYYY-MM-DD`. Se transforman al inicio y fin del día UTC respectivamente; si se envían ambos, desde no puede superar hasta. Se rechazan fechas y parámetros desconocidos (400). Respuesta 200: `datos.estadisticasPorMoneda` es un arreglo; si no existen movimientos, queda vacío. Cada elemento incluye:

| Campo | Contenido |
| --- | --- |
| `monedaId`, `codigoMoneda` | Identificación de moneda. |
| `gastosPorCategoria` | Lista de `categoriaId`, `categoriaNombre`, `total`, `porcentaje`. |
| `evolucionMensual` | Lista cronológica de `mes`, `ingresos`, `gastos`, `tasaAhorro`. |
| `promedioGastoDiario` | Promedio calculado por el servicio. |
| `tasaAhorro` | Tasa de ahorro del conjunto correspondiente. |

El agrupamiento por moneda evita sumar valores monetarios incompatibles. Las pruebas del servicio comprueban los casos sin datos, distribución por categorías, evolución mensual, filtros y separación de monedas.

## 10. Presupuestos y metas de ahorro

Incorporado en la PR #35. Todas las operaciones requieren autenticación.

Código: [rutas](../backend/src/routes/presupuesto.routes.ts), [controlador](../backend/src/controllers/presupuesto.controller.ts), [esquema](../backend/src/validation/presupuesto.schema.ts), [servicio](../backend/src/services/presupuesto.service.ts), [repositorio](../backend/src/repositories/presupuesto.repository.ts), [DTO](../backend/src/types/presupuesto.types.ts).

Los presupuestos se vinculan a una categoría de gasto y a la moneda principal del usuario en el período consultado. Un presupuesto es único por perfil, categoría, moneda, mes y año; una meta es única por perfil, moneda, mes y año. Los importes deben ser números entre 0,01 y 9.999.999.999,99 inclusive y admitir como máximo dos decimales. Los meses son enteros de 1 a 12 y los años enteros de 1900 a 9999. Los cuerpos y parámetros definidos en el esquema son estrictos.

### GET /api/presupuestos

Consulta `mes` y `anio`, ambos opcionales. Si no se envían, se utiliza el período actual según el reloj del servidor. Si se envía solo uno, el servicio devuelve 409; el formato o rango inválido devuelve 400. Si no hay moneda principal, devuelve 409. El servicio obtiene los presupuestos, la meta y el ahorro para el perfil, moneda principal y período.

Ejemplo de respuesta 200 (valores ficticios):

```json
{
  "exito": true,
  "datos": {
    "mes": 11,
    "anio": 2026,
    "moneda": {"id": "11111111-1111-4111-8111-111111111111", "codigo": "ARS", "simbolo": "$"},
    "totalLimiteMensual": 50000,
    "totalGastado": 20000,
    "totalDisponible": 30000,
    "porcentajeUsado": 40,
    "presupuestos": [
      {
        "id": "44444444-4444-4444-8444-444444444444",
        "monedaId": "11111111-1111-4111-8111-111111111111",
        "categoriaId": "22222222-2222-4222-8222-222222222222",
        "categoriaNombre": "Alimentación",
        "categoriaColor": "#A1B2C3",
        "limiteMensual": 50000,
        "gastoActual": 20000,
        "disponible": 30000,
        "porcentajeUsado": 40,
        "mes": 11,
        "anio": 2026,
        "createdAt": "2026-11-26T00:00:00.000Z",
        "updatedAt": "2026-11-26T00:00:00.000Z"
      }
    ],
    "metaAhorro": {"monto": 100000, "ahorroActual": 25000, "porcentajeCumplido": 25}
  }
}
```

`totalLimiteMensual` suma los límites de los presupuestos y `totalGastado` suma el gasto de esos presupuestos (no representa necesariamente todos los gastos del usuario). `totalDisponible` es la diferencia; `porcentajeUsado = totalGastado / totalLimiteMensual * 100`, o 0 si el límite total es 0. `metaAhorro` es `null` si no se configuró una meta. El porcentaje de cumplimiento es `max(0, ahorroActual / monto * 100)` y puede superar 100. El cálculo de `ahorroActual` se delega al repositorio.

### POST /api/presupuestos

Cuerpo obligatorio:

```json
{"categoriaId":"22222222-2222-4222-8222-222222222222","monedaId":"11111111-1111-4111-8111-111111111111","limiteMensual":50000,"mes":11,"anio":2026}
```

`categoriaId` y `monedaId` son UUID; se aplican los límites de importes y período anteriores. Devuelve 201 con `PresupuestoDTO` (la estructura de cada elemento de `presupuestos` del ejemplo). Errores: 400 por validación, 404 por categoría inexistente, 403 por categoría de otro perfil, 409 si no hay moneda principal, si la moneda enviada no coincide con la principal o si la categoría es de ingreso. La unicidad del presupuesto está protegida en la base de datos; el manejo HTTP exacto de una duplicación depende del repositorio, no revisado en este cierre.

### PATCH /api/presupuestos/:id

Cuerpo obligatorio `{"limiteMensual":60000}`; no se admite modificar moneda, categoría o período. Devuelve 200 con el presupuesto actualizado. 400 por UUID o importe inválido; 404 si no se encuentra el presupuesto para el perfil; 409 si falta moneda principal o si el presupuesto corresponde a otra moneda.

### DELETE /api/presupuestos/:id

UUID obligatorio; sin cuerpo. Devuelve 204. El servicio delega la eliminación al repositorio con `id` y `perfilId`. El detalle de errores de persistencia y la eliminación de un ID inexistente requieren comprobar ese repositorio; no se documenta un resultado no verificado.

### PUT /api/presupuestos/meta

Guarda la meta para la moneda y período, mediante el servicio de presupuestos:

```json
{"monto":100000,"monedaId":"11111111-1111-4111-8111-111111111111","mes":11,"anio":2026}
```

Todos los campos son obligatorios. Devuelve 204 sin cuerpo. 400 por datos inválidos; 409 si no existe moneda principal o si cambió respecto de la moneda enviada. La meta puede consultarse después mediante GET `/api/presupuestos`. No existe una ruta independiente GET o DELETE de metas en el router revisado.

## 11. Verificación de contratos y límites de esta referencia

Ejecutar `pnpm test` desde la raíz; para probar solo el módulo nuevo:

```powershell
pnpm --filter backend exec vitest run tests/integration/presupuesto.routes.test.ts tests/unit/presupuesto.schema.test.ts tests/unit/presupuesto.service.test.ts
```

La ejecución del 27/11/2026 registró 189 pruebas aprobadas en backend (29 archivos) y 35 en frontend (15 archivos). Las pruebas de integración HTTP con dependencias simuladas no sustituyen una prueba de persistencia o aislamiento real con Supabase. Para comprobar los contratos manualmente utilizar una instancia de desarrollo, dos perfiles de prueba, tokens válidos y recursos propios; no compartir credenciales en documentación ni capturas.

La referencia se basa en los archivos revisados y no en una ejecución de cada endpoint contra la base real. Los DTO y validaciones son la referencia de implementación; donde faltó inspeccionar un repositorio se indicaron sus límites explícitamente. Mantener este documento junto a los cambios de rutas, reglas y respuestas de cada PR.
