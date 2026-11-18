# API de Finzo

Especificación de la API REST del MVP. El backend escucha en la URL configurada para el servidor y expone sus recursos bajo el prefijo `/api`.

## Convenciones

- Los cuerpos y las respuestas usan JSON (`Content-Type: application/json`).
- Salvo `GET /api/monedas`, los endpoints requieren autenticación con Supabase. Enviar `Authorization: Bearer <access_token>`.
- Los identificadores son UUID, excepto que se indique lo contrario.
- Las fechas se reciben como cadenas que JavaScript pueda interpretar como fecha (se recomienda ISO 8601) y se devuelven serializadas como ISO 8601.
- Las respuestas exitosas con contenido siguen el formato `{ "exito": true, "datos": ... }`. Las operaciones `DELETE` devuelven `204 No Content` sin cuerpo.
- Los objetos de entrada que usan esquemas estrictos rechazan propiedades adicionales. En los filtros de movimientos las propiedades desconocidas se ignoran.

## Errores

Los errores siguen este formato. `errores` contiene los detalles de validación cuando el error es `400`; en los demás casos suele ser un arreglo vacío.

```json
{
  "exito": false,
  "mensaje": "Los datos enviados no son válidos",
  "errores": ["monto: El monto debe ser un número positivo"]
}
```

| HTTP  | Significado                            |
| ----- | -------------------------------------- |
| `400` | Cuerpo, parámetros o filtros inválidos |
| `401` | Falta el token o es inválido/expiró    |
| `403` | Operación no permitida                 |
| `404` | Recurso inexistente                    |
| `409` | Conflicto con el estado actual         |
| `500` | Error interno del servidor             |

En producción, los errores internos se responden con el mensaje `Error interno del servidor`.

## Perfiles

### `GET /api/perfil`

Obtiene el perfil autenticado.

**Headers:** `Authorization: Bearer <access_token>`.

**Respuesta `200`:**

```json
{
  "exito": true,
  "datos": {
    "id": "0ccfb6f4-73a0-4ea6-9ba9-178fb727f004",
    "nombre": "Ana",
    "apellido": "Pérez",
    "foto_perfil": null,
    "email": "ana@example.com",
    "created_at": "2026-10-05T02:08:11.000Z",
    "updated_at": "2026-10-05T02:08:11.000Z"
  }
}
```

**Errores:** `401`, `404`, `500`.

### `PATCH /api/perfil`

Actualiza uno o más datos del perfil. Debe enviarse al menos un campo modificable.

**Headers:** `Authorization: Bearer <access_token>`, `Content-Type: application/json`.

**Body:** objeto estricto con uno o más campos:

| Campo             | Tipo            | Reglas                                                      |
| ----------------- | --------------- | ----------------------------------------------------------- |
| `nombre`          | string          | Opcional; recortado, entre 1 y 30 caracteres                |
| `apellido`        | string          | Opcional; recortado, entre 1 y 30 caracteres                |
| `foto_perfil`     | string o `null` | Opcional; si es string, no puede quedar vacío al recortarlo |
| `email`           | string          | Opcional; debe ser un correo válido                         |
| `currentPassword` | string          | Opcional; obligatorio al cambiar correo o contraseña        |
| `newPassword`     | string          | Opcional; mínimo 8 caracteres                               |

`currentPassword` solo puede enviarse junto con `email` o `newPassword`.

```json
{
  "nombre": "Ana María",
  "foto_perfil": null
}
```

**Respuesta `200`:** mismo formato de perfil que en `GET /api/perfil`.

**Errores:** `400`, `401`, `404`, `500`.

## Monedas

### `GET /api/monedas`

Lista las monedas disponibles para asignar. No requiere autenticación.

**Headers:** ninguno requerido.

**Respuesta `200`:**

```json
{
  "exito": true,
  "datos": [
    { "id": "8ac4c86f-b25e-4e31-b88b-d2e9fb7a5c1f", "nombre": "Peso argentino", "codigo": "ARS", "simbolo": "$" }
  ]
}
```

**Errores:** `500`.

### `GET /api/perfil/monedas`

Lista las monedas asignadas al perfil autenticado. Cada elemento contiene `id`, `nombre`, `codigo`, `simbolo` y `esPrincipal` (booleano).

