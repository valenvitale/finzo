# Tarjetas para Jira — Finzo (Sprint 2: Taller II - 16/10/2026)

Este documento contiene las **24 tarjetas de trabajo** para cargar directamente en el **Sprint 2 (Taller II)** de Jira, con su prioridad asignada según el selector de Jira:
* **Más alta** *(Highest)*
* **Alta** *(High)*
* **Media** *(Medium)*
* **Baja** *(Low)*
* **Más baja** *(Lowest)*

---

## 🔵 Federico Heinrich (4 tarjetas)

### 1. Modelado y Persistencia de Base de Datos con Prisma
- **Asignado:** Federico Heinrich
- **Prioridad:** Más alta *(Highest)*
- **Plazo:** 02/10 al 05/10
- **Dependencias:** Base del proyecto → Bloquea repositorios de todos los integrantes
- **Descripción:**
  Configurar la capa de base de datos relacional del proyecto utilizando Prisma ORM conectado a PostgreSQL en Supabase. Debe modelar todo el dominio del sistema en español, generar la migración inicial y poblar la base con datos semilla para desarrollo y testing.
  
  **Subtareas / Criterios incluidos:**
  - [ ] **Prisma Schema (`backend/prisma/schema.prisma`):** Definir tablas `monedas`, `perfiles`, `perfiles_monedas`, `categorias` y `movimientos` con tipos precisos (UUID, Decimal para montos, Timestamps), claves foráneas, índices de búsqueda y enums para `TipoMovimiento` (`ingreso`/`gasto`) y `MedioPago` (`efectivo`, `debito`, `credito`, `transferencia`). Validar con `prisma validate`.
  - [ ] **Migración inicial (`backend/prisma/migrations/*`):** Ejecutar `prisma migrate dev` contra Supabase y verificar sincronización de tablas y constraints.
  - [ ] **Seed de datos (`backend/prisma/seed.ts`):** Crear script idempotente (con `upsert`) que inserte monedas base (ARS, USD, EUR) y categorías predeterminadas del sistema (Sueldo, Comida, Transporte, Servicios, etc.). Ejecutable con `pnpm --filter backend prisma db seed`.

---

### 2. Capa de Persistencia y DTOs de Movimientos
- **Asignado:** Federico Heinrich
- **Prioridad:** Más alta *(Highest)*
- **Plazo:** 05/10 al 07/10
- **Dependencias:** Bloqueada por Tarjeta 1 (Prisma Schema y Migración) y Tarjeta 19 (PrismaClient singleton) → Bloquea Servicio de Movimientos y Resumen
- **Descripción:**
  Definir los contratos de tipado y programar el repositorio de acceso a datos para la entidad central del sistema (`movimientos`), aplicando el patrón **Repository** y el principio **DIP** (Inversión de Dependencias).

  **Subtareas / Criterios incluidos:**
  - [ ] **Tipos y DTOs (`backend/src/types/movimiento.types.ts`):** Crear interfaces `CrearMovimientoDTO`, `ActualizarMovimientoDTO`, `FiltrosMovimientoDTO` y `MovimientoResponseDTO`.
  - [ ] **MovimientoRepository (`backend/src/repositories/movimiento.repository.ts`):** Definir interfaz `IMovimientoRepository` e implementar operaciones CRUD: `crear()`, `obtenerPorId()`, `listarPorPerfil()` (con filtros de fechas, mes/año, tipo, categoría y medio de pago), `actualizar()` y `eliminar()`. Usar exclusivamente la instancia singleton de Prisma.

---

