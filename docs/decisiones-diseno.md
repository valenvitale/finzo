# Decisiones de Diseño y Registro de Refactorización — Finzo

# Objetivo
Analizamos casos del backend y del frontend de FINZO para mejorar la claridad del código, reducir el acoplamiento y facilitar las pruebas. Relacionamos los cambios con code smells, refactoring, Clean Code y SOLID, tal como se trabajó en clase.

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

## CASO 3 — Tipado Seguro en Express y Usuario Autenticado

### El problema

Al crear una categoría, el controlador necesita el cuerpo de la petición y el ID del usuario autenticado. Antes, usábamos `as` para decirle a TypeScript qué tipo debía asumir para el cuerpo.

```typescript
const datosCategoria = req.body as CrearCategoriaDTO;
```

Esa instrucción solo afecta al compilador. Si llega un campo con un valor inválido, la comprobación tiene que ocurrir cuando se recibe la petición. Además, para incluir `req.user` en el tipo de Express habíamos creado una definición larga con varios `any`.

### Qué decidimos

La ruta valida los datos con Zod antes de ejecutar el controlador. Por ejemplo, al crear una categoría, `validarCuerpo(crearCategoriaSchema)` comprueba el cuerpo de la petición. Si los datos son válidos, el middleware los deja en `req.body`. Si son inválidos, devuelve un error de validación. [Ruta de Categorías](../backend/src/routes/categoria.routes.ts) · [Middleware de validación](../backend/src/middlewares/validacion.middleware.ts)

El controlador recibe el cuerpo validado y declara el tipo con el que lo va a usar.

```typescript
const datosCategoria: CrearCategoriaDTO = req.body;
```

Para los datos del usuario, agregamos `req.user` como propiedad opcional del tipo `Request`. El middleware de autenticación la completa y el controlador comprueba que esté presente antes de usar el ID. También simplificamos el tipo `AuthenticatedRequest` para leer parámetros de ruta como `req.params.id` directamente como texto. [Tipos de Express](../backend/src/types/express.d.ts) · [Middleware de autenticación](../backend/src/middlewares/auth.middleware.ts) · [Controlador de Categorías](../backend/src/controllers/categoria.controller.ts)

Consideramos desactivar la regla de ESLint o usar `unknown` y agregar comprobaciones en cada controlador. Elegimos concentrar la validación en los middlewares y usar tipos simples en los controladores.

### Relación con la materia

- **Responsabilidad única (SRP).** El middleware valida la entrada HTTP y el controlador usa los datos para llamar al servicio.
- **Clean Code.** Las firmas de los controladores quedan más fáciles de leer y el tipo del cuerpo aparece donde se usa.

### Evidencia y costos

La verificación original registró 102 pruebas aprobadas, compilación correcta del backend y cero errores o advertencias de ESLint. El cambio agregó un archivo de tipos compartido, `express.d.ts`, para simplificar las firmas de los controladores.

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

## CASO 5 — Inyección de dependencias en Perfil y Monedas

### Código analizado

- Perfil ([controlador](../backend/src/controllers/perfil.controller.ts), [servicio](../backend/src/services/perfil.service.ts) y [rutas](../backend/src/routes/perfil.routes.ts)).
- Monedas ([controlador](../backend/src/controllers/moneda.controller.ts), [servicio](../backend/src/services/moneda.service.ts) y [rutas](../backend/src/routes/moneda.routes.ts)).

### Problemas detectados

Los controladores eran funciones que usaban servicios instanciados al cargar el archivo. Eso los acoplaba a implementaciones concretas y dificultaba probarlos con servicios simulados. Además, delegaban los errores de manera implícita en Express, mientras que otros controladores del proyecto llamaban a `next(error)` de forma explícita.

### Alternativas consideradas

1. **Unificar solo el manejo de errores.** Alineaba el estilo de los controladores y mantenía la dependencia directa de los servicios concretos.
2. **Inyectar los servicios desde las rutas y unificar el manejo de errores.** Elegimos esta opción porque sigue la estructura de Categorías y Resumen y permite probar los controladores por separado.

### Cambios realizados

Antes, el controlador de Perfil creaba su servicio al cargar el archivo.

```typescript
const perfilService = new PerfilService(new PerfilRepository(), new PerfilAuthService());
```

Ahora, el controlador declara qué contrato necesita y recibe el servicio por constructor.

```typescript
export class PerfilController {
  constructor(private readonly perfilService: IPerfilService) {}
}
```

