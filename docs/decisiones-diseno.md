# Decisiones de Diseño y Registro de Refactorización

## Contexto y Motivación

En el marco del desarrollo del backend de **Finzo** (Taller II: Diseño, patrones justificados, SOLID, refactoring y mantenibilidad), se analizó la consistencia arquitectónica entre los módulos del sistema. Se constató que la implementación inicial del módulo de Categorías (ticket `KAN-94`) introdujo discrepancias estructurales, de nomenclatura y de contratos de datos respecto al estándar y patrón de diseño establecido en el módulo de Movimientos.

Este documento registra el análisis técnico, diagnóstico fundamentado en principios de diseño, alternativas evaluadas, decisiones adoptadas y la evidencia empírica de la refactorización integral.

---

## 1. Código Analizado

Se examinaron las clases, interfaces, esquemas y módulos de las diferentes capas del backend y sus correspondencias en frontend:

| Capa                    | Módulo Movimientos (Referencia)                     | Módulo Categorías (Analizado / Refactorizado)                                                                  |
| :---------------------- | :-------------------------------------------------- | :------------------------------------------------------------------------------------------------------------- |
| **Repositorio**         | `backend/src/repositories/movimiento.repository.ts` | `backend/src/repositories/categoria.repository.ts`                                                             |
| **Servicio**            | `backend/src/services/movimiento.service.ts`        | `backend/src/services/categoria.service.ts`                                                                    |
| **Controlador**         | `backend/src/controllers/movimiento.controller.ts`  | `backend/src/controllers/categoria.controller.ts`                                                              |
| **Rutas y Composición** | `backend/src/routes/movimiento.routes.ts`           | `backend/src/routes/categoria.routes.ts`                                                                       |
| **Validación (Zod)**    | `backend/src/validation/movimiento.schema.ts`       | `backend/src/validation/categoria.schema.ts`                                                                   |
| **Tipos y DTOs**        | `backend/src/types/movimiento.types.ts`             | `backend/src/types/categoria.types.ts` y `frontend/src/types/categoria.types.ts`                               |
| **Modelo de Dominio**   | `backend/src/models/movimiento.model.ts`            | `backend/src/models/categoria.model.ts`                                                                        |
| **Pruebas Unitarias**   | `backend/tests/unit/movimiento.repository.test.ts`  | `backend/tests/unit/categoria.repository.test.ts`, `categoria.service.test.ts`, `categoria.controller.test.ts` |

---

## 2. Diagnóstico

### 2.1 Hallazgos y Desvíos Detectados

1. **Ruptura del Patrón DTO y Fuga de Tipos de Persistencia (Information Hiding / Encapsulamiento):**
   - En `movimientoRepository`, todos los métodos reciben y retornan DTOs formalmente tipados (`CrearMovimientoDTO`, `MovimientoResponseDTO`), aislando el esquema relacional de Prisma de las capas superiores mediante una función de transformación privada (`mapearADto`).
   - En `categoriaRepository`, el repositorio retornaba directamente entidades de base de datos o interfaces de modelo (`Categoria[]`, `Categoria`), filtrando nombres de columnas en _snake_case_ (`id_perfil`, `created_at`, `updated_at`) hacia capas superiores. Además, definía tipos locales _ad-hoc_ (`CrearCategoriaDatos`, `ActualizarCategoriaDatos`) en lugar de consumir las interfaces canónicas de `types/categoria.types.ts`.

2. **Inyección de Dependencias Incompleta en el Repositorio:**
   - `MovimientoRepository` provee un valor por defecto en su constructor (`constructor(prismaClient: PrismaClient = prismaSingleton)`), facilitando su instanciación en producción y admitiendo inyección de mocks para pruebas unitarias.
   - `CategoriaRepository` exigía obligatoriamente el cliente Prisma en su constructor (`constructor(private prisma: PrismaClient)`), impidiendo una instanciación transparente en el composition root de rutas.

3. **Inconsistencia de Nomenclatura y Contratos (Principio de Menor Sorpresa):**
   - Búsqueda por identificador: `obtenerPorId` en Movimientos vs. `buscarPorId` en Categorías.
   - Listado por usuario: `listarPorPerfil(perfilId)` en Movimientos vs. `listar(idPerfil)` en Categorías.
   - Nombres de parámetros: `perfilId` (camelCase estándar) vs. `idPerfil` / `idCategoria`.
   - Orden de parámetros en servicios: en `MovimientoService`, las operaciones de mutación reciben `(id, perfilId, datos)` o `(id, perfilId)`; en `CategoriaService` se recibía `(idPerfil, id, datos)` e `(idPerfil, id)`.

4. **Acoplamiento Fuerte y Falta de Clases en Controladores:**
   - `MovimientoController` está implementado como una clase con inyección de dependencias (`MovimientoService`), métodos bound como arrow functions y desacople total del framework HTTP para pruebas.
   - `CategoriaController` exportaba funciones sueltas y creaba una instancia singleton global de `CategoriaService` directamente a nivel de módulo (`const categoriaService = new CategoriaService(new CategoriaRepository(prisma))`). Esto generaba un acoplamiento estático que impedía probar el controlador de manera aislada con mocks del servicio.