### 3. Backend de Movimientos: Lógica de Negocio y API REST
- **Asignado:** Federico Heinrich
- **Prioridad:** Más alta *(Highest)*
- **Plazo:** 09/10 al 11/10
- **Dependencias:** Bloqueada por Tarjeta 2 (Repositorio), Tarjeta 5 (Auth Middleware), Tarjeta 17 (Errores y errorHandler), Tarjeta 18 (Validación Zod) y validación de categorías → Bloquea consumo en Frontend
- **Descripción:**
  Implementar el flujo completo de negocio y transporte HTTP para los movimientos financieros: validaciones, autorización, parsing de peticiones, endpoints y registro en la app. Aplica **SRP** (separación Controller ≠ Service) y **Middleware Chain Pattern**.

  **Subtareas / Criterios incluidos:**
  - [ ] **MovimientoService (`backend/src/services/movimiento.service.ts`):** Inyectar repositorio mediante interfaz. Validar: monto > 0, tipo y medio de pago válidos, fecha válida, categoría existente y compatible con el tipo, y pertenencia del movimiento al usuario autenticado. Lanzar errores tipados (`ErrorDeValidacion`, `ErrorNoEncontrado`, `ErrorProhibido`).
  - [ ] **Schemas Zod (`backend/src/types/schemas/movimiento.schema.ts`):** Validar payloads de creación, edición y query params de filtros con mensajes claros en español.
  - [ ] **MovimientoController (`backend/src/controllers/movimiento.controller.ts`):** Handlers HTTP para crear, listar, obtener por ID, actualizar y eliminar con códigos semánticos (201 Created, 200 OK, 204 No Content).
  - [ ] **Rutas y montaje (`backend/src/routes/movimiento.routes.ts` y `app.ts`):** Exponer endpoints protegidos bajo `/api/movimientos` aplicando middlewares (`autenticar` → `validarCuerpo`/`validarQuery` → `controller`).

---

### 4. Tests Unitarios de Movimientos (MovimientoService)
- **Asignado:** Federico Heinrich
- **Prioridad:** Alta *(High)*
- **Plazo:** 11/10 al 12/10
- **Dependencias:** Bloqueada por Tarjeta 3 (MovimientoService)
- **Descripción:**
  Crear la suite de pruebas unitarias para aislar y validar todas las reglas de negocio de movimientos, demostrando inversión de dependencias y calidad de código para la defensa del Taller II.

  **Subtareas / Criterios incluidos:**
  - [ ] **Suite de tests (`backend/tests/unit/movimiento.service.test.ts`):** Mockear `IMovimientoRepository` y el repositorio de categorías.
  - [ ] **Casos de prueba:** Rechazo de monto <= 0, tipo inválido, categoría incompatible, acceso a movimientos de otro usuario (403), y creación/actualización exitosa retornando el DTO esperado. Ejecutable con `pnpm --filter backend test`.

---

## 🟣 Valentina Vitale (6 tarjetas)

### 5. Infraestructura de Autenticación y Middleware JWT (Supabase + Backend)
- **Asignado:** Valentina Vitale
- **Prioridad:** Más alta *(Highest)*
- **Plazo:** 02/10 al 05/10
- **Dependencias:** Bloqueada por Tarjeta 1 (Migración Prisma) y Tarjeta 17 (Errores personalizados) → Bloquea todos los endpoints protegidos del sistema
- **Descripción:**
  Configurar la capa de seguridad e identidad entre Supabase y Express: creación automática de perfiles en PostgreSQL mediante triggers, configuración de proveedores y middleware de validación de tokens JWT.

  **Subtareas / Criterios incluidos:**
  - [ ] **Trigger PostgreSQL en Supabase:** Crear función y trigger `on_auth_user_created` que inserte una fila en `perfiles` cada vez que se registre un usuario en `auth.users`.
  - [ ] **Configuración Supabase Auth:** Configurar proveedor Email/Password y URLs de redirección para desarrollo local y producción.
  - [ ] **Auth Middleware (`backend/src/middlewares/auth.middleware.ts`):** Extraer header `Authorization: Bearer <token>`, validar contra Supabase Auth, arrojar `ErrorNoAutorizado` (401) ante token ausente/inválido, e inyectar `req.user = { id, email }` en requests válidas.

---

### 6. Backend de Perfil y Monedas (Repositories, Services, Controllers y Rutas)
- **Asignado:** Valentina Vitale
- **Prioridad:** Alta *(High)*
- **Plazo:** 12/10 al 14/10
- **Dependencias:** Bloqueada por Tarjeta 1 (Schema), Tarjeta 5 (Auth Middleware), Tarjeta 18 (Schemas Zod) y Tarjeta 19 (PrismaClient)
- **Descripción:**
  Construir los módulos backend para la gestión de datos de usuario (nombre, apellido, moneda principal) y el catálogo/asociación de monedas de la billetera.

  **Subtareas / Criterios incluidos:**
  - [ ] **Tipos y DTOs (`backend/src/types/perfil.types.ts`, `moneda.types.ts`):** Tipado para actualizar perfil, respuesta de perfil y catálogo/asignación de monedas.
  - [ ] **Módulo Perfil:** `PerfilRepository` (consultas Prisma), `PerfilService` (reglas y autorización), `PerfilController` y rutas `GET/PATCH /perfil`.
  - [ ] **Módulo Monedas:** `MonedaRepository`, `MonedaService`, `MonedaController` y rutas `GET /monedas`, `GET /perfil/monedas`, `POST /perfil/monedas`, `DELETE /perfil/monedas/:monedaId`.
  - [ ] **Montaje:** Registrar routers bajo `/api/perfil` y `/api/monedas` en el router index.

