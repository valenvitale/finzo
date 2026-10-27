# Decisiones de Diseño y Registro de Refactorización — Finzo

# Objetivo
Analizamos dos módulos reales del backend de FINZO para mejorar la claridad del código, reducir el acoplamiento y facilitar las pruebas. Relacionamos los cambios con code smells, refactoring, Clean Code y SOLID, tal como se trabajó en clase.

---

## CASO 1 - Módulo de Categorías

### Código Analizado:
**Módulo de Categorías (Módulo analizado y refactorizado):**
- [`backend/src/repositories/categoria.repository.ts`](../backend/src/repositories/categoria.repository.ts)
- [`backend/src/services/categoria.service.ts`](../backend/src/services/categoria.service.ts)
- [`backend/src/controllers/categoria.controller.ts`](../backend/src/controllers/categoria.controller.ts)
- [`backend/src/routes/categoria.routes.ts`](../backend/src/routes/categoria.routes.ts)
- [`backend/src/validation/categoria.schema.ts`](../backend/src/validation/categoria.schema.ts)
- [`backend/src/types/categoria.types.ts`](../backend/src/types/categoria.types.ts)

Tomamos el módulo de Movimientos como referencia para mantener una estructura similar entre módulos.

**Módulo de Movimientos (Módulo tomado como referencia arquitectónica):**
- [`backend/src/repositories/movimiento.repository.ts`](../backend/src/repositories/movimiento.repository.ts)
- [`backend/src/services/movimiento.service.ts`](../backend/src/services/movimiento.service.ts)
- [`backend/src/controllers/movimiento.controller.ts`](../backend/src/controllers/movimiento.controller.ts)
- [`backend/src/routes/movimiento.routes.ts`](../backend/src/routes/movimiento.routes.ts)

**Infraestructura Transversal y Servicios Conectados:**
- **Conexión a Base de Datos (Singleton y Adapter):** [`backend/src/config/prisma.ts`](../backend/src/config/prisma.ts)
- **Middlewares (Autenticación, Validación y Errores):** [`backend/src/middlewares/`](../backend/src/middlewares/)
- **Consumo de Servicios en Cliente:** [`frontend/src/services/medio-pago.service.ts`](../frontend/src/services/medio-pago.service.ts)

### Problemas detectados (Code Smells):
- **Acoplamiento:** el controlador creaba su propio CategoriaService, lo que dificultaba reemplazarlo por un objeto simulado en las pruebas.
- **Responsabilidades mezcladas:** el controlador validaba manualmente los identificadores recibidos por HTTP.
- **Dependencia de la base de datos:** se exponían tipos y nombres de campos de Prisma (snake_case) a otras capas.
- **Inconsistencias:** algunos métodos de Categorías y Movimientos tenían nombres y órdenes de parámetros distintos.

### Alternativas consideradas
1. **No modificar nada:** era más rápido, pero mantenía los problemas.
2. **Cambiar solo repositorio y servicio:** mejoraba parte del diseño, pero dejaba el controlador acoplado.
3. **Refactorizar las capas del módulo:** fue la opción elegida porque resolvía los problemas principales.

### Cambios realizados
- Incorporamos interfaces e inyección de dependencias para que controladores y servicios reciban sus colaboradores.
- Separamos la validación HTTP mediante esquemas Zod y middlewares.
- Incorporamos DTOs y mapeos para no exponer directamente el modelo de Prisma.
- Unificamos criterios de nombres y organización con el módulo de Movimientos.
- Reutilizamos la configuración centralizada de Prisma para gestionar el acceso a la base de datos.

### Relación con la materia
- **SRP (responsabilidad única):** validación, lógica de negocio, HTTP y persistencia quedan en componentes diferentes.
- **DIP (inversión de dependencias):** las capas superiores pueden depender de interfaces en lugar de construir implementaciones concretas.
- **Clean Code:** nombres y responsabilidades más claros; menor necesidad de conocer detalles de Prisma fuera del repositorio.
- **Refactoring:** reorganizamos el código para mejorar su mantenimiento sin reescribir el módulo desde cero.
- **Repository y DTO/Data Mapper:** ayudan a separar la persistencia de los datos que utiliza la aplicación.