**Headers:** `Authorization: Bearer <access_token>`.

**Respuesta `200`:**

```json
{
  "exito": true,
  "datos": [
    {
      "id": "8ac4c86f-b25e-4e31-b88b-d2e9fb7a5c1f",
      "nombre": "Peso argentino",
      "codigo": "ARS",
      "simbolo": "$",
      "esPrincipal": true
    }
  ]
}
```

**Errores:** `401`, `404`, `500`.

### `POST /api/perfil/monedas`

Asigna una moneda al perfil. Si todavía no hay una moneda principal, la asignación será principal automáticamente.

**Headers:** `Authorization: Bearer <access_token>`, `Content-Type: application/json`.

**Body:**

| Campo         | Tipo    | Reglas                                                       |
| ------------- | ------- | ------------------------------------------------------------ |
| `monedaId`    | string  | UUID requerido                                               |
| `esPrincipal` | boolean | Opcional; si es `true`, establece esta moneda como principal |

```json
{ "monedaId": "8ac4c86f-b25e-4e31-b88b-d2e9fb7a5c1f", "esPrincipal": true }
```

**Respuesta `201`:** objeto de moneda asignada, como en `GET /api/perfil/monedas`.

**Errores:** `400`, `401`, `404`, `409`, `500`.

### `DELETE /api/perfil/monedas/{monedaId}`

Quita del perfil la asignación de la moneda indicada. Si se elimina la principal y quedan otras, se promueve otra moneda automáticamente.

**Headers:** `Authorization: Bearer <access_token>`.

**Parámetros de ruta:** `monedaId` (UUID).

**Respuesta `204`:** sin cuerpo.

**Errores:** `400`, `401`, `404`, `500`.

## Movimientos

Todos los endpoints de movimientos requieren autenticación.

### `POST /api/movimientos`

Crea un movimiento.

**Headers:** `Authorization: Bearer <access_token>`, `Content-Type: application/json`.

**Body:**

| Campo         | Tipo            | Reglas                               |
| ------------- | --------------- | ------------------------------------ |
| `fecha`       | string          | Fecha válida; se recomienda ISO 8601 |
| `monto`       | number          | Mayor que cero                       |
| `descripcion` | string o `null` | Opcional; máximo 100 caracteres      |
| `monedaId`    | string          | UUID                                 |
| `categoriaId` | string          | UUID                                 |
| `medioPagoId` | string          | UUID                                 |

```json
{
  "fecha": "2026-11-18T12:00:00.000Z",
  "monto": 1250.5,
  "descripcion": "Almuerzo",
  "monedaId": "8ac4c86f-b25e-4e31-b88b-d2e9fb7a5c1f",
  "categoriaId": "e6f4c00a-0257-4e3e-a30c-4a0feb4a15b8",
  "medioPagoId": "dc409902-3854-41bf-b04a-6aec7e2a861a"
}
```

**Respuesta `201`:**

```json
{
  "exito": true,
  "datos": {
    "id": "4e366c0b-f2ae-4a33-b38b-3818c717adad",
    "fecha": "2026-11-18T12:00:00.000Z",
    "monto": 1250.5,
    "descripcion": "Almuerzo",
    "perfilId": "0ccfb6f4-73a0-4ea6-9ba9-178fb727f004",
    "monedaId": "8ac4c86f-b25e-4e31-b88b-d2e9fb7a5c1f",
    "categoriaId": "e6f4c00a-0257-4e3e-a30c-4a0feb4a15b8",
    "medioPagoId": "dc409902-3854-41bf-b04a-6aec7e2a861a",
    "tipo": "GASTO",
    "createdAt": "2026-11-18T12:00:00.000Z",
    "updatedAt": "2026-11-18T12:00:00.000Z"
  }
}
```

**Errores:** `400`, `401`, `404`, `409`, `500`.

### `GET /api/movimientos`

Lista movimientos del perfil autenticado. Se ordenan por fecha descendente.

**Headers:** `Authorization: Bearer <access_token>`.

**Query parameters opcionales:**