---

### 7. Backend de Resumen Financiero Mensual (Service, Controller y Ruta)
- **Asignado:** Valentina Vitale
- **Prioridad:** Alta *(High)*
- **Plazo:** 13/10 al 14/10
- **Dependencias:** Bloqueada por Tarjeta 2 (MovimientoRepository) y Tarjeta 5 (Auth Middleware) → Bloquea Dashboard frontend
- **Descripción:**
  Implementar la lógica y endpoint para calcular las métricas económicas del usuario para un mes dado: suma de ingresos, suma de gastos y balance neto.

  **Subtareas / Criterios incluidos:**
  - [ ] **ResumenService (`backend/src/services/resumen.service.ts`):** Recibe repositorio inyectado. Calcula total ingresos, total gastos y balance neto (`ingresos - gastos`) para el mes y año solicitados (o actual por defecto). Preparado para aplicar Strategy en variantes de cálculo.
  - [ ] **ResumenController y Ruta (`backend/src/controllers/resumen.controller.ts`, `backend/src/routes/resumen.routes.ts`):** Endpoint protegido `GET /api/resumen` con parámetros opcionales `mes` y `anio`, devolviendo `{ totalIngresos, totalGastos, balance, moneda }`. Montado bajo `/api/resumen`.

---

### 8. Autenticación en Frontend (AuthContext, Login, Register y Rutas Protegidas)
- **Asignado:** Valentina Vitale
- **Prioridad:** Más alta *(Highest)*
- **Plazo:** 06/10 al 12/10
- **Dependencias:** Cliente Supabase frontend y Tarjeta 20 (Componentes Comunes Boton/Input) → Bloquea navegación privada de la app
- **Descripción:**
  Implementar el sistema completo de autenticación y sesión en React: cliente HTTP con interceptor, contexto reactivo global, pantallas de Login y Register, y componentes de control de rutas.

  **Subtareas / Criterios incluidos:**
  - [ ] **apiClient (`frontend/src/services/api.ts`):** Instancia Axios/Fetch configurada con `baseURL` e interceptor que inyecta automáticamente el token JWT Bearer de Supabase en cada petición. Manejo centralizado de 401.
  - [ ] **AuthContext (`frontend/src/context/AuthContext.tsx`):** Estado global con `user`, `session`, `loading`, funciones `login()`, `register()`, `logout()` y listener `onAuthStateChange`.
  - [ ] **Páginas de Login y Register (`frontend/src/pages/auth/`):** Formularios con validación visual, estados de carga, manejo de credenciales inválidas y redirección al Dashboard.
  - [ ] **Guardias de navegación (`frontend/src/routes/AppRouter.tsx`):** Componentes `RutaProtegida` (redirige a login si no hay sesión) y `RutaPublica` (redirige a dashboard si ya está autenticado).

---

### 9. Dashboard y Resumen Financiero en Frontend
- **Asignado:** Valentina Vitale
- **Prioridad:** Alta *(High)*
- **Plazo:** 13/10 al 15/10
- **Dependencias:** Bloqueada por Tarjeta 7 (Backend Resumen), Tarjeta 11 (Layout), Tarjeta 20 (Tarjeta) y Tarjeta 22 (ListaMovimientos)
- **Descripción:**
  Construir la pantalla principal de la aplicación que presenta los indicadores económicos clave del usuario y sus últimos movimientos registrados.

  **Subtareas / Criterios incluidos:**
  - [ ] **resumenService (`frontend/src/services/resumen.service.ts`):** Función `obtenerResumen()` para invocar `GET /api/resumen`.
  - [ ] **Tarjetas de métricas (`frontend/src/components/dashboard/*`):** 3 tarjetas visuales para Ingresos (verde), Gastos (rojo) y Balance Neto (color condicional según saldo), formateadas con la utilidad de moneda.
  - [ ] **Vista Dashboard (`frontend/src/pages/Dashboard.tsx`):** Layout con botones de acción rápida ("+ Nuevo Movimiento", "Categorías"), widget de movimientos recientes, estado de carga (skeleton loaders) y estado vacío si no hay transacciones.