### Evidencia y costos
Los archivos de Categorías y sus pruebas unitarias permiten mostrar la separación de responsabilidades y el uso de dobles de prueba. La refactorización agrega interfaces, clases y mapeos: hay más código inicial, pero es más sencillo modificar y probar cada parte.

---

## CASO 2 - Endpoint de Resumen

### Código analizado:
**Módulo de Resumen (Módulo analizado y refactorizado):**
- [backend/src/controllers/resumen.controller.ts](../backend/src/controllers/resumen.controller.ts)
- [backend/src/services/resumen.service.ts](../backend/src/services/resumen.service.ts)
- [backend/src/routes/resumen.routes.ts](../backend/src/routes/resumen.routes.ts)
- [backend/src/validation/resumen.schema.ts](../backend/src/validation/resumen.schema.ts)
- [backend/src/middlewares/validacion.middleware.ts](../backend/src/middlewares/validacion.middleware.ts)

Se conservaron versiones del código anterior en [docs/resumen-controller.md](../docs/resumen-controller.md) y [docs/resumen.routes.md](../docs/resumen.routes.md) para comparar el antes y el después.

### Problemas detectados (code smells)
- **Acoplamiento:** el controlador creaba directamente new ResumenService().
- **Responsabilidades mezcladas:** además de atender la petición, comprobaba manualmente el mes y el año.
- **Validación difícil de leer:** utilizaba condiciones extensas y conversiones dentro del controlador.

### Alternativas consideradas
1. **Dejarlo como estaba:** no requería cambios, pero mantenía el acoplamiento.
2. **Extraer solo la validación:** mejoraba la claridad, pero no resolvía la dependencia directa del servicio.
3. **Extraer la validación e inyectar el servicio:** fue la opción elegida.

### Cambios Realizados:

**Antes:**
``` typescript
const resumenService = new ResumenService();
```

**Ahora:**
``` typescript
export class ResumenController {
  constructor(private readonly resumenService: IResumenService) {}
}
```
Ahora `resumen.routes.ts` crea el servicio y se lo pasa al controlador. La validación de mes y anio se realiza con `resumenQuerySchema` y `validarQuery` antes de ejecutar el controlador.

### Relación con la materia
- **DIP**: el controlador depende de IResumenService, no de una instancia creada internamente.
- **SRP**: el esquema Zod define las reglas de validación; el controlador coordina la petición; el servicio calcula el resumen.
- **Clean Code**: el código expresa mejor su intención y evita una condición extensa dentro del controlador.
- **Refactoring**: mejoramos la estructura manteniendo la lógica de cálculo financiero.

**Importante:** la validación también cambió un detalle: ahora se rechazan parámetros de consulta adicionales y el formato del error de validación es distinto. Esto es un cambio de comportamiento, no refactoring puro.

### Evidencia y costos

Agregamos 10 pruebas para controlador, esquema y ruta. En la última ejecución registrada, el backend completó **102 pruebas aprobadas en 18 archivos.**

El costo principal fue incorporar una interfaz, un esquema y una configuración adicional en rutas. A cambio, el controlador puede probarse con un servicio simulado y la validación queda separada.

---

## CASO 3 — Tipado Seguro de Express sin `any` ni Verbosidad (Declaration Merging)

### Código Analizado:
- [`backend/src/middlewares/auth.middleware.ts`](../backend/src/middlewares/auth.middleware.ts)
- [`backend/src/types/express.d.ts`](../backend/src/types/express.d.ts)
- [`backend/src/controllers/movimiento.controller.ts`](../backend/src/controllers/movimiento.controller.ts)
- [`backend/src/controllers/categoria.controller.ts`](../backend/src/controllers/categoria.controller.ts)