5. **Validación Dispersa vs. Validación en Pipeline de Middlewares:**
   - En el módulo de Movimientos, los identificadores de ruta (`:id`) y los cuerpos de petición son validados declarativamente en la definición de rutas mediante middlewares Zod (`validarParametros(movimientoIdParamsSchema)`, `validarCuerpo(...)`).
   - En Categorías, las rutas no validaban el parámetro `:id` mediante middleware; en su lugar, el controlador invocaba manualmente una función imperativa `obtenerCategoriaId(req)` que lanzaba errores ad-hoc si `id` no era string.

6. **Error de Resolución de Módulos ESM:**
   - `categoria.service.ts` importaba el repositorio con extensión TypeScript explícita (`from '../repositories/categoria.repository.ts'`), lo cual infringe la resolución de módulos ECMAScript / NodeNext donde las importaciones relativas deben compilar con sufijo `.js`.

### 2.2 Conceptos de Ingeniería Aplicados

- **Single Responsibility Principle (SRP):** El controlador solo orquesta peticiones HTTP y respuestas; los middlewares validan esquemas; el servicio concentra las reglas de negocio; el repositorio gestiona exclusivamente el acceso a datos.
- **Dependency Inversion Principle (DIP):** Las capas superiores dependen de abstracciones (`ICategoriaRepository`), no de implementaciones concretas ni de instancias globales fijas.
- **Data Transfer Object (DTO) & Anti-Corruption Layer (ACL):** Normalización de datos en la frontera del repositorio mediante `mapearADto`, desacoplando el modelo relacional físico (`id_perfil`, snake_case) del modelo expuesto por la API (`perfilId`, camelCase, fechas `Date` nativas).
- **Composition Root Pattern:** La instanciación y ensamblado de dependencias (`Repository → Service → Controller`) se centraliza ordenadamente al inicio del archivo de rutas de cada módulo.

---

## 3. Alternativas Consideradas

### Alternativa 1: Conservar la implementación heterogénea existente

- **Descripción:** Mantener `categoria.repository.ts`, `categoria.service.ts` y `categoria.controller.ts` con funciones sueltas y tipos propios creados en KAN-94.
- **Evaluación:** Aunque no requería esfuerzo inmediato de codificación, perpetuaba una deuda técnica crítica: inconsistencia de interfaces, nombres incompatibles entre módulos, imposibilidad de mockear el controlador en tests unitarios e impedimento de interoperabilidad fluida (por ejemplo, `MovimientoService` no podía consumir limpiamente `ICategoriaRepository` al no coincidir el método `obtenerPorId`).

### Alternativa 2: Refactorización integral alineada al patrón de Movimientos (Opción Elegida)

- **Descripción:** Estandarizar el módulo de Categorías al patrón de clases con inyección de dependencias, DTOs explícitos, mappers privados, nombres canónicos (`obtenerPorId`, `listarPorPerfil`), validación por esquemas Zod en rutas y pruebas unitarias aisladas para cada capa.
- **Evaluación:** Elimina la fricción entre módulos, asegura homogeneidad arquitectónica en todo el backend, facilita la incorporación de nuevos desarrolladores al proyecto y permite alcanzar una cobertura de pruebas exhaustiva.

### Alternativa 3: Enfoque parcial (solo repositorios y contratos, sin refactorizar controladores)

- **Descripción:** Ajustar únicamente los métodos de `CategoriaRepository` y `CategoriaService`, conservando el controlador funcional y el singleton estático.
- **Evaluación:** Insuficiente. Dejaba el controlador acoplado a la base de datos real a través del singleton estático, impidiendo probarlo de forma unitaria y manteniendo la duplicación de validación imperativa en lugar de usar middlewares declarativos.

---

## 4. Decisiones Tomadas