---

### 10. Seguridad en Base de Datos (RLS) y Deploys (Vercel y Render)
- **Asignado:** Valentina Vitale
- **Prioridad:** Alta *(High)*
- **Plazo:** 05/10 (RLS) y 15/10 (Deploys)
- **Dependencias:** Migración de BD lista y compilación limpia con `pnpm build`
- **Descripción:**
  Configurar la seguridad a nivel de filas en PostgreSQL y desplegar la solución en plataformas cloud para tener un entorno de producción funcional para el Taller II.

  **Subtareas / Criterios incluidos:**
  - [ ] **RLS Policies en Supabase:** Habilitar RLS en `perfiles`, `movimientos`, `categorias` y `perfiles_monedas` con políticas `auth.uid() = usuario_id`. Categorías del sistema con lectura pública para autenticados.
  - [ ] **Storage Policies en Supabase:** Configurar bucket y políticas de almacenamiento si se implementa foto de perfil.
  - [ ] **Deploy Frontend en Vercel:** Proyecto enlazado al repo, build command configurado y `vercel.json` con reescritura de rutas SPA.
  - [ ] **Deploy Backend en Render:** Web Service configurado con build y start command, respondiendo a peticiones HTTPS.
  - [ ] **Variables de entorno de producción:** Coordinar env vars en Vercel, Render y Supabase asegurando comunicación fluida sin bloqueos CORS.

---

## 🟠 Alessio Cragno (6 tarjetas)

### 11. Shell y Layout de Navegación en Frontend (Sidebar, Header, PageContainer y Navbar)
- **Asignado:** Alessio Cragno
- **Prioridad:** Más alta *(Highest)*
- **Plazo:** 11/10 al 13/10
- **Dependencias:** Bloqueada por Tarjeta 8 (AuthContext para datos de usuario y logout) → Bloquea todas las páginas privadas de la app
- **Descripción:**
  Construir la estructura visual envolvente (shell) de Finzo que enmarca la navegación del usuario en escritorio y dispositivos móviles.

  **Subtareas / Criterios incluidos:**
  - [ ] **Sidebar (`frontend/src/components/layout/Sidebar.tsx`):** Barra lateral fija con `NavLink` hacia Dashboard, Movimientos, Categorías y Perfil, con estilo activo distintivo.
  - [ ] **Header (`frontend/src/components/layout/Header.tsx`):** Cabecera superior con logo de Finzo, nombre del usuario activo y botón de logout conectado a `AuthContext`.
  - [ ] **PageContainer (`frontend/src/components/layout/PageContainer.tsx`):** Layout principal con Sidebar, Header y contenedor `<Outlet />` con padding y scroll independiente.
  - [ ] **Navbar responsive (`frontend/src/components/layout/Navbar.tsx`):** Menú adaptado para pantallas móviles (<768px).

---

### 12. Modelos de Dominio y Tipos Compartidos (Backend y Frontend)
- **Asignado:** Alessio Cragno
- **Prioridad:** Media *(Medium)*
- **Plazo:** 02/10 al 05/10
- **Dependencias:** Base conceptual → Facilita tipado a todos los repositorios y vistas
- **Descripción:**
  Definir los modelos puros de las entidades de negocio en backend y los contratos de tipos TypeScript correspondientes para el frontend.

  **Subtareas / Criterios incluidos:**
  - [ ] **Modelos de dominio Backend (`backend/src/models/`):** Interfaces puras para `perfil.model.ts`, `movimiento.model.ts`, `categoria.model.ts` y `moneda.model.ts` desacopladas de Prisma.
  - [ ] **Tipos DTOs Backend (`backend/src/types/categoria.types.ts`):** `CrearCategoriaDTO`, `ActualizarCategoriaDTO`, `CategoriaResponseDTO`.
  - [ ] **Tipos Frontend (`frontend/src/types/`):** Interfaces TypeScript compartidas para `categoria.types.ts` y `movimiento.types.ts`.