| Parámetro                                | Tipo    | Reglas                     |
| ---------------------------------------- | ------- | -------------------------- |
| `fechaDesde`, `fechaHasta`               | fecha   | Fechas válidas             |
| `mes`                                    | integer | Entre 1 y 12               |
| `anio`                                   | integer | Entre 1900 y el año actual |
| `montoMinimo`, `montoMaximo`             | number  | Mayor que cero             |
| `categoriaId`, `monedaId`, `medioPagoId` | UUID    | Filtran por identificador  |
| `tipo`                                   | string  | `INGRESO` o `GASTO`        |

Si se proporciona al menos uno entre `fechaDesde` y `fechaHasta`, ese rango se utiliza en lugar del filtro combinado `mes` + `anio`. `mes` y `anio` filtran por período cuando ambos están presentes.

**Respuesta `200`:** arreglo de movimientos, con los mismos campos que el objeto `datos` de `POST /api/movimientos`.

```json
{ "exito": true, "datos": [] }
```

**Errores:** `400`, `401`, `500`.

### `GET /api/movimientos/{id}`

Obtiene un movimiento del perfil autenticado.

**Headers:** `Authorization: Bearer <access_token>`.

**Parámetros de ruta:** `id` (UUID).

**Respuesta `200`:** un objeto movimiento, con el formato de `POST /api/movimientos`.

**Errores:** `400`, `401`, `404`, `500`.

### `PATCH /api/movimientos/{id}`

Actualiza los campos enviados; al menos uno es requerido. El body admite los mismos campos y reglas que el `POST`, todos opcionales.

**Headers:** `Authorization: Bearer <access_token>`, `Content-Type: application/json`.

**Parámetros de ruta:** `id` (UUID).

**Ejemplo de body:**

```json
{ "monto": 1400, "descripcion": "Almuerzo actualizado" }
```

**Respuesta `200`:** un objeto movimiento actualizado, con el formato de `POST /api/movimientos`.

**Errores:** `400`, `401`, `404`, `409`, `500`.

### `DELETE /api/movimientos/{id}`

Elimina un movimiento del perfil autenticado.

**Headers:** `Authorization: Bearer <access_token>`.

**Parámetros de ruta:** `id` (UUID).

**Respuesta `204`:** sin cuerpo.

**Errores:** `401`, `404`, `500`.

## Categorías

Todos los endpoints de categorías requieren autenticación. La lista incluye categorías globales y las propias del perfil.

### `GET /api/categorias`

**Headers:** `Authorization: Bearer <access_token>`.

**Respuesta `200`:** arreglo de categorías. Cada elemento tiene `id`, `nombre`, `color`, `tipo` (`INGRESO` o `GASTO`), `icono`, `perfilId` (UUID o `null` para categorías globales), `createdAt` y `updatedAt`.

```json
{
  "exito": true,
  "datos": [
    {
      "id": "e6f4c00a-0257-4e3e-a30c-4a0feb4a15b8",
      "nombre": "Comida",
      "color": "#A1B2C3",
      "tipo": "GASTO",
      "icono": "utensils",
      "perfilId": null,
      "createdAt": "2026-10-05T02:08:11.000Z",
      "updatedAt": "2026-10-05T02:08:11.000Z"
    }
  ]
}
```

**Errores:** `401`, `500`.

### `POST /api/categorias`

Crea una categoría personalizada.

**Headers:** `Authorization: Bearer <access_token>`, `Content-Type: application/json`.

**Body:** `nombre` (string recortado de 1 a 30 caracteres), `color` (hexadecimal `#RRGGBB`), `tipo` (`INGRESO` o `GASTO`) e `icono` (opcional; uno de `briefcase-business`, `trending-up`, `shopping-bag`, `wallet`, `utensils`, `car`, `zap`, `heart-pulse`, `graduation-cap`, `gamepad-2`, `tag`; por defecto `tag`). No admite propiedades adicionales.

```json
{ "nombre": "Comida", "color": "#A1B2C3", "tipo": "GASTO", "icono": "utensils" }
```

**Respuesta `201`:** una categoría con el formato de `GET /api/categorias` (el `perfilId` será el del usuario).

**Errores:** `400`, `401`, `403`, `409`, `500`.

### `GET /api/categorias/{id}`

**Headers:** `Authorization: Bearer <access_token>`.

**Parámetros de ruta:** `id` (UUID).

**Respuesta `200`:** una categoría con el formato de `GET /api/categorias`.

