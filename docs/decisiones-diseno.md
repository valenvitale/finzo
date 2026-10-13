# Decisiones de Diseño y Registro de Refactorización — Finzo

## Introducción y Propósito

En el marco del desarrollo del backend de **Finzo**, este documento registra el análisis técnico, el diagnóstico de calidad de código y las decisiones de diseño arquitectónico tomadas sobre el sistema. El objetivo principal fue transformar una base de código heterogénea en una arquitectura mantenible, desacoplada, testeable y robusta frente a problemas reales de infraestructura y concurrencia.

---

## 1. Código Analizado

El análisis se centró en la comparación estructural entre dos módulos centrales del sistema y en la arquitectura del backend:

*   **Módulo de Categorías (Módulo analizado y refactorizado):**
    *   Repositorio: [`backend/src/repositories/categoria.repository.ts`](../backend/src/repositories/categoria.repository.ts)
    *   Servicio: [`backend/src/services/categoria.service.ts`](../backend/src/services/categoria.service.ts)
    *   Controlador: [`backend/src/controllers/categoria.controller.ts`](../backend/src/controllers/categoria.controller.ts)
    *   Rutas y Composición: [`backend/src/routes/categoria.routes.ts`](../backend/src/routes/categoria.routes.ts)
    *   Esquemas de Validación: [`backend/src/validation/categoria.schema.ts`](../backend/src/validation/categoria.schema.ts)
    *   Contratos y DTOs: [`backend/src/types/categoria.types.ts`](../backend/src/types/categoria.types.ts) y [`frontend/src/types/categoria.types.ts`](../frontend/src/types/categoria.types.ts)

*   **Módulo de Movimientos (Módulo tomado como referencia arquitectónica):**
    *   Repositorio: [`backend/src/repositories/movimiento.repository.ts`](../backend/src/repositories/movimiento.repository.ts)
    *   Servicio: [`backend/src/services/movimiento.service.ts`](../backend/src/services/movimiento.service.ts)
    *   Controlador: [`backend/src/controllers/movimiento.controller.ts`](../backend/src/controllers/movimiento.controller.ts)
    *   Rutas y Composición: [`backend/src/routes/movimiento.routes.ts`](../backend/src/routes/movimiento.routes.ts)

*   **Infraestructura Transversal y Servicios Conectados:**
    *   Conexión a Base de Datos (Singleton y Adapter): [`backend/src/config/prisma.ts`](../backend/src/config/prisma.ts)
    *   Middlewares (Autenticación, Validación y Errores): [`backend/src/middlewares/`](../backend/src/middlewares/)
    *   Consumo de Servicios en Cliente: [`frontend/src/services/medio-pago.service.ts`](../frontend/src/services/medio-pago.service.ts)

---

## 2. Diagnóstico

Al revisar el código con el equipo, notamos una discrepancia importante: mientras el módulo de **Movimientos** seguía un diseño por capas limpio y desacoplado, el módulo de **Categorías** presentaba varios problemas de diseño, code smells y riesgos técnicos que afectaban la mantenibilidad del proyecto:

### 2.1 Filtración del modelo de base de datos a capas superiores (Falta de DTOs y ACL)
En la versión inicial de Categorías, el repositorio devolvía directamente los tipos generados por Prisma (`Categoria`), exponiendo los nombres de las columnas en *snake_case* (`id_perfil`, `created_at`, `updated_at`). 
*   **Problema de diseño:** Se violaba el encapsulamiento. Cualquier cambio futuro en el esquema de base de datos obligaba a cambiar los servicios, los controladores y hasta las interfaces de React en el frontend (*Shotgun Surgery*).
*   **Contraste:** Movimientos utilizaba DTOs explícitos (`MovimientoResponseDTO`) y un método de mapeo interno que aislaba la base de datos del resto del sistema.