---

### 13. Backend Completo de Categorías (Repository, Service, Controller y Rutas)
- **Asignado:** Alessio Cragno
- **Prioridad:** Más alta *(Highest)*
- **Plazo:** 05/10 al 11/10
- **Dependencias:** Bloqueada por Tarjeta 1 (Schema), Tarjeta 5 (Auth Middleware), Tarjeta 17 (Errores y errorHandler), Tarjeta 18 (Validación Zod) y Tarjeta 19 (PrismaClient) → Bloquea consumo de categorías en frontend y validación de movimientos
- **Descripción:**
  Implementar la arquitectura en capas para la gestión de categorías: persistencia con Prisma, reglas de negocio del sistema, controlador HTTP y rutas protegidas.

  **Subtareas / Criterios incluidos:**
  - [ ] **CategoriaRepository (`backend/src/repositories/categoria.repository.ts`):** Interfaz `ICategoriaRepository` (DIP) y métodos para listar (predeterminadas + del perfil), buscar por ID, contar personalizadas por usuario, crear, actualizar y borrar.
  - [ ] **CategoriaService (`backend/src/services/categoria.service.ts`):** Lógica de negocio: máximo 8 personalizadas (`ErrorDeConflicto`), prohibido editar/borrar predeterminadas (`ErrorProhibido`), compatibilidad de tipo (ingreso/gasto) y estrategia de borrado seguro con movimientos asociados.
  - [ ] **CategoriaController y Rutas (`backend/src/controllers/categoria.controller.ts`, `backend/src/routes/categoria.routes.ts`):** Endpoints `GET /`, `POST /`, `PATCH /:id`, `DELETE /:id` con auth y validación Zod. Montaje bajo `/api/categorias`.

---

### 14. Módulo de Categorías en Frontend (Service, Hook, Componentes y Página)
- **Asignado:** Alessio Cragno
- **Prioridad:** Media *(Medium)*
- **Plazo:** 10/10 al 14/10
- **Dependencias:** Bloqueada por Tarjeta 11 (PageContainer layout), Tarjeta 13 (Backend Categorías), Tarjeta 20 (Componentes Comunes) y Tarjeta 21 (Hook useApi)
- **Descripción:**
  Construir la experiencia completa de administración de categorías en React: llamadas HTTP, hook de estado, componentes modulares y pantalla principal.

  **Subtareas / Criterios incluidos:**
  - [ ] **categoriaService y useCategorias (`frontend/src/services/categoria.service.ts`, `frontend/src/hooks/useCategorias.ts`):** Métodos CRUD y hook reactivo con listas filtradas por tipo, estados de carga y mutaciones.
  - [ ] **Componentes de Categorías (`frontend/src/components/categories/*`):** `EtiquetaCategoria` (badge con color dinámico legible), `ListaCategorias` y `FormularioCategoria` (modal con nombre, tipo, selector de color e icono).
  - [ ] **Página de Categorías (`frontend/src/pages/Categorias.tsx`):** Vista dividida en Categorías del Sistema (lectura) y Personalizadas, con contador de uso (ej. "3/8 utilizadas"), botón para crear y opciones de editar/borrar en personalizadas.

---

### 15. Vista y Formulario de Movimientos en Frontend (Página y Modal)
- **Asignado:** Alessio Cragno
- **Prioridad:** Alta *(High)*
- **Plazo:** 12/10 al 15/10
- **Dependencias:** Bloqueada por Tarjeta 11 (PageContainer layout), Tarjeta 14 (useCategorias), Tarjeta 22 (ListaMovimientos y useMovimientos) y Tarjeta 20 (Componentes Comunes)
- **Descripción:**
  Construir la pantalla interactiva de transacciones y el formulario modal para registrar y modificar movimientos financieros.

  **Subtareas / Criterios incluidos:**
  - [ ] **FormularioMovimiento (`frontend/src/components/transactions/FormularioMovimiento.tsx`):** Modal de creación y edición. Selector de tipo (ingreso/gasto) que filtra dinámicamente las categorías disponibles, validación de monto > 0, medio de pago, fecha y descripción opcional.
  - [ ] **Página Movimientos (`frontend/src/pages/Movimientos.tsx`):** Integración de barra de filtros, listado interactivo, botón prominente "+ Nuevo Movimiento", modal de carga y confirmación de eliminación.

