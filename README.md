<div align="center">
  
  <br />
  
  <a href="https://github.com/valenvitale/finzo">
    <img src="frontend/public/images/finzo-logo.png" alt="Finzo Logo" width="180" style="max-width: 100%; height: auto;" />
  </a>

  <h1 align="center" style="border-bottom: none; margin-top: 12px; margin-bottom: 4px;">
    Finzo
  </h1>

  <p align="center">
    <strong>Sistema de gestión finanzas personales</strong>
  </p>

  <p align="center">
    <em>Una aplicación web ágil para registrar, categorizar y analizar tus gastos cotidianos.</em>
  </p>

  <br />

  <!-- Badges principales / Stack -->
  <p align="center">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
    <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm" />
    <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render" />
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  </p>

  <br />

  <p align="center">
    🎓 <strong>Trabajo Práctico Integrador — Metodología de Sistemas II</strong><br />
    <em>Tecnicatura Universitaria en Programación</em>
  </p>

  <br />

</div>

## 📌 Tabla de Contenidos

1. [Qué problema resuelve el proyecto](#-qué-problema-resuelve-el-proyecto)
2. [Integrantes del equipo](#-integrantes-del-equipo)
3. [Tecnología elegida](#-tecnología-elegida)
4. [Cómo empezar](#-como-empezar)
5. [Estado actual y pendientes conocidos](#-estado-actual-y-pendientes-conocidos)
6. [Arquitectura y diseño](#-arquitectura-y-diseño)
7. [Estructura del repositorio](#-estructura-del-repositorio)
8. [Alcance del MVP y Roadmap](#-alcance-del-mvp-y-roadmap)
9. [Metodologia de Trabajo y Convenciones](#-metodología-de-trabajo-y-convenciones)

---

## 💡 Qué problema resuelve el proyecto

Llevar el control de la economía personal cotidiana suele ser frustrante y desordenado. La mayoría de las personas conocen su saldo bancario puntual, pero **desconocen con exactitud en qué gastan, cuánto destinan a gastos hormiga o no esenciales, y cómo evoluciona su capacidad de ahorro mes a mes**.

Las soluciones habituales presentan barreras significativas:

- **Planillas de cálculo (Excel / Sheets):** Requieren configuración manual, son propensas a errores de fórmula y resultan incómodas de usar desde dispositivos móviles o en el día a día.
- **Sistemas contables tradicionales:** Son excesivamente complejos, con terminología técnica que sobrepasa al usuario común.
- **Apps comerciales conectadas a bancos:** Suelen generar desconfianza por la privacidad de credenciales financieras y presentan poca flexibilidad para categorizaciones a medida.

### Nuestra Propuesta de Valor

**Finzo** es una aplicación web intuitiva, ágil y segura diseñada para registrar, categorizar y analizar ingresos y gastos personales sin fricción. Transforma anotaciones dispersas en **información gráfica y procesable** para la toma de decisiones financieras responsables:

- ¿Cuánto dinero gasté este mes y cuánto me queda disponible?
- ¿Cuáles son las categorías que más impactan en mi presupuesto?
- ¿Cuál es mi balance neto y mi tasa de ahorro mensual?

### Enfoque Académico

El proyecto se desarrolla bajo el marco de **Metodología de Sistemas II**, aplicando estándares de calidad de software de la industria:

- Arquitectura cliente-servidor con separación estricta de responsabilidades (capas).
- Diseño guiado por principios **SOLID** y código limpio (_Clean Code_).
- Testing automatizado (unitario y de integración).
- Gestión colaborativa con Git/GitHub (ramas, issues, pull requests y revisiones de código).
- Integración continua y documentación viva.

---

## 👥 Integrantes del equipo

**Grupo 1 — Metodología de Sistemas II**

| Integrante            | Usuario GitHub                                   | Rol principal en el equipo |
| :-------------------- | :----------------------------------------------- | :------------------------- |
| **Federico Heinrich** | [@fedeheinrich](https://github.com/fedeheinrich) | Fullstack Developer        |
| **Máximo Messina**    | [@maxemessina](https://github.com/maxemessina)   | Fullstack Developer        |
| **Valentina Vitale**  | [@valenvitale](https://github.com/valenvitale)   | Fullstack Developer        |
| **Alessio Cragno**    | [@alesiocragno](https://github.com/alesiocragno) | Fullstack Developer        |

---

## 🛠️ Tecnología Elegida

La selección de tecnologías responde a la búsqueda de un stack moderno, fuertemente tipado de punta a punta (_end-to-end type safety_), con alto rendimiento y fácil mantenibilidad.

### Frontend

| Herramienta      | Versión / Tipo       | Justificación técnica                                                                                              |
| :--------------- | :------------------- | :----------------------------------------------------------------------------------------------------------------- |
| **React 19**     | Librería UI          | Estándar de la industria para SPAs declarativas, componentización y gestión de estado reactivo.                    |
| **TypeScript**   | Lenguaje             | Tipado estático que previene errores en tiempo de compilación y acelera el desarrollo en equipo.                   |
| **Vite**         | Build Tool / Bundler | Servidor de desarrollo instantáneo con HMR (_Hot Module Replacement_) y empaquetado optimizado con Rollup/esbuild. |
| **Tailwind CSS** | Estilos              | Diseño ágil basado en utilidades, consistente para paletas de color, temas oscuros y componentes responsive.       |

### Backend, Base de Datos e Infraestructura

| Herramienta | Tipo / Rol | Justificación técnica |
| :--- | :--- | :--- |
| **Node.js** | Runtime | Plataforma base donde se ejecuta nuestro código. |
| **Express 5** | Framework HTTP | Estructura nuestra API REST a medida (rutas, controladores y middlewares). |
| **TypeScript** | Lenguaje | Consistencia de tipos con el frontend; facilita contratos de datos (_DTOs_, interfaces y validaciones). |
| **tsx** | Ejecutor dev | Ejecución en caliente del código TypeScript durante el desarrollo local, sin necesidad de compilación previa. |
| **Render** | Hosting de la API | Servicio en la nube (Web Service) encargado exclusivamente de mantener corriendo nuestro servidor Node.js/Express. |
| **PostgreSQL** | Motor de Base de Datos | Base de datos relacional donde crearemos nuestro esquema público (tablas de perfiles, transacciones y categorías). |
| **Supabase** | Hosting de la Base de Datos | Plataforma en la nube que aloja y administra nuestra instancia de PostgreSQL. |
| **Supabase Auth** | Autenticación & JWT | Servicio prearmado que gestiona el registro, login y contraseñas de forma segura en un esquema privado, devolviendo los tokens para la API. |

### Testing y Calidad de Código

| Herramienta               | Tipo                   | Justificación técnica                                                                               |
| :------------------------ | :--------------------- | :-------------------------------------------------------------------------------------------------- |
| **Vitest**                | Test Runner            | Motor de pruebas ultrarrápido compatible de forma nativa con la configuración de Vite y TypeScript. |
| **React Testing Library** | Testing de Componentes | Pruebas centradas en el comportamiento del usuario en la interfaz.                                  |
| **ESLint**                | Linter                 | Detección temprana de errores de sintaxis y aplicación de reglas de estilo consistentes.            |
                                                                  
### Entorno y Gestión de Paquetes

| Herramienta         | Justificación técnica                                                                                                                               |
| :------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| **pnpm Workspaces** | Repositorio monorepo eficiente en disco, con resolución de dependencias compartidas y ejecución coordinada entre paquetes (`frontend` y `backend`). |

---

## 🚀 Cómo empezar

Sigue estos pasos para descargar, configurar y ejecutar el proyecto en tu entorno local.

### Prerrequisitos
Asegúrate de tener instalado en tu entorno local:
*   **[Node.js](https://nodejs.org/)** (versión especificada en el archivo `.nvmrc` — Node 24 o versión LTS v20+).
*   **[pnpm](https://pnpm.io/)** (versión 9 o superior). Si no lo tienes, puedes instalarlo con `npm install -g pnpm`.
*   **[Git](https://git-scm.com/)**.

### Paso a paso

#### 1. Clonar el repositorio

Descarga el código fuente y posicionate en el directorio:
```bash
git clone https://github.com/valenvitale/finzo.git
cd finzo
```

#### 2. Instalar dependencias

Al utilizar espacios de trabajo (`pnpm-workspace.yaml`), un único comando en la raíz instala automáticamente las dependencias compartidas, las del frontend y las del backend:
```bash
pnpm install
```

#### 3. Configurar variables de entorno**

Antes de iniciar las aplicaciones, es necesario crear los archivos `.env` a partir de las plantillas de ejemplo provistas.

*   **Backend (`backend/.env`):**
    ```env
    PORT=3000
    NODE_ENV=development
    SUPABASE_URL=https://tu-proyecto.supabase.co
    SUPABASE_ANON_KEY=tu-anon-key
    SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
    ```
*   **Frontend (`frontend/.env`):**
    ```env
    VITE_API_URL=http://localhost:3000/api
    VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
    VITE_SUPABASE_ANON_KEY=tu-anon-key
    ```
> [!WARNING]
> Nunca comitear ni subir archivos `.env` reales al repositorio; asegúrate de que permanezcan en el `.gitignore`.

#### 4. Ejecutar el Entorno de Desarrollo

Gracias a la configuración del monorepo, podes iniciar tanto el backend como el frontend simultáneamente con un solo comando desde la raíz del proyecto:

```bash
pnpm dev
```

> **Servicios iniciados:**
> *   **Frontend:** Disponible en `http://localhost:5173`
> *   **Backend (API):** Corriendo en `http://localhost:3000`

*(Opcional) Si necesitas realizar debug y prefieres ver los logs por separado, puedes abrir dos terminales e iniciar cada entorno individualmente usando `pnpm --filter backend dev` y `pnpm --filter frontend dev`.*

---

#### 5. Ejecución de Pruebas Automatizadas

Para ejecutar las suites de tests unitarios y de integración con Vitest:

```bash
# Ejecutar tests del backend
pnpm --filter backend test

# Ejecutar tests del frontend
pnpm --filter frontend test
```

---

## 📊 Estado Actual y Pendientes Conocidos

> [!NOTE]
> **Fase Taller I:** El proyecto se encuentra en su etapa de arranque e inicialización arquitectónica. Esta sección documenta el estado real del repositorio y el plan de trabajo inmediato.

### ✅ Estado Actual (Completado)

- [x] **Monorepo configurado:** Estructura de espacios de trabajo (`pnpm-workspace.yaml`) integrando los paquetes `frontend` y `backend`.
- [x] **Arquitectura de directorios:** Estructura en capas en el backend (`controllers`, `services`, `repositories`, `routes`, `middlewares`, `models`, `types`) y arquitectura por módulos y componentes en el frontend.
- [x] **Configuración de base:** Archivos `tsconfig.json`, `package.json`, `vitest.config.ts`, `.nvmrc` y reglas de `.gitignore` creados.
- [x] **Definición funcional y técnica:** Propuesta formal del proyecto documentada en detalle en [`PROPUESTA.md`](./PROPUESTA.md).
- [x] **Definición del stack y dependencias:** Dependencias base instaladas (Express 5, React 19, Supabase JS, Tailwind, Vitest).

### ⏳ Pendientes Conocidos y Próximos Pasos (Hito MVP)

- [ ] **Ajuste de scripts en `package.json`:** Definir los comandos `"scripts": { "dev": ..., "build": ..., "test": ... }` correspondientes en los paquetes para estandarizar el arranque.
- [ ] **Configuración del proyecto en Supabase:** Creación de la instancia en la nube, obtención de claves API y configuración de clientes.
- [ ] **Migraciones iniciales de base de datos:** Escribir los scripts SQL en `backend/migrations/` para las tablas principales (`profiles`, `categories`, `transactions`).
- [ ] **Flujo de autenticación:** Implementar registro, login y middleware de validación de tokens JWT en el backend.
- [ ] **CRUD de categorías y movimientos:** Desarrollo de endpoints REST y servicios para registrar ingresos/gastos y clasificar por categorías.
- [ ] **Dashboard inicial en Frontend:** Construcción de vistas de balance actual, historial de movimientos y formulario de carga.
- [ ] **Pipeline de CI:** Configurar flujos de trabajo en `.github/workflows/` para ejecución automática de linter y tests en cada Pull Request.
- [ ] **Despliegue a producción:** Configurar servicio en **Render** para la API del backend y proyecto en **Vercel** para la SPA del frontend.

---

## 🏗️ Arquitectura y Diseño

### Arquitectura General del Sistema

El sistema implementa una arquitectura desacoplada **Cliente-Servidor (SPA + REST API)** con persistencia relacional en Supabase:

```text
┌──────────────────────────────────────────────────────────┐
│          FRONTEND (SPA) — Alojado en Vercel              │
│                                                          │
│   React 19 + TypeScript + Vite + Tailwind CSS            │
│   - Context API / Hooks personalizados                   │
│   - Vistas (Dashboard, Movimientos, Categorías)          │
│   - Cliente API / Supabase Client                        │
└────────────────────────────┬─────────────────────────────┘
                             │
                             │ HTTP / JSON (REST)
                             ▼
┌──────────────────────────────────────────────────────────┐
│      BACKEND (API REST) — Alojado en Render (Web Service)│
│                                                          │
│   Node.js + Express 5 + TypeScript                       │
│                                                          │
│   Routes          Mapeo de URLs y métodos HTTP           │
│     │                                                    │
│     ▼                                                    │
│   Middlewares     Auth (JWT), validación y errores       │
│     │                                                    │
│     ▼                                                    │
│   Controllers     Manejo de Request / Response HTTP      │
│     │                                                    │
│     ▼                                                    │
│   Services        Reglas de negocio y cálculos           │
│     │                                                    │
│     ▼                                                    │
│   Repositories    Acceso a datos y persistencia          │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│              PERSISTENCIA & AUTH — Supabase Cloud        │
│                                                          │
│   - PostgreSQL: Base de datos relacional transaccional   │
│   - Supabase Auth: Gestión de usuarios y sesiones JWT    │
└──────────────────────────────────────────────────────────┘
```

### Flujo de Datos por Capas

Cada petición entrante atraviesa una secuencia de capas con responsabilidad única:

```text
Usuario en Frontend
       │  (Envía formulario de movimiento)
       ▼
Cliente HTTP (Fetch / Axios / Service)
       │  POST /api/transactions
       ▼
Express Route (`transaction.routes.ts`)
       │
       ▼
Middlewares (`auth.middleware.ts`, `validation.middleware.ts`)
       │  Valida sesión y esquema de datos
       ▼
Controller (`transaction.controller.ts`)
       │  Extrae parámetros y delega
       ▼
Service (`transaction.service.ts`)
       │  Aplica lógica de negocio (validar saldos, reglas)
       ▼
Repository (`transaction.repository.ts`)
       │  Ejecuta consulta en base de datos
       ▼
PostgreSQL / Supabase
       │  Almacena y retorna el registro
       ▼
Respuesta JSON 201 Created → Renderizado en UI
```

---

## 📁 Estructura del Repositorio

A continuación se detalla la distribución de archivos y directorios planificada para el proyecto:

```text
FINZO/
├── backend/
│   ├── migrations/             # Scripts SQL de creación y migración de tablas
│   ├── seeders/                # Datos semilla de prueba y categorías base
│   ├── src/
│   │   ├── config/             # Configuración de entorno y clientes externos
│   │   ├── controllers/        # Controladores que reciben peticiones HTTP
│   │   ├── middlewares/        # Middlewares de autenticación, validación y error
│   │   ├── models/             # Interfaces y modelos de dominio
│   │   ├── repositories/       # Abstracción y acceso a la base de datos
│   │   ├── routes/             # Definición de endpoints REST
│   │   ├── services/           # Lógica y reglas de negocio del sistema
│   │   ├── types/              # Declaraciones de tipos TypeScript y DTOs
│   │   ├── utils/              # Funciones auxiliares de cálculo y formato
│   │   ├── app.ts              # Configuración de la aplicación Express
│   │   └── server.ts           # Punto de entrada y levantamiento del servidor
│   ├── tests/                  # Tests unitarios y de integración (Vitest)
│   ├── .env.example            # Plantilla de variables de entorno para backend
│   ├── package.json            # Dependencias y scripts del backend
│   ├── tsconfig.json           # Configuración de TypeScript
│   └── vitest.config.ts        # Configuración de Vitest para backend
│
├── frontend/
│   ├── public/                 # Archivos estáticos públicos (logos, favicons)
│   ├── src/
│   │   ├── components/         # Componentes reutilizables (UI, layout, dashboard)
│   │   ├── context/            # Contextos globales de React (AuthContext)
│   │   ├── hooks/              # Custom hooks para lógica desacoplada
│   │   ├── pages/              # Vistas principales (Dashboard, Movimientos, Login)
│   │   ├── routes/             # Enrutamiento de la aplicación (protegidas/públicas)
│   │   ├── services/           # Clientes HTTP y llamadas al backend
│   │   ├── styles/             # Estilos globales y configuración de estilos
│   │   ├── types/              # Tipos compartidos en la interfaz
│   │   ├── utils/              # Funciones auxiliares de formato y fechas
│   │   ├── App.tsx             # Componente raíz de React
│   │   └── Main.tsx            # Punto de montaje en el DOM
│   ├── .env.example            # Plantilla de variables de entorno para frontend
│   ├── package.json            # Dependencias y scripts del frontend
│   ├── tsconfig.json           # Configuración de TypeScript
│   ├── vite.config.ts          # Configuración del bundler Vite
│   └── vitest.config.ts        # Configuración de pruebas para frontend
│
├── docs/                       # Documentación complementaria (API, diagramas)
│   └── API.md
├── .github/                    # Automatización e integración continua
│   └── workflows/              # GitHub Actions para CI/CD
├── .gitignore                  # Reglas de exclusión de Git
├── pnpm-workspace.yaml         # Configuración del monorepo con pnpm
├── package.json                # Configuración raíz del monorepo
├── PROPUESTA.md                # Documento completo de la propuesta académica
└── README.md                   # Documentación principal del proyecto
```

---

## 🎯 Alcance del MVP y Roadmap

El desarrollo del proyecto se ejecutará de manera incremental y modular:

### Fase 1: MVP (Mínimo Producto Viable) — _Prioridad Alta_

- **Autenticación:** Registro de usuario, inicio de sesión, cierre de sesión y control de accesos mediante JWT.
- **Gestión de Movimientos:** Crear, listar, editar y eliminar ingresos y gastos (monto, fecha, descripción y categoría).
- **Gestión de Categorías:** Categorías predeterminadas y personalizadas separadas por tipo (ingreso / gasto).
- **Dashboard Principal:** Visualización de balance total, ingresos del mes, gastos del mes y listado de últimos movimientos.

### Fase 2: Análisis Financiero — _Prioridad Media_

- Gráficos de distribución de gastos por categoría (Recharts).
- Comparativa visual entre meses/períodos.
- Indicador de tasa de ahorro mensual.

### Fase 3: Planificación Avanzada — _Prioridad Futura_

- Presupuestos límite por categoría con alertas visuales de exceso.
- Definición y seguimiento de metas de ahorro.
- Exportación e importación de reportes en formato CSV.

---

## 📜 Metodología de Trabajo y Convenciones

Para mantener el repositorio organizado entre los cuatro, usamos la estrategia Git Flow orientada a ramas de características y los estandares de contribucion detallados a continuacion.

### Estrategia de Ramificación Git Flow

- main: Código en su version estable y completa (V1.0).

- release/x.0 : Preparacion de una nueva version. Se crea cuando develop tiene suficientes funcionalidades para una entrega, sirve para corregir errores menores durante la revision, ajustar numeros de version, actualizar documentacion y **IMPORTANTE: no agregar funcionalidades nuevas**.
  > \*Se crea desde **develop\***, y una vez que se completa el trabajo en dicha rama (obtenemos la version estable) se realiza el merge a develop y a main para actualizar el codigo en ambas ramas.
- develop: rama de desarrollo.

- feature/nombre-de-la-funcionalidad: Para crear nuevas funcionalidades.

  > \*Se crea desde **develop\*** para trabajar en una nueva funcion a implementar. Una vez completada la funcionalidad, se hace el merge a develop y se elimina la rama.

- hotfix: Correcion urgente de un error que se encuentra en main.
  > Cuando encontramos un error importante en la version estable, \*se crea desde **main\*** para trabajar en la correcion del error y solucionarlo lo antes posible. Una vez corregido el bug, se hace el merge a main y a develop.

### Estandares de contribución

- **Commits**: Utilizar titulos descriptivos con el formato `tipo: descripción`.

  > Ejemplo: `feat: implementación de login` o `fix: corrección de ruta API`.

- **Revisiones de Pull Requests (PR)**: Al menos un compañero de equipo debe revisar una solicitud de incorporacion de cambios antes de fusionarla (merge) con develop.