### Problemas detectados (Code Smells y Linter):
- **Uso explícito de `any`:** `AuthenticatedRequest` redeclaraba los parámetros genéricos de Express con valores por defecto `= any` (`ResBody = any, ReqBody = any, ReqQuery = any`), disparando la regla `@typescript-eslint/no-explicit-any` de ESLint.
- **Sobre-ingeniería y firmas verbosas:** Se intentó crear interfaces combinatorias auxiliares (`RequestParamsBody`, `RequestParamsQuery`), lo que multiplicaba tipos innecesarios y sobrecargaba las firmas de los métodos.
- **Incompatibilidad de parámetros en Express 5:** En Express 5 (`@types/express` v5), los parámetros de ruta (`req.params`) son por defecto `Record<string, string | string[]>`. Si se usa el tipo nativo sin especificar el parámetro genérico `P`, `req.params.id` infiere como `string | string[]`, generando errores de asignación con los métodos de servicios y repositorios que esperan estrictamente un `string`.

### Alternativas consideradas:
1. **Desactivar la regla de ESLint (`// eslint-disable-next-line`):** Ocultaba la advertencia pero violaba las políticas de calidad estricta del proyecto.
2. **Reemplazar `any` por `unknown` en los 4 genéricos:** Obligaba a escribir firmas kilométricas en cada controlador (`req: AuthenticatedRequest<Params, unknown, DTO, unknown>`) o a realizar casteos forzados con `as` dentro de cada método.
3. **Declaration Merging + Type Alias `Request<P = Record<string, string>>`:** Fue la opción elegida. Extiende la interfaz nativa `Express.Request` con `user?:` de manera limpia mediante Module Augmentation en `backend/src/types/express.d.ts`, y define `AuthenticatedRequest<P = Record<string, string>> = Request<P>` sin ningún `any`.

### Cambios realizados:
- Se creó el archivo [`backend/src/types/express.d.ts`](../backend/src/types/express.d.ts) para extender el espacio de nombres global `Express.Request` con la identidad autenticada (`user?: { id: string; email: string }`).
- Se refactorizó [`backend/src/middlewares/auth.middleware.ts`](../backend/src/middlewares/auth.middleware.ts): `authMiddleware` ahora recibe `req: Request` nativo y se eliminaron todos los defaults con `any` y los tipos auxiliares redundantes.
- Se preservó el alias `AuthenticatedRequest<P = Record<string, string>> = Request<P>`, garantizando que `req.params.id` sea reconocido como `string` simple en toda la capa de controladores sin requerir casteos manuales.

### Relación con la materia:
- **Clean Code / Legibilidad:** Firmas limpias, uniformes y concisas en una sola línea en todos los controladores.
- **ISP (Segregación de Interfaces):** Los controladores no están obligados a depender de parámetros genéricos que no necesitan.
- **Type Safety y Fail Fast:** La verificación en tiempo de ejecución la realiza Zod en las rutas y se proyecta a TypeScript de forma segura sin `any` ni supresiones de tipos.

### Evidencia y costos:
- `pnpm lint` ejecuta con 0 errores y 0 advertencias en todo el monorepo.
- `pnpm --filter backend build` (`tsc`) compila exitosamente el 100% del código.
- Los 102 tests unitarios y de integración continúan pasando en verde sin regresiones.

---

## CASO 4 — Arquitectura en Frontend: Separación de Responsabilidades en la Tabla de Movimientos

### Código Analizado:
- [`frontend/src/components/movimientos/TablaMovimientos.tsx`](../frontend/src/components/movimientos/TablaMovimientos.tsx)
- [`frontend/src/pages/Movimientos.tsx`](../frontend/src/pages/Movimientos.tsx)
- [`frontend/src/hooks/useMovimientos.ts`](../frontend/src/hooks/useMovimientos.ts)

### Problema planteado:
Al momento de construir la tabla de movimientos, surgió una duda de diseño fundamental:  
**¿Quién debe hacerse cargo de mostrar el spinner de carga (`cargando`) y el cartel de error (`error`)?**  
¿Le pasamos esa información a la tabla para que ella decida qué mostrar en pantalla, o dejamos que la página principal lo controle y que la tabla solo se dedique a pintar filas?