---

### 16. Tests Unitarios y de Integración de Categorías
- **Asignado:** Alessio Cragno
- **Prioridad:** Media *(Medium)*
- **Plazo:** 13/10 al 16/10
- **Dependencias:** Bloqueada por Tarjeta 13 (Backend Categorías)
- **Descripción:**
  Asegurar la calidad del módulo de categorías mediante pruebas unitarias de las reglas de negocio y pruebas de integración sobre los endpoints HTTP.

  **Subtareas / Criterios incluidos:**
  - [ ] **Tests unitarios CategoriaService (`backend/tests/unit/categoria.service.test.ts`):** Mock de repositorio testeando rechazo de 9na personalizada, restricción sobre predeterminadas y borrado seguro.
  - [ ] **Tests de integración (`backend/tests/integration/categoria.routes.test.ts`):** Pruebas HTTP con Supertest validando status 200, 201, 400 y 401.

---

## 🟢 Máximo Messina (8 tarjetas)

### 17. Sistema Centralizado de Errores y errorHandler de Express
- **Asignado:** Máximo Messina
- **Prioridad:** Más alta *(Highest)*
- **Plazo:** 02/10 al 04/10
- **Dependencias:** Base inicial → Bloquea controladores y middlewares de todos los integrantes
- **Descripción:**
  Implementar la jerarquía de excepciones de la aplicación y refactorizar el middleware global de errores de Express para responder con códigos HTTP y payloads JSON unificados.

  **Subtareas / Criterios incluidos:**
  - [ ] **Clases de error (`backend/src/utils/errores.ts`):** Clase base `AppError extends Error` (con `statusCode` y `esOperacional`) y clases tipadas `ErrorNoEncontrado` (404), `ErrorProhibido` (403), `ErrorNoAutorizado` (401), `ErrorDeValidacion` (400, con array de errores) y `ErrorDeConflicto` (409).
  - [ ] **errorHandler refactorizado (`backend/src/middlewares/errorHandler.ts`):** Middleware de 4 parámetros `(err, req, res, next)`. Formatea respuestas JSON limpias (`{ exito: false, mensaje, errores }`) y oculta detalles sensibles en 500 para producción. Documentar refactoring antes/después para la defensa.

---

### 18. Middleware Genérico de Validación Zod y Schemas del Sistema
- **Asignado:** Máximo Messina
- **Prioridad:** Más alta *(Highest)*
- **Plazo:** 05/10 al 07/10
- **Dependencias:** Bloqueada por Tarjeta 17 (AppError) → Bloquea rutas de Categorías, Perfil y Monedas
- **Descripción:**
  Crear el middleware de validación genérico reutilizable (evidenciando el principio **OCP**) y escribir los esquemas Zod correspondientes a categorías, perfil y monedas.

  **Subtareas / Criterios incluidos:**
  - [ ] **Middleware Zod (`backend/src/middlewares/validacion.middleware.ts`):** Funciones de orden superior `validarCuerpo(schema)`, `validarParametros(schema)` y `validarQuery(schema)` que interceptan peticiones inválidas arrojando `ErrorDeValidacion`.
  - [ ] **Schemas Zod (`backend/src/types/schemas/`):** Crear `categoria.schema.ts`, `perfil.schema.ts` y `moneda.schema.ts` con reglas estrictas y mensajes de error en español.

---

### 19. Configuración Base de Backend (PrismaClient Singleton, Router Index y Utilidades)
- **Asignado:** Máximo Messina
- **Prioridad:** Más alta *(Highest)*
- **Plazo:** 04/10 al 05/10
- **Dependencias:** Bloqueada por Tarjeta 1 (Schema) → Bloquea repositorios y montaje de rutas de todos los módulos
- **Descripción:**
  Configurar los pilares de infraestructura del backend: singleton de base de datos, punto de entrada común de routing y utilidades puras de cálculo y formateo.

  **Subtareas / Criterios incluidos:**
  - [ ] **PrismaClient Singleton (`backend/src/config/prisma.ts`):** Instancia única utilizando `globalThis` para prevenir problemas de conexiones en desarrollo.
  - [ ] **Router Index (`backend/src/routes/index.ts`):** Enrutador central montado bajo `/api` que agrupa modularmente todas las rutas del sistema.
  - [ ] **Utilidades de backend (`backend/src/utils/`):** Funciones puras en `formato.ts`, `fecha.ts` y `consulta.ts` para rangos de fechas de inicio/fin de mes, formateo monetario y parsing seguro de queries de paginación.