### 2.2 Omisión del Singleton de base de datos y riesgo de saturación de conexiones
El constructor inicial de `CategoriaRepository` exigía obligatoriamente que se le pasara un cliente por parámetro (`constructor(private prisma: PrismaClient)`), sin vincular la instancia centralizada.
*   **Impacto de infraestructura:** En Node.js con PostgreSQL, abrir clientes adicionales de Prisma abre nuevos pools de sockets (`pg.Pool`). En un entorno de desarrollo con recargas continuas de código (*hot reload*), esto genera conexiones huérfanas que saturan rápidamente el límite de conexiones del motor (`max_connections`), provocando caídas del servidor (*Connection Pool Exhaustion*).
*   **Contraste:** Movimientos permitía inyección de dependencias pero asignaba por defecto el Singleton global (`constructor(prismaClient: PrismaClient = prismaSingleton)`).

### 2.3 Acoplamiento rígido en el controlador (Imposibilidad de testear)
El controlador original de Categorías no estaba estructurado como una clase con dependencias inyectables, sino como funciones sueltas que instanciaban directamente al servicio en el cuerpo del archivo (`const categoriaService = new CategoriaService(...)`).
*   **Violación de Principio:** Se violaba el principio de Inversión de Dependencias (DIP). Era imposible escribir pruebas unitarias para el controlador sin levantar una base de datos real, porque no había forma de inyectar un doble de prueba (*mock* o *stub*).

### 2.4 Mezcla de responsabilidades en la validación (Violación de SRP)
En Categorías, las rutas no validaban los identificadores recibidos por parámetro (`:id`). En su lugar, el controlador invocaba a mano una función auxiliar `obtenerCategoriaId(req)` para comprobar si el string era válido antes de operar.
*   **Problema:** Se mezclaban validaciones sintácticas de entrada HTTP con la orquestación del caso de uso.
*   **Contraste:** Movimientos utilizaba middlewares declarativos con esquemas Zod en las rutas, rechazando de inmediato las peticiones malformadas antes de que tocaran el controlador (*Fail-Fast*).

### 2.5 Inconsistencia en la interfaz pública (Violación del Principio de Menor Sorpresa)
Existía una disparidad innecesaria en la nomenclatura y orden de parámetros entre módulos vecinos:
*   Búsquedas: `obtenerPorId` en Movimientos vs `buscarPorId` en Categorías.
*   Listados: `listarPorPerfil(perfilId)` en Movimientos vs `listar(idPerfil)` en Categorías.
*   Orden en servicios: Movimientos recibía `(id, perfilId, datos)` mientras Categorías recibía `(idPerfil, id, datos)`.
Esta inconsistencia aumentaba la carga cognitiva y propiciaba errores al invocar métodos cruzados entre servicios.

---

## 3. Alternativas Consideradas

Frente al diagnóstico, evaluamos tres caminos posibles:

### Alternativa 1: Conservar el código como estaba ("No tocar lo que ya funciona")
*   **Enfoque:** Dejar Categorías funcionando con sus funciones sueltas y tipos provisionales.
*   **Evaluación:** Aunque no requería tiempo de desarrollo inmediato, fue descartada porque consolidaba una deuda técnica creciente. Impedía testear unitariamente el controlador, dejaba el riesgo de saturación de conexiones abierto y complicaba la integración cuando `MovimientoService` necesitó validar categorías.

### Alternativa 2: Refactorización parcial (Repositorios y Servicios solamente)
*   **Enfoque:** Estandarizar únicamente el repositorio y el servicio agregando DTOs, pero mantener el controlador con la instancia fija en el archivo.
*   **Evaluación:** Descartada por ser una solución a medias. No resolvía la imposibilidad de testear el controlador de forma aislada y mantenía las validaciones manuales dispersas.