Las rutas construyen e inyectan los servicios concretos. `MonedaController` sigue la misma estructura con `IMonedaService`. Los métodos de ambos controladores capturan los errores y los envían al manejador global con `next(error)`. La validación con Zod se mantiene en las rutas y los controladores conservan el tipado directo del cuerpo con `ActualizarPerfilDTO` y `AsignarMonedaDTO`, tal como se describe en el [caso 3](#caso-3--tipado-seguro-en-express-y-usuario-autenticado).

### Relación con la materia

- **DIP (inversión de dependencias).** Los controladores dependen de contratos que pueden implementar tanto los servicios reales como los simulados.
- **SRP (responsabilidad única).** Las rutas conectan las dependencias y los middlewares validan la entrada. Los controladores coordinan la petición y los servicios ejecutan la lógica de negocio.

### Evidencia y costos

Las pruebas unitarias de [Perfil](../backend/tests/unit/perfil.controller.test.ts) y [Monedas](../backend/tests/unit/moneda.controller.test.ts) comprueban que cada controlador use el servicio inyectado y delegue sus errores a Express. Las cuatro pruebas pasaron al ejecutar ambos archivos. La refactorización agrega dos contratos y unas líneas de configuración en las rutas, y permite probar los controladores sin conectarse a la base de datos.

---

## CASO 6 — Consolidación de DIP en Categorías y Estadísticas (Taller III)

### Código analizado

- [`categoria.service.ts`](../backend/src/services/categoria.service.ts) y [`categoria.controller.ts`](../backend/src/controllers/categoria.controller.ts).
- [`estadisticas.service.ts`](../backend/src/services/estadisticas.service.ts) y [`estadisticas.controller.ts`](../backend/src/controllers/estadisticas.controller.ts).

### Problema, alternativas y decisión

Aunque ya habíamos introducido inyección de dependencias, quedaban controladores tipados contra servicios concretos y, en Estadísticas, una instancia de repositorio por defecto dentro del servicio. Podíamos conservar esa estructura o explicitar contratos en las capas superiores. Elegimos interfaces `ICategoriaService` e `IEstadisticasService` y una dependencia `IEstadisticasRepository` requerida por constructor, dejando la composición en las rutas. Eliminamos casteos innecesarios y tipamos los dobles de prueba según los contratos.

### Relación con la materia y evidencia

Aplicamos DIP para reducir dependencias rígidas y SRP para concentrar la construcción de colaboradores fuera del servicio. El costo es mantener contratos adicionales; el beneficio es poder sustituir dependencias sin forzar tipos. Los commits `c256e06` y `d476cb0` registran las refactorizaciones; las ejecuciones focalizadas aprobaron 22 pruebas de Categorías y 15 de Estadísticas. La suite completa de `develop` del 27/11/2026 aprobó 224 pruebas (PR #34 integrada).

## CASO 7 — Validaciones de movimientos y pruebas de regresión

### Problema y decisión

Detectamos que la API admitía rangos invertidos y parámetros desconocidos, y que se podían registrar movimientos con fechas futuras. Decidimos centralizar la validación HTTP en `movimiento.schema.ts` usando un objeto estricto y refinamientos para los rangos y la fecha. En el formulario limitamos la fecha máxima y mostramos el error antes de enviar la petición. El criterio de día calendario es el de Argentina. No confiamos exclusivamente en las restricciones del frontend.

Aplicamos el ciclo RED/GREEN: `434ea0b` y `4babc63` para filtros; `d7f50c6` y `c18d0ce` para fechas futuras. En los filtros pasamos de 10/13 a 13/13 pruebas y en el esquema de fechas de 4/6 a 6/6. Los tests con reloj controlado verifican la condición límite de hoy. Son correcciones funcionales, no refactoring puro; no registramos una fase REFACTOR independiente.

En `MovimientosRecientes` corregimos el formato de importes según el código de la moneda y evitamos asumir ARS cuando el código no está disponible. Reutilizamos los formateadores existentes y agregamos pruebas de regresión (`62d9f44`). El costo es resolver el catálogo de monedas y mantener los casos de formato; el beneficio es evitar mostrar información financiera incorrecta.

### Evidencia

- [Filtros HTTP](../backend/tests/integration/movimiento.routes.test.ts).
- [Esquema de movimientos](../backend/tests/unit/movimiento.schema.test.ts).
- [Movimientos recientes](../frontend/tests/unit/MovimientosRecientes.test.tsx).
- PR #34 integrada; 224 pruebas aprobadas, build exitoso y ESLint sin advertencias en `develop` al cierre del Sprint 3.

## Conclusión

Los casos del backend y del frontend comparten problemas de diseño, como el **acoplamiento entre componentes** y la **mezcla de responsabilidades**. Para resolverlos, aplicamos principalmente los principios **SRP (Responsabilidad Única)** y **DIP (Inversión de Dependencias)**.

También utilizamos **inyección de dependencias, interfaces, DTOs y validaciones con Zod** para organizar mejor el código y facilitar las pruebas.

Evaluamos los patrones de diseño estudiados en clase, pero decidimos no incorporar patrones adicionales cuando no existía una necesidad concreta, evitando agregar complejidad innecesaria.

Las secciones de evidencia registran las pruebas automatizadas de los cambios del backend.

**En conclusión, el objetivo no fue aplicar patrones por obligación, sino identificar problemas reales, evaluar alternativas y tomar decisiones fundamentadas para conseguir un código más claro, desacoplado, testeable y mantenible.**