### Alternativas consideradas:

1. **Modalidad 1: Tabla autónoma (control interno de estados)**  
   La tabla recibe `movimientos`, `cargando` y `error`. Adentro del componente se colocan varios `if` para mostrar `<Cargando />`, `<MensajeError />` o `<EstadoVacio />`.  
   - *Punto a favor:* La página contenedora tiene menos líneas de código porque le delega todo a la tabla.  
   - *Punto en contra:* La tabla queda sobrecargada de responsabilidades. Si la red está lenta, la tabla borra todo su espacio para poner un spinner gigante, ocultando el contexto. Además, si queríamos usar esa misma tabla en otra pantalla (como en el Dashboard para ver los últimos movimientos), nos obligaba a lidiar con estados de carga que quizás en esa pantalla se manejaban de otra forma.

2. **Modalidad 2: Tabla pura / presentacional (control en la página contenedora) — Elegida**  
   La tabla solo recibe la lista de datos (`movimientos`) y los eventos de acción (`onEditar`, `onEliminar`). No sabe de llamadas a la red ni de fallos de internet. La página principal (`Movimientos.tsx`) usa el hook `useMovimientos`, sabe cuándo mostrar el spinner o el error, y recién cuando los datos están listos se los pasa a la tabla para que los dibuje.

### ¿Por qué elegimos la Modalidad 2?

- **Responsabilidad Única (SRP):** La tabla hace una sola cosa y la hace bien: recibir movimientos y mostrarlos de forma clara (con montos en verde para ingresos, rojo para gastos y botones de acción). No se mezcla con la lógica de red.
- **Mejor experiencia visual (UX):** En la pantalla de movimientos, la barra de filtros y el botón "+ Nuevo Movimiento" se quedan fijos arriba. Cuando el usuario cambia un filtro, no parpadea toda la pantalla; solo la zona de la tabla muestra la carga.
- **Reutilización real en otras pantallas:** Mañana podemos usar este mismo componente en el Dashboard para mostrar los últimos 5 movimientos sin tener que inventar errores ni estados que no corresponden.
- **Pruebas más fáciles:** Hacer un test unitario de la tabla es facilísimo: solo le pasamos dos movimientos inventados por props y comprobamos que se vean bien, sin necesidad de simular hooks ni llamadas a la API.

### Relación con la materia:
- **SRP (Responsabilidad Única):** Separamos la presentación pura (la tabla) de la coordinación y lógica de estado (la página y el hook).
- **Clean Code y Bajo Acoplamiento:** Componentes simples, con props directas, fáciles de leer y que no dependen de cómo ni de dónde vinieron los datos.

---

## Conclusión

En FINZO analizamos dos módulos reales del backend: **Categorías y Resumen**, con el objetivo de mejorar la calidad del código, facilitar su mantenimiento y conservar diseños similares entre los modulos.

En ambos casos identificamos problemas de diseño, como el **acoplamiento entre componentes** y la **mezcla de responsabilidades**. Para resolverlos, realizamos refactorizaciones aplicando principalmente los principios **SRP (Responsabilidad Única)** y **DIP (Inversión de Dependencias)**.

También utilizamos **inyección de dependencias, interfaces, DTOs y validaciones con Zod** para organizar mejor el código y facilitar las pruebas.

Evaluamos los patrones de diseño estudiados en clase, pero decidimos no incorporar patrones adicionales cuando no existía una necesidad concreta, evitando agregar complejidad innecesaria.

Los cambios se respaldaron con pruebas automatizadas, alcanzando **102 tests aprobados** en la última ejecución.

**En conclusión, el objetivo no fue aplicar patrones por obligación, sino identificar problemas reales, evaluar alternativas y tomar decisiones fundamentadas para conseguir un código más claro, desacoplado, testeable y mantenible.**