---

### 20. Integración de Componentes UI y Notificaciones con Bibliotecas (UI Design System)
- **Asignado:** Máximo Messina
- **Prioridad:** Alta *(High)*
- **Plazo:** 06/10 al 08/10
- **Dependencias:** Configuración base frontend → Bloquea prácticamente todas las vistas y modales de la app
- **Descripción:**
  Integrar y configurar bibliotecas estándar de la industria para UI y notificaciones (Toasts), encapsulándolas en componentes comunes reutilizables (`frontend/src/components/common/*`) con estilos consistentes de Tailwind CSS. Esto evita programar lógica compleja de accesibilidad o timers a mano y desacopla la aplicación aplicando el patrón Adapter (DIP).

  **Subtareas / Criterios incluidos:**
  - [ ] **Sistema de Notificaciones (Toasts):** Instalar y configurar una biblioteca estándar (como `sonner` o `react-hot-toast`), montar el contenedor `<Toaster />` en la raíz de la app y dejar listo el disparador de mensajes para feedback en formularios (`toast.success()`, `toast.error()`).
  - [ ] **Componentes UI base con Tailwind y primitivas accesibles (`frontend/src/components/common/*`):**
    - `Boton`: wrapper reutilizable con variantes visuales (primary, secondary, danger) y spinner de carga integrado.
    - `InputTexto`: campo estilizado con soporte para label, helper text y mensajes de validación.
    - `Modal / Dialog`: modal accesible implementado con primitivas estándar (como `@radix-ui/react-dialog` o `<dialog>` HTML5 con Tailwind) con backdrop, cierre con tecla Escape y bloqueo de scroll.
    - `Tarjeta`, `Selector`, `Cargando`, `EstadoVacio` y `MensajeError`: contenedores y estados visuales estandarizados para que Valentina y Alessio construyan Login, Dashboard, Categorías y Movimientos.

---

### 21. Capa de Servicios Base, Tipos y Utilidades en Frontend
- **Asignado:** Máximo Messina
- **Prioridad:** Media *(Medium)*
- **Plazo:** 10/10 al 12/10
- **Dependencias:** Bloqueada por Tarjeta 8 (apiClient) → Bloquea hooks específicos
- **Descripción:**
  Implementar utilidades de formateo, contratos de datos para respuestas HTTP, hook genérico asíncrono y clientes de servicio para perfil y monedas.

  **Subtareas / Criterios incluidos:**
  - [ ] **Utilidades (`frontend/src/utils/`):** Formatters monetarios y de fechas usando la API estándar `Intl` (`moneda.ts`, `fecha.ts`, `formato.ts`).
  - [ ] **Tipos y Hook useApi (`frontend/src/types/api.types.ts`, `frontend/src/hooks/useApi.ts`):** Tipos genéricos `ApiResponse<T>`, `Paginacion<T>` y hook reutilizable `{ data, loading, error, ejecutar, refetch }`.
  - [ ] **Servicios HTTP (`frontend/src/services/`):** Implementar `perfil.service.ts` y `moneda.service.ts`.

---

### 22. Gestión de Movimientos en Frontend (Service, Hook useMovimientos, Lista y Filtros)
- **Asignado:** Máximo Messina
- **Prioridad:** Alta *(High)*
- **Plazo:** 11/10 al 13/10
- **Dependencias:** Bloqueada por Tarjeta 3 (Rutas Movimientos), Tarjeta 8 (apiClient), Tarjeta 20 (Componentes Comunes) y Tarjeta 21 (Hook useApi) → Bloquea página de movimientos y Dashboard
- **Descripción:**
  Construir la capa de datos y componentes visuales para la gestión de transacciones en frontend que consume la página de movimientos y el dashboard.

  **Subtareas / Criterios incluidos:**
  - [ ] **movimientoService (`frontend/src/services/movimiento.service.ts`):** Llamadas HTTP hacia `/api/movimientos` (listar con filtros, crear, editar, eliminar).
  - [ ] **Hook useMovimientos (`frontend/src/hooks/useMovimientos.ts`):** Encapsular lista de transacciones, filtros activos (mes, tipo, categoría), estados de carga y mutaciones.
  - [ ] **FiltrosMovimiento (`frontend/src/components/transactions/FiltrosMovimiento.tsx`):** Barra de filtros con selectores de mes, tipo, categoría y medio de pago.
  - [ ] **ListaMovimientos (`frontend/src/components/transactions/ListaMovimientos.tsx`):** Componente de visualización de transacciones con montos en verde/rojo, icono de categoría, fecha y botones de acción.