| Componente                              | Antes de la Refactorización                                                                                                                  | Decisión Aplicada                                                                                                                                                          | Justificación                                                                                                             |
| :-------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| `ICategoriaRepository`                  | Interfaces `CrearCategoriaDatos`, `ActualizarCategoriaDatos` locales; retorno de modelo `Categoria`. Métodos `buscarPorId`, `listar`.        | Contrato formal usando `CrearCategoriaDTO`, `ActualizarCategoriaDTO`, `CategoriaResponseDTO`. Métodos `obtenerPorId`, `listarPorPerfil`.                                   | Homogeneidad con `IMovimientoRepository`, desacoplamiento del modelo de BD y cumplimiento de DIP.                         |
| `CategoriaRepository`                   | `constructor(private prisma: PrismaClient)`. Sin mapper.                                                                                     | `constructor(prismaClient: PrismaClient = prismaSingleton)`. Inclusión de `mapearADto(categoria)`.                                                                         | Inyección flexible (pruebas vs. producción) y conversión uniforme de propiedades relacionales a camelCase.                |
| `CategoriaService`                      | Inyección de dependencia no readonly, orden de argumentos `(idPerfil, id, datos)`, acceso directo a `id_perfil`, import con extensión `.ts`. | Propiedad `private readonly categoriaRepository: ICategoriaRepository`, métodos `actualizar(id, perfilId, datos)`, `eliminar(id, perfilId)`, `obtenerPorId(id, perfilId)`. | Tipado estricto, inmutabilidad de dependencias, consistencia con `MovimientoService` y corrección de imports ESM (`.js`). |
| `CategoriaController`                   | Módulo procedural con singleton estático de servicio y funciones exportadas (`listarCategorias`, etc.). Validación manual de ID.             | Clase `CategoriaController` con `categoriaService` inyectado por constructor y arrow properties (`crear`, `obtenerPorId`, `actualizar`, `eliminar`, `listar`).             | Testabilidad aislada mediante mocks, inversión de control y delegación de validación a middlewares.                       |
| `categoria.routes.ts`                   | Sin composición visible de dependencias. Rutas `PATCH` y `DELETE` sin validar parámetro `:id`.                                               | Composición explícita (`new Repository → new Service → new Controller`). Validación estricta con `validarParametros(categoriaIdParamsSchema)`.                             | Centralización del composition root y fail-fast antes de llegar al controlador.                                           |
| `categoria.schema.ts`                   | Solo esquemas de cuerpo. Sin esquema de parámetros ni inferencia de tipos.                                                                   | Agregado de `categoriaIdParamsSchema` (UUID), refinamiento en `actualizarCategoriaSchema` (mínimo 1 campo) y tipos inferidos (`z.infer`).                                  | Paridad con `movimiento.schema.ts` y protección contra payloads vacíos.                                                   |
| `MovimientoService`                     | Comentarios pendientes esperando la interfaz de Categorías (`KAN-94`).                                                                       | Inyección opcional de `ICategoriaRepository` y validación de existencia y pertenencia en `validarRelaciones`.                                                              | Conexión real entre módulos planificada en la arquitectura base.                                                          |
| `frontend/src/types/categoria.types.ts` | DTO con campos snake_case (`id_perfil`).                                                                                                     | Actualizado a DTO con `perfilId: string                                                                                                                                    | null`, alineado con la respuesta serializada de la API.                                                                   | Coherencia en el contrato cliente-servidor. |

---

## 5. Evidencia y Trade-offs

### 5.1 Evidencia en Código y Pruebas Automatizadas

1. **Compilación estricta y suite de pruebas:**
   - La suite completa de pruebas unitarias pasó de 37 tests a **63 tests en backend** (11 archivos de prueba) y 1 test en frontend, todos ejecutándose en verde con `vitest run`.
   - Se crearon suites completas de pruebas unitarias dedicadas:
     - `backend/tests/unit/categoria.repository.test.ts` (8 pruebas que validan mapeo DTO, creación, actualización, borrado, listado filtrado y contadores).
     - `backend/tests/unit/categoria.service.test.ts` (10 pruebas que validan límite de 8 categorías, permisos sobre categorías predeterminadas y ajenas, restricciones de integridad referencial con movimientos).
     - `backend/tests/unit/categoria.controller.test.ts` (6 pruebas que validan códigos HTTP 200, 201, 204, rechazo por falta de autenticación y mapeo de errores al middleware central).
   - Verificación de tipos (`tsc`) y linters (`eslint`, `prettier`) completados con cero advertencias y cero errores en todo el monorepo.

2. **Integración con Movimientos:**
   - `MovimientoService` ahora valida que la categoría indicada al registrar un movimiento exista y pertenezca al usuario autenticado (o sea predeterminada del sistema), evitando inconsistencias previas a la persistencia.

### 5.2 Beneficios Obtenidos

- **Mantenibilidad y Legibilidad:** Cualquier desarrollador que comprenda el flujo de `movimientos` puede entender y mantener de inmediato `categorias`, ya que comparten idéntica estructura de capas, signaturas y convenciones de nombres.
- **Testabilidad Aislada:** El controlador y el servicio pueden probarse al 100% en memoria mediante dobles de prueba (`vi.fn()`), sin requerir conexión a base de datos.
- **Robustez de Contratos (API Consistency):** La API responde uniformemente con objetos camelCase (`{ exito: true, datos: { id, nombre, color, tipo, perfilId, createdAt, updatedAt } }`), simplificando el consumo en React.
- **Prevención de Errores Tempranos (Fail-Fast):** Las peticiones con identificadores malformados o payloads inválidos son interceptadas inmediatamente por los middlewares de validación Zod con respuestas HTTP 400 uniformes antes de consumir tiempo de procesamiento en servicios o bases de datos.

### 5.3 Costos y Trade-offs Asumidos

- **Costo de Refactorización:** Requirió reescribir de forma coordinada el repositorio, servicio, controlador, rutas, tipos y esquemas de validación de categorías, así como sincronizar los tipos del frontend.
- **Archivos Modificados:** Al adaptar el contrato de datos a camelCase (`perfilId`), se requirió actualizar las interfaces de frontend (`frontend/src/types/categoria.types.ts`) para mantener la coherencia transversal.
- **Conclusión:** Los costos asumidos se amortizan de forma inmediata al garantizar la estabilidad arquitectónica requerida para la defensa técnica de Taller II y el escalado hacia las siguientes etapas del proyecto.