### Alternativa 3: Refactorización integral alineada al estándar de Movimientos (Opción Elegida)
*   **Enfoque:** Migrar Categorías a una arquitectura basada en clases con Inyección de Dependencias, DTOs formales, Data Mappers internos, uso del Singleton de Prisma con fallback, middlewares de validación declarativos en rutas y suite de pruebas unitarias 100% aisladas en memoria.
*   **Justificación:** Logra que todo el backend hable el mismo idioma conceptual. Facilita la incorporación de cualquier desarrollador al código, garantiza la estabilidad de la base de datos y permite una cobertura de pruebas automatizadas sólida y rápida.

---

## 4. Decisión Fundamentada y Patrones de Diseño Aplicados

Se decidió implementar la **Alternativa 3**. A continuación se detalla cómo se organizó la solución y qué patrones y principios respaldan cada parte del código:

### 4.1 Patrones Creacionales

*   **Singleton (Gestión de Recursos Compartidos):**
    *   *Implementación:* En [`backend/src/config/prisma.ts`](../backend/src/config/prisma.ts) y [`backend/src/config/supabase.ts`](../backend/src/config/supabase.ts).
    *   *Justificación:* Garantiza que toda la aplicación comparta una única instancia de `PrismaClient` conectada al pool de PostgreSQL (`pg.Pool`), evitando abrir sockets innecesarios y previniendo fugas de memoria en desarrollo.
*   **Factory / Factory Method (Fábricas de Middlewares y Excepciones):**
    *   *Implementación:* Las funciones `validarCuerpo` y `validarParametros` en [`backend/src/middlewares/validacion.middleware.ts`](../backend/src/middlewares/validacion.middleware.ts) actúan como fábricas que generan handlers de Express preconfigurados para esquemas específicos. De igual modo, la jerarquía de errores en [`backend/src/errors/errores.ts`](../backend/src/errors/errores.ts) fabrica excepciones tipadas (`ErrorNoEncontrado`, `ErrorDeConflicto`, `ErrorDeValidacion`) con su código HTTP correspondiente.

### 4.2 Patrones Estructurales

*   **Adapter (Adaptador):**
    *   *Implementación:* En [`backend/src/config/prisma.ts`](../backend/src/config/prisma.ts) mediante `new PrismaPg(pool)`.
    *   *Justificación:* Adapta el pool nativo de `node-postgres` al contrato de controlador que espera Prisma para ejecutar consultas optimizadas.
*   **Data Mapper / Anti-Corruption Layer (Capa Anti-Corrupción):**
    *   *Implementación:* Métodos privados `mapearADto` en [`backend/src/repositories/movimiento.repository.ts`](../backend/src/repositories/movimiento.repository.ts) y [`backend/src/repositories/categoria.repository.ts`](../backend/src/repositories/categoria.repository.ts).
    *   *Justificación:* Traduce entidades crudas en *snake_case* a DTOs normalizados en *camelCase*. Si la base de datos cambia nombres de columnas, el impacto queda confinado a esa función y no rompe las capas superiores ni el frontend.
*   **Facade (Fachada):**
    *   *Implementación:* 
        *   `apiRouter` en [`backend/src/routes/index.ts`](../backend/src/routes/index.ts) unifica los submódulos de la API en un único punto de entrada.
        *   `listarMediosPago` en [`frontend/src/services/medio-pago.service.ts`](../frontend/src/services/medio-pago.service.ts), ocultando al cliente la resolución del token JWT, las cabeceras HTTP y el parseo de respuestas.
        *   Barrel pattern en [`frontend/src/components/common/index.ts`](../frontend/src/components/common/index.ts) para exponer los componentes de interfaz.
*   **Decorator / Interceptor:**
    *   *Implementación:* [`backend/src/middlewares/auth.middleware.ts`](../backend/src/middlewares/auth.middleware.ts) intercepta la petición entrante, verifica el token y decora el objeto `req` inyectando la identidad del usuario (`req.user`).

### 4.3 Patrones de Comportamiento y Arquitectura