---

### 23. Pipeline de CI/CD (GitHub Actions), Branch Protection y Documentación API
- **Asignado:** Máximo Messina
- **Prioridad:** Alta *(High)*
- **Plazo:** 09/10 al 15/10
- **Dependencias:** Repositorio base y rutas de todos los módulos listas
- **Descripción:**
  Configurar la automatización de calidad en GitHub y escribir la especificación completa de la API en `docs/API.md` para la entrega académica.

  **Subtareas / Criterios incluidos:**
  - [ ] **Workflow de CI (`.github/workflows/ci.yml`):** Pipeline automático que ejecute en cada PR y push: checkout, instalación de dependencias, lint (`pnpm lint`), typecheck (`pnpm typecheck`), tests (`pnpm test`) y build (`pnpm build`).
  - [ ] **Branch Protection:** Proteger `main` y `develop` exigiendo PR, al menos 1 review aprobada y CI en verde para mergear.
  - [ ] **Documentación API (`docs/API.md`):** Detallar todos los endpoints del MVP (Movimientos, Categorías, Perfil, Monedas, Resumen): método, ruta, headers, schemas de request y JSONs de respuesta de éxito y error.

---

### 24. Suites de Pruebas Unitarias (Errores, Validación, Utilidades y UI)
- **Asignado:** Máximo Messina
- **Prioridad:** Media *(Medium)*
- **Plazo:** 06/10 al 15/10
- **Dependencias:** Bloqueada por componentes y utilidades correspondientes (Tarjetas 17, 18, 19 y 20)
- **Descripción:**
  Crear los tests unitarios de las piezas transversales de arquitectura y de los componentes reutilizables de UI.

  **Subtareas / Criterios incluidos:**
  - [ ] **Tests de Errores y errorHandler (`backend/tests/unit/errorHandler.test.ts`):** Validar status codes y formato JSON ante cada tipo de error.
  - [ ] **Tests de Validación Zod (`backend/tests/unit/validacion.middleware.test.ts`):** Verificar intercepción con 400 ante payload inválido y continuación con `next()`.
  - [ ] **Tests de Utilidades (`backend/tests/unit/utilidades.test.ts`):** Probar cálculos de fechas inicio/fin de mes y formatos de moneda.
  - [ ] **Tests de Componentes UI (`frontend/src/components/common/__tests__/*`):** Pruebas con Vitest y React Testing Library verificando renderizado y eventos de `Boton`, `InputTexto` y `Modal`.

---

## 📦 Tarjetas Diferidas para el Sprint 3 (Taller III: 27/11/2026)

Estas tarjetas quedan reservadas para el backlog de noviembre:

### 📌 Diferida A. Vista de Perfil de Usuario en Frontend
- **Asignado:** Valentina Vitale
- **Prioridad:** Baja *(Low)*
- **Hito:** Taller III (27/11/2026)
- **Descripción:**
  Construir `frontend/src/pages/Perfil.tsx` para visualizar y editar nombre, apellido y moneda preferida en UI con feedback de toast al guardar. *(El backend ya está cubierto en la Tarjeta 6)*.

### 📌 Diferida B. Suites de Tests Unitarios de Perfil y Resumen
- **Asignado:** Valentina Vitale
- **Prioridad:** Baja *(Low)*
- **Hito:** Taller III (27/11/2026)
- **Descripción:**
  Implementar `backend/tests/unit/perfil.service.test.ts` y `backend/tests/unit/resumen.service.test.ts` para ampliar la cobertura de pruebas sobre los servicios de usuario y cálculo de balances.