**Errores:** `400`, `401`, `404`, `500`.

### `PATCH /api/categorias/{id}`

Actualiza una categoría personalizada. El body admite los campos del `POST` (todos opcionales, incluido `icono`) y requiere al menos uno.

**Headers:** `Authorization: Bearer <access_token>`, `Content-Type: application/json`.

**Parámetros de ruta:** `id` (UUID).

**Ejemplo de body:**

```json
{ "nombre": "Alimentos", "icono": "utensils" }
```

**Respuesta `200`:** categoría actualizada, con el formato de `GET /api/categorias`.

**Errores:** `400`, `401`, `403`, `404`, `409`, `500`.

### `DELETE /api/categorias/{id}`

Elimina una categoría personalizada.

**Headers:** `Authorization: Bearer <access_token>`.

**Parámetros de ruta:** `id` (UUID).

**Respuesta `204`:** sin cuerpo.

**Errores:** `401`, `403`, `404`, `409`, `500`.

## Medios de pago

Todos los endpoints de medios de pago requieren autenticación. La lista incluye medios globales y los propios del perfil. Cada elemento de respuesta tiene `id`, `nombre`, `icono`, `id_perfil` (UUID o `null` para medios globales), `created_at` y `updated_at`.

### `GET /api/medios-pago`

**Headers:** `Authorization: Bearer <access_token>`.

**Respuesta `200`:**

```json
{
  "exito": true,
  "datos": [
    {
      "id": "dc409902-3854-41bf-b04a-6aec7e2a861a",
      "nombre": "Efectivo",
      "icono": "wallet",
      "id_perfil": null,
      "created_at": "2026-10-05T02:08:11.000Z",
      "updated_at": "2026-10-05T02:08:11.000Z"
    }
  ]
}
```

**Errores:** `401`, `500`.

### `POST /api/medios-pago`

Crea un medio de pago personalizado.

**Headers:** `Authorization: Bearer <access_token>`, `Content-Type: application/json`.

**Body:** objeto estricto con `nombre` (string recortado de 1 a 40 caracteres) e `icono` (string recortado de 1 a 20 caracteres), ambos requeridos.

```json
{ "nombre": "Billetera virtual", "icono": "wallet" }
```

**Respuesta `201`:** un medio de pago con el formato de `GET /api/medios-pago` (el `id_perfil` será el del usuario).

**Errores:** `400`, `401`, `409`, `500`.

### `PATCH /api/medios-pago/{id}`

Actualiza un medio de pago personalizado. Body estricto con `nombre` y/o `icono` (mismas reglas que el `POST`); requiere al menos uno.

**Headers:** `Authorization: Bearer <access_token>`, `Content-Type: application/json`.

**Parámetros de ruta:** `id` (identificador del medio de pago; esta ruta no valida formato UUID).

**Ejemplo de body:**

```json
{ "nombre": "Billetera" }
```

**Respuesta `200`:** medio de pago actualizado, con el formato de `GET /api/medios-pago`.

**Errores:** `400`, `401`, `403`, `404`, `409`, `500`.

### `DELETE /api/medios-pago/{id}`

Elimina un medio de pago personalizado.

**Headers:** `Authorization: Bearer <access_token>`.

**Parámetros de ruta:** `id` (identificador del medio de pago; esta ruta no valida formato UUID).

**Respuesta `204`:** sin cuerpo.

**Errores:** `401`, `403`, `404`, `409`, `500`.

## Resumen

### `GET /api/resumen`

Obtiene los totales del período en la moneda principal. Si se omiten los parámetros, usa el mes y año actuales.

**Headers:** `Authorization: Bearer <access_token>`.

**Query parameters opcionales:**

| Parámetro | Tipo    | Reglas                     |
| --------- | ------- | -------------------------- |
| `mes`     | integer | Entre 1 y 12               |
| `anio`    | integer | Cuatro dígitos, desde 2000 |

```text
/api/resumen?mes=11&anio=2026
```

**Respuesta `200`:**

```json
{
  "exito": true,
  "datos": {
    "totalIngresos": 50000,
    "totalGastos": 12500.5,
    "balance": 37499.5,
    "moneda": "ARS"
  }
}
```

**Errores:** `400`, `401`, `409` (el perfil no tiene una moneda principal configurada), `500`.