*   **Repository Pattern (Patrón Repositorio):**
    *   *Implementación:* Interfaces `ICategoriaRepository` en [`backend/src/repositories/categoria.repository.ts`](../backend/src/repositories/categoria.repository.ts) e `IMovimientoRepository` en [`backend/src/repositories/movimiento.repository.ts`](../backend/src/repositories/movimiento.repository.ts) implementadas por sus respectivas clases concretas. Abstraen las operaciones de lectura y persistencia desacoplando la lógica de negocio de la tecnología de almacenamiento.
*   **Dependency Injection (Inyección de Dependencias) & DIP:**
    *   *Implementación:* Los servicios reciben sus repositorios por constructor (ej. `CategoriaService` en [`backend/src/services/categoria.service.ts`](../backend/src/services/categoria.service.ts) depende de `ICategoriaRepository`). Los controladores reciben sus servicios por constructor (ej. `CategoriaController` en [`backend/src/controllers/categoria.controller.ts`](../backend/src/controllers/categoria.controller.ts)).
*   **Composition Root (Raíz de Composición):**
    *   *Implementación:* Al inicio de cada archivo de rutas (como [`backend/src/routes/categoria.routes.ts`](../backend/src/routes/categoria.routes.ts) y [`backend/src/routes/movimiento.routes.ts`](../backend/src/routes/movimiento.routes.ts)). Es el único lugar donde se ensambla el grafo de objetos (`Repository → Service → Controller`).
*   **Chain of Responsibility (Cadena de Responsabilidad):**
    *   *Implementación:* Pipeline de middlewares en Express. Una petición pasa sucesivamente por CORS, parseo JSON, autenticación, validación de parámetros, validación de cuerpo, controlador, y en caso de error, es capturada por el manejador global en [`backend/src/middlewares/errorHandler.ts`](../backend/src/middlewares/errorHandler.ts).
*   **Strategy (Estrategia):**
    *   *Implementación:* Los esquemas Zod en [`backend/src/validation/categoria.schema.ts`](../backend/src/validation/categoria.schema.ts) definen estrategias de validación independientes que el middleware genérico consume de forma polimórfica sin conocer su estructura interna.
*   **Data Transfer Object (DTO):**
    *   *Implementación:* Contratos formales en [`backend/src/types/categoria.types.ts`](../backend/src/types/categoria.types.ts) (`CrearCategoriaDTO`, `ActualizarCategoriaDTO`, `CategoriaResponseDTO`).

### 4.4 Resumen de Alineación con Principios SOLID

| Principio SOLID | Cómo se cumple en la solución refactorizada |
| :--- | :--- |
| **S - Responsabilidad Única** | Middlewares validan y autentican; Controladores manejan protocolo HTTP; Servicios aplican reglas de negocio (ej. límite de 8 categorías); Repositorios acceden a datos. |
| **O - Abierto / Cerrado** | Se pueden añadir nuevos filtros de búsqueda o esquemas de validación sin modificar la lógica base de los middlewares ni alterar los repositorios existentes. |
| **L - Sustitución de Liskov** | En los tests unitarios, cualquier implementación simulada (mock) de `ICategoriaRepository` sustituye a la real sin romper el comportamiento esperado de `CategoriaService`. |
| **I - Segregación de Interfaces** | Las interfaces (`ICategoriaRepository`, `IMovimientoRepository`, `IMonedaRepository`) definen exclusivamente los métodos que su dominio requiere, sin obligar a implementar métodos ajenos. |
| **D - Inversión de Dependencias** | `CategoriaService` y `MovimientoService` dependen de abstracciones (`ICategoriaRepository`) y no de implementaciones concretas de Prisma ni de instancias fijas. |

---

## 5. Evidencia y Trade-offs

### 5.1 Evidencia en el Código y Verificación Automatizada

La efectividad de las decisiones tomadas se verifica directamente en la suite de pruebas del proyecto:

1.  **Suite de pruebas 100% en verde:**
    *   Se crearon suites dedicadas para cada capa desacoplada:
        *   [`backend/tests/unit/categoria.repository.test.ts`](../backend/tests/unit/categoria.repository.test.ts) (8 tests): Comprueba el mapeo a DTO, altas, bajas, conteo de personalizadas y persistencia.
        *   [`backend/tests/unit/categoria.service.test.ts`](../backend/tests/unit/categoria.service.test.ts) (10 tests): Valida reglas de negocio puras (límite de 8 categorías, permisos sobre categorías del sistema o de terceros, y bloqueo de borrado si existen movimientos asociados) usando dobles de prueba (`vi.fn()`) sin tocar la base de datos.
        *   [`backend/tests/unit/categoria.controller.test.ts`](../backend/tests/unit/categoria.controller.test.ts) (6 tests): Valida respuestas HTTP (200, 201, 204), manejo de usuario autenticado y delegación adecuada al middleware de error.
    *   El total del backend cuenta con **63 tests unitarios pasando exitosamente** en Vitest.
2.  **Integración limpia entre módulos:**
    *   En [`backend/src/services/movimiento.service.ts`](../backend/src/services/movimiento.service.ts), `MovimientoService` puede inyectar `ICategoriaRepository` para validar que la categoría indicada exista y pertenezca al usuario antes de registrar un movimiento, colaborando a través de contratos claros.
3.  **Salud del código:**
    *   El proyecto compila sin errores de tipos en TypeScript estricto (`tsc`) y supera todas las reglas de ESLint y Prettier.

### 5.2 Beneficios Obtenidos

*   **Estabilidad y escalabilidad del servidor:** Al compartir el Singleton de Prisma Client respaldado por un único `pg.Pool`, se eliminó el riesgo de agotar las conexiones disponibles de PostgreSQL (*connection exhaustion*), asegurando un uso predecible de memoria y CPU.
*   **Facilidad de mantenimiento y coherencia cognoscitiva:** Quien comprende el flujo de Movimientos entiende de inmediato Categorías o Medios de Pago. La arquitectura homogénea reduce el tiempo de desarrollo de nuevas funcionalidades.
*   **Pruebas rápidas y confiables:** Al no depender de la base de datos para probar la lógica de controladores y servicios, las 63 pruebas unitarias se ejecutan en milisegundos en cualquier entorno de integración.
*   **Detección temprana de errores (*Fail-Fast*):** Parámetros inválidos o cuerpos de petición incompletos son rechazados de inmediato en la capa de rutas mediante middlewares Zod con HTTP 400, evitando llamadas infructuosas a la base de datos.

### 5.3 Costos y Compromisos Asumidos (Trade-offs)

Ninguna decisión de ingeniería es gratuita. Para lograr estos beneficios se asumieron los siguientes costos:

1.  **Mayor volumen de código inicial (*Boilerplate*):**
    *   Crear interfaces explícitas, clases controladoras, DTOs y mappers requiere escribir más archivos y líneas de código que un enfoque directo con funciones sueltas y tipos implícitos.
    *   *Balance:* Es un costo que se paga una sola vez al inicio, pero ahorra horas de depuración y refactorización a mediano y largo plazo.
2.  **Tiempo de refactorización cruzada:**
    *   Al cambiar las respuestas del backend a *camelCase* uniforme (`perfilId`), fue necesario sincronizar coordinadamente los tipos del frontend ([`frontend/src/types/categoria.types.ts`](../frontend/src/types/categoria.types.ts)).
    *   *Balance:* Se eliminó la fricción de manejar nombres de variables mezclados en React, logrando una API consistente y predecible.

---

## 6. Conclusión

La refactorización del módulo de Categorías y la consolidación de los patrones creacionales, estructurales y de comportamiento en Finzo no respondieron a un ejercicio teórico, sino a la resolución de problemas reales: riesgo de saturación de base de datos, código imposible de testear y desorganización de capas. 

El resultado final es una base de código profesional, alineada a los principios SOLID y Clean Code, respaldada por evidencia empírica en pruebas automatizadas y lista para su defensa en el Taller II.
