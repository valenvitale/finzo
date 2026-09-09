# PROYECTO INTEGRADOR — METODOLOGÍA DE SISTEMAS II

# Finzo: Sistema web de gestión de finanzas personales

**Documento actualizado:** 08/09/2026  
**Versión:** 4.0  
**Equipo:** Federico Heinrich, Valentina Vitale, Alesio Cragno, Maximo Messina.

---

**Propósito del documento:** Presentar la propuesta al grupo y servir como guía o mapa para diseñar, desarrollar, probar y defender el proyecto.

---

## 1. Resumen

**Finzo** será una aplicación web para registrar, organizar y analizar finanzas personales. Permitirá registrar ingresos, gastos, categorías y preferencias básicas, además de consultar el saldo y un resumen mensual.

El problema que busca resolver es cotidiano: muchas personas conocen su saldo, pero no identifican con claridad cuánto gastan, en qué categorías ni cómo cambia su situación financiera con el tiempo. Finzo busca centralizar esa información y convertirla en información útil para tomar decisiones.

La propuesta está pensada para **Metodología de Sistemas II**: tendrá un alcance controlado, una primera versión funcional y espacio suficiente para demostrar diseño, trabajo colaborativo, separación de responsabilidades, SOLID, refactoring, testing, documentación e integración continua.

> **Criterio principal:** priorizar un producto funcional, seguro, escalable y defendible antes que una gran cantidad de funcionalidades.

---

## 2. Objetivo, usuarios y preguntas que debe responder

### Objetivo general

Desarrollar una aplicación web mantenible y segura que permita a cada usuario registrar, consultar y analizar sus ingresos y gastos personales.

### Usuario objetivo

Personas que buscan controlar sus finanzas cotidianas sin utilizar una herramienta contable compleja ni conectar cuentas bancarias reales.

### Preguntas principales

- ¿Cuánto dinero gasté este mes?
- ¿En que categoria gasto más?
- ¿Cuanto dinero me ingresó este mes?
- ¿Cuanto me queda disponible?
- ¿Cómo se distribuyen mis gastos?
- En una fase posterior, ¿cómo evolucionó mi balance respecto a otros periodos?

### Objetivos académicos y técnicos

- Diseñar una solución con responsabilidades claras.
- Construir un MVP funcional y reproducible.
- Trabajar de forma colaborativa mediante ramas, issues y pull requests.
- Aplicar patrones y principios solo cuando resuelvan problemas concretos.
- Incorporar tests, refactoring, documentación y automatización durante el desarrollo.
- Registrar las decisiones relevantes para poder justificarlas en la defensa.

---

## 3. Alcance y prioridades

### 3.1 MVP obligatorio

#### Autenticación y perfil

- Registro, inicio y cierre de sesión.
- Acceso exclusivo a la información del usuario autenticado.
- Consulta y edición de nombre, moneda y preferencias básicas.

#### Movimientos

- Crear, editar, eliminar y consultar ingresos y gastos.
- Informar monto, tipo, categoría, descripción y fecha.
- Filtrar por fecha, categoría y tipo de movimiento.

#### Categorías

- Consultar categorías de ingreso y gasto.
- Crear, editar y eliminar categorías personalizadas.
- Impedir el uso de categorías inexistentes o pertenecientes a otro usuario.

#### Dashboard

- Saldo actual.
- Total de ingresos del mes.
- Total de gastos del mes.
- Balance mensual.
- Accesos rápidos a movimientos, categorías y perfil.

### 3.2 Funcionalidades posteriores al MVP

Se incorporarán únicamente si la base está estable y cumple la definición de terminado.

**Prioridad 2: Página de Estadisticas y Análisis**

- Distribución de los gastos por categoría mediante gráficos.
- Evolución mensual de ingresos, gastos y balance.
- Comparación de los resultados con el periodo anterior.
- Indicadores de tasa de ahorro, promedio de gastos y categoría con mayor consumo.

**Prioridad 3: Planificación financiera**

- Presupuestos por categoría.
- Metas de ahorro.
- Movimientos recurrentes.

**Prioridad 4: Mejoras complementarias**

- Importación y exportación CSV.
- Modo oscuro.

---

## 4. Requisitos funcionales y reglas de negocio

### RF-01 Autenticación

El sistema permitirá registrar usuarios, iniciar sesión, cerrar sesión y mantener una sesión válida.

### RF-02 Perfil

El usuario podrá consultar y modificar su nombre, moneda y preferencias habilitadas.

### RF-03 Gestión de movimientos

El usuario podrá crear, consultar, editar y eliminar movimientos propios.

### RF-04 Gestión de categorías

El usuario podrá utilizar categorías iniciales y administrar categorías personalizadas separadas por tipo: ingreso o gasto.

### RF-05 Consulta y filtros

El historial permitirá filtrar movimientos por intervalo de fechas, categoría y tipo.

### RF-06 Resumen financiero

El dashboard calculará los ingresos, gastos y el balance del mes actual. En el MVP no habrá selector de períodos; la consulta de otros intervalos quedará disponible mediante los filtros del historial.

### Reglas de negocio iniciales

- El monto debe ser mayor que cero.
- El tipo será `income`(ingreso) o `expense` (gasto).
- La categoría debe existir, corresponder al usuario y ser compatible con el tipo de movimiento.
- La fecha debe tener un formato válido.
- Un usuario solo podrá consultar o modificar sus propios datos.
- El balance se calculará como ingresos menos gastos.
- Las eliminaciones y ediciones deberán actualizar los resúmenes mostrados.
- Las validaciones críticas se ejecutarán en el backend; el frontend validará también para mejorar la experiencia.

---

## 4. Arquitectura propuesta

```text
┌──────────────────────────────┐
│ Frontend                     │
│ React + TypeScript + Vite    │
└──────────────┬───────────────┘
               │ HTTP / REST
               ▼
┌──────────────────────────────┐
│ Backend                      │
│ Node.js + TypeScript +       │
│ Express                      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Supabase                     │
│ Auth + PostgreSQL + RLS      │
└──────────────────────────────┘
```

### Estructura orientativa

```text
finzo/
│
├── backend/
│   │
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── transaction.controller.ts
│   │   │   ├── category.controller.ts
│   │   │   ├── profile.controller.ts
│   │   │   ├── budget.controller.ts
│   │   │   └── goal.controller.ts
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── transaction.service.ts
│   │   │   ├── category.service.ts
│   │   │   ├── profile.service.ts
│   │   │   ├── budget.service.ts
│   │   │   ├── goal.service.ts
│   │   │   └── report.service.ts
│   │   │
│   │   ├── repositories/
│   │   │   ├── transaction.repository.ts
│   │   │   ├── category.repository.ts
│   │   │   ├── profile.repository.ts
│   │   │   ├── budget.repository.ts
│   │   │   └── goal.repository.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── transaction.routes.ts
│   │   │   ├── category.routes.ts
│   │   │   ├── profile.routes.ts
│   │   │   ├── budget.routes.ts
│   │   │   ├── goal.routes.ts
│   │   │   └── report.routes.ts
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   │
│   │   ├── models/
│   │   │   ├── transaction.model.ts
│   │   │   ├── category.model.ts
│   │   │   ├── profile.model.ts
│   │   │   ├── budget.model.ts
│   │   │   └── goal.model.ts
│   │   │
│   │   ├── types/
│   │   │   ├── auth.types.ts
│   │   │   ├── transaction.types.ts
│   │   │   ├── category.types.ts
│   │   │   ├── profile.types.ts
│   │   │   ├── budget.types.ts
│   │   │   └── goal.types.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── calculations.ts
│   │   │   ├── errors.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── config/
│   │   │   ├── env.ts
│   │   │   └── supabase.ts
│   │   │
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── calculations.test.ts
│   │   │   ├── transaction.service.test.ts
│   │   │   └── category.service.test.ts
│   │   │
│   │   ├── integration/
│   │   │   ├── auth.test.ts
│   │   │   ├── transactions.test.ts
│   │   │   └── categories.test.ts
│   │   │
│   │   └── setup.ts
│   │
│   ├── migrations/
│   │   ├── 001_create_profiles.sql
│   │   ├── 002_create_categories.sql
│   │   ├── 003_create_transactions.sql
│   │   ├── 004_create_budgets.sql
│   │   └── 005_create_goals.sql
│   │
│   ├── seeders/
│   │   ├── seed.ts
│   │   └── data/
│   │       ├── categories.ts
│   │       └── demo-data.ts
│   │
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
│
│
├── frontend/
│   │
│   ├── src/
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   └── Loading.tsx
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── PageContainer.tsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── BalanceCard.tsx
│   │   │   │   ├── IncomeCard.tsx
│   │   │   │   ├── ExpenseCard.tsx
│   │   │   │   └── RecentTransactions.tsx
│   │   │   │
│   │   │   ├── transactions/
│   │   │   │   ├── TransactionForm.tsx
│   │   │   │   ├── TransactionTable.tsx
│   │   │   │   ├── TransactionFilters.tsx
│   │   │   │   └── TransactionCard.tsx
│   │   │   │
│   │   │   ├── categories/
│   │   │   │   ├── CategoryForm.tsx
│   │   │   │   ├── CategoryList.tsx
│   │   │   │   └── CategoryCard.tsx
│   │   │   │
│   │   │   ├── budgets/
│   │   │   │   ├── BudgetCard.tsx
│   │   │   │   ├── BudgetForm.tsx
│   │   │   │   └── BudgetProgress.tsx
│   │   │   │
│   │   │   ├── goals/
│   │   │   │   ├── GoalCard.tsx
│   │   │   │   ├── GoalForm.tsx
│   │   │   │   └── GoalProgress.tsx
│   │   │   │
│   │   │   └── reports/
│   │   │       ├── IncomeExpenseChart.tsx
│   │   │       ├── CategoryChart.tsx
│   │   │       └── SavingsRate.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   │
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Transactions.tsx
│   │   │   ├── Categories.tsx
│   │   │   ├── Budgets.tsx
│   │   │   ├── Goals.tsx
│   │   │   ├── Reports.tsx
│   │   │   ├── Profile.tsx
│   │   │   └── Settings.tsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── transaction.service.ts
│   │   │   ├── category.service.ts
│   │   │   ├── profile.service.ts
│   │   │   ├── budget.service.ts
│   │   │   ├── goal.service.ts
│   │   │   └── report.service.ts
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useTransactions.ts
│   │   │   ├── useCategories.ts
│   │   │   ├── useBudgets.ts
│   │   │   └── useGoals.ts
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   │
│   │   ├── types/
│   │   │   ├── transaction.types.ts
│   │   │   ├── category.types.ts
│   │   │   ├── profile.types.ts
│   │   │   ├── budget.types.ts
│   │   │   └── goal.types.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── AppRoutes.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── PublicRoute.tsx
│   │   │
│   │   ├── utils/
│   │   │   ├── formatCurrency.ts
│   │   │   ├── formatDate.ts
│   │   │   └── validations.ts
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   └── variables.css
│   │   │
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── public/
│   │   ├── logo.svg
│   │   ├── favicon.svg
│   │   └── images/
│   │
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── vitest.config.ts
│
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── pull-request.yml
│
├── docs/
│   └── API.md
│
├── .gitignore
├── README.md
├── PROPUESTA.md
├── package.json
└── pnpm-workspace.yaml
```

Esta estructura es una guía inicial. Podrá cambiar mediante una decisión documentada si el equipo detecta una alternativa más simple o adecuada.

---

## 5. Tecnologías y criterio de elección

| Área                | Propuesta                             | Uso principal                                                                        |
| ------------------- | ------------------------------------- | ------------------------------------------------------------------------------------ |
| Frontend            | React, TypeScript, Vite, Tailwind CSS | Interfaz, formularios y navegación                                                   |
| Backend             | Node.js, TypeScript, Express          | API REST y reglas de negocio                                                         |
| Datos               | Supabase con PostgreSQL               | Persistencia administrada                                                            |
| Autenticación       | Supabase Auth                         | Usuarios y sesiones                                                                  |
| Testing             | Vitest y Testing Library              | Vitest para tests unitarios, de servicios y de API; Testing Library para componentes |
| Automatización      | GitHub Actions                        | Lint, typecheck y tests                                                              |
| Versionado          | Git y GitHub                          | Código, issues y pull requests                                                       |
| Seguimiento         | Jira                                  | Backlog, responsables y estados                                                      |
| Frontend desplegado | Vercel                                | Publicación del cliente web                                                          |
| Backend desplegado  | Render                                | Publicación de la API Node.js y Express                                              |

### Decisiones cerradas en Taller I

- El repositorio utilizará `pnpm` como gestor de paquetes. El archivo `.nvmrc` indicará la versión de Node.js compatible con el proyecto; el README documentará cómo activarla con `nvm use` antes de instalar las dependencias.
- El backend se implementará con Node.js y Express y se desplegará en Render.
- Supabase se utilizará para autenticación, PostgreSQL y políticas RLS.
- Vitest será la herramienta común para ejecutar los tests unitarios, de servicios y de API; Testing Library se utilizará para los tests de componentes.
- Estrategia de borrado de categorías asociadas a movimientos.
- Moneda única por perfil y tratamiento de decimales.

---

## 6. Modelo inicial de datos

### `profiles`

- `id`
- `user_id` (único, referencia al usuario autenticado)
- `name`
- `currency`
- `preferences`
- `created_at`
- `updated_at`

### `categories`

- `id`
- `user_id`
- `name`
- `type` (`income` o `expense`)
- `created_at`
- `updated_at`

### `transactions`

- `id`
- `user_id`
- `category_id`
- `amount`
- `type` (`income` o `expense`)
- `description`
- `date`
- `created_at`
- `updated_at`

### Relaciones

```text
auth.users 1 ─── 1 profiles
auth.users 1 ─── M categories
auth.users 1 ─── M transactions
categories 1 ─── M transactions
```

Si se aprueban funcionalidades posteriores, podrán añadirse `budgets`, `goals` y `recurring_transactions`.

### Migraciones y datos iniciales

- Las migraciones SQL estarán versionadas y permitirán reproducir la estructura de la base de datos.
- Los seeders cargarán datos útiles para desarrollo y pruebas, sin ejecutarse automáticamente en producción.
- Los comandos definitivos se documentarán en el README una vez configurados y validados por el equipo.

---

## 7. API inicial orientativa

| Método | Ruta                | Descripción                                       |
| ------ | ------------------- | ------------------------------------------------- |
| GET    | `/profile`          | Consultar perfil propio                           |
| PATCH  | `/profile`          | Editar perfil propio                              |
| GET    | `/transactions`     | Listar y filtrar movimientos                      |
| POST   | `/transactions`     | Crear movimiento                                  |
| GET    | `/transactions/:id` | Consultar un movimiento propio                    |
| PATCH  | `/transactions/:id` | Editar un movimiento propio                       |
| DELETE | `/transactions/:id` | Eliminar un movimiento propio                     |
| GET    | `/categories`       | Listar categorías                                 |
| POST   | `/categories`       | Crear categoría                                   |
| PATCH  | `/categories/:id`   | Editar categoría propia                           |
| DELETE | `/categories/:id`   | Eliminar categoría propia                         |
| GET    | `/summary`          | Obtener ingresos, gastos y balance del mes actual |

La API de autenticación dependerá de la integración definida con Supabase Auth. Los contratos de entrada, salida y error deberán documentarse antes de implementar cada endpoint.

---

## 8. Calidad de diseño, SOLID y refactoring

No se incorporarán patrones de forma artificial. El equipo partirá de una solución simple, observará problemas concretos y documentará cualquier cambio estructural.

### Principios a aplicar

- **Responsabilidad única:** evitar controladores que validen, calculen y accedan directamente a la base.
- **Abierto/cerrado:** permitir extensiones razonables sin modificar innecesariamente código estable.
- **Inversión de dependencias:** aislar la lógica de negocio del cliente de datos cuando aporte testabilidad y mantenibilidad.
- **Simplicidad:** evitar abstracciones que no resuelvan una necesidad actual.

### Patrones posibles, no obligatorios

- **Repository:** separar persistencia y negocio.
- **Strategy:** intercambiar cálculos o reglas cuando existan variantes reales.
- **Factory:** construir objetos cuando la creación presente diferencias relevantes.

### Evidencia esperada de refactoring

Para cada refactoring importante se registrará:

1. Problema detectado.
2. Evidencia en el código o los tests.
3. Cambio realizado.
4. Resultado y consecuencias.

Ejemplo:

```text
Antes: Controller → Database
Después: Controller → Service → Repository → Database
```

El cambio solo se considerará valioso si mejora claridad, pruebas, mantenimiento o separación de responsabilidades.

---

## 9. Testing, seguridad y manejo de errores

### Estrategia de testing

- **Tests unitarios:** cálculos y reglas aisladas, como el balance.
- **Tests de servicios:** creación, edición y autorización de movimientos.
- **Tests de API:** códigos de estado, validaciones y respuestas.
- **Tests de componentes:** formularios y estados importantes del frontend.

### Casos mínimos

- Crear un ingreso y un gasto válidos.
- Rechazar monto cero o negativo.
- Rechazar fecha o tipo inválidos.
- Rechazar categoría inexistente o incompatible.
- Impedir leer o modificar datos de otro usuario.
- Actualizar correctamente el balance tras crear, editar o eliminar.
- Aplicar filtros combinados.
- Mostrar estados de carga, error y lista vacía.

### Seguridad

- Autenticación gestionada con Supabase Auth.
- Verificación de sesión o token en operaciones protegidas.
- Autorización en backend y políticas RLS para aislar datos por usuario.
- Secretos únicamente en variables de entorno.
- `.env` excluido del repositorio y `.env.example` versionado sin valores sensibles.
- Validación y normalización de entradas en la API.
- Mensajes de error útiles sin exponer información sensible.
- Revisión específica de autorización en cada operación por identificador.

### Respuestas de error orientativas

- `400`: datos inválidos.
- `401`: usuario no autenticado.
- `403`: operación no autorizada.
- `404`: recurso inexistente o no accesible.
- `409`: conflicto de datos, cuando corresponda.
- `500`: error interno controlado y registrado.

---

## 10. Flujo de trabajo con Git y seguimiento

### Ramas

- `main`: versión estable.
- `develop`: rama de integración del trabajo aprobado.
- `feature/nombre`: funcionalidad o tarea concreta, creada desde `develop`.
- `release/x.y`: preparación de una entrega; solo correcciones, versión y documentación.
- `hotfix/nombre`: corrección urgente creada desde `main`, integrada luego en `main` y `develop`.

```text
feature/* → Pull Request → revisión → develop

develop → release/* → pruebas y ajustes → main + develop

main → hotfix/* → main + develop
```

### Pull requests y commits

- No trabajar directamente sobre `main` ni `develop`.
- Cada PR debe enlazar su ticket, describir el cambio e incluir instrucciones de prueba.
- Al menos un compañero debe revisar el PR antes del merge.
- Usar commits descriptivos, por ejemplo:
  - `feat: implementar creación de movimientos`
  - `fix: impedir montos negativos`
  - `test: cubrir cálculo de balance`
  - `docs: actualizar instrucciones de instalación`

### Jira e issues

- Una funcionalidad, error o tarea técnica tendrá un ticket.
- Estados sugeridos: `Backlog → In Progress → In Review → Done`.
- Cada ticket tendrá responsable principal, criterios de aceptación y dependencias.
- Los puntos de historia se utilizarán como medida relativa, no como horas ni garantía de capacidad.
- El equipo recalibrará las estimaciones después del primer sprint según su velocidad real.

### Reuniones

Dos o tres sincronizaciones breves por semana, ajustables por el equipo:

1. Qué completé.
2. Qué haré a continuación.
3. Qué bloqueo necesito resolver.

Las decisiones y bloqueos importantes deberán quedar por escrito en Jira.

---

## 11. Integración continua y documentación

### Pipeline mínimo por pull request

```text
Configurar la versión de Node.js indicada en .nvmrc
        ↓
Instalar dependencias con pnpm
    ↓
Lint
        ↓
Typecheck
        ↓
Tests
        ↓
Build
```

La protección de ramas impedirá integrar cambios si fallan los controles obligatorios o falta la revisión requerida.

### Documentación mínima

**README.md**

- Objetivo del proyecto.
- Requisitos previos.
- Instalación y variables de entorno.
- Migraciones y seeders.
- Ejecución de frontend, backend y tests.
- Estructura general y enlaces relevantes.

**Documentación de API**

- Rutas, autenticación, parámetros, respuestas y errores.

---

## 12. Organización del equipo

Los roles son responsabilidades principales, no áreas exclusivas.

### Integrante 1: backend y autenticación

- Configuración de API y autenticación.
- Sesiones, autorización y variables de entorno.
- Apoyo en documentación de API.

### Integrante 2: backend y negocio

- Movimientos, categorías, perfil y resumen financiero.
- Services, repositories y reglas de negocio.

### Integrante 3: frontend de operaciones

- Rutas, login, registro, movimientos y categorías.
- Formularios, validaciones de experiencia y estados de interfaz.

### Integrante 4: frontend, calidad y automatización

- Dashboard, análisis si se aprueba y coherencia visual.
- Integración continua y apoyo en testing.

### Responsabilidades compartidas

- Revisar pull requests.
- Escribir y mantener tests.
- Participar en decisiones técnicas.
- Actualizar documentación.
- Conocer el flujo completo del sistema.
- Rotar o emparejar tareas para evitar conocimiento concentrado.

---

## 13. Plan de trabajo y entregas

### Etapa 1: fundación

**Meta:** que todos puedan clonar y ejecutar el proyecto.

- Repositorio, ramas y protección.
- Estructura inicial de frontend y backend.
- Integración inicial con Supabase.
- Variables de entorno.
- Base de testing, lint y typecheck.
- README inicial y tablero de trabajo.

### Etapa 2: MVP

**Meta:** completar el recorrido principal de un usuario.

- Registro, login y logout.
- Perfil básico.
- CRUD de movimientos.
- CRUD de categorías.
- Historial y filtros.
- Dashboard con resumen mensual.

### Etapa 3: calidad y evolución

**Meta:** demostrar mantenibilidad y desarrollo justificado.

- Tests de servicios y API.
- Refactoring documentado.
- Aplicación justificada de SOLID o patrones.
- Documentación de API y decisiones.
- Integración continua estable.

### Etapa 4: cierre

**Meta:** entregar y defender una versión estable.

- Corrección de errores.
- Revisión de seguridad y autorización.
- Pruebas finales y build reproducible.
- Preparación de demostración y defensa.
- Solo si sobra capacidad: funcionalidades opcionales priorizadas.

### Cronograma de la Materia

| Hito               | Fecha indicada | Resultado esperado                                                        |
| ------------------ | -------------: | ------------------------------------------------------------------------- |
| Taller I           |          11/09 | Proyecto definido, repositorio, README, dependencias y setup reproducible |
| Taller II          |          16/10 | Diseño, patrones justificados, SOLID, refactoring y mantenibilidad        |
| Taller III         |          27/11 | Documentación, testing, calidad, automatización, CI y entrega             |
| Presentación final |          04/12 | Presentación grupal y defensa individual                                  |

---

## 14. Definicion de tarea completada

Una tarea se considera terminada cuando, según corresponda:

- Cumple sus criterios de aceptación.
- El código funciona localmente y pasa el build.
- No presenta errores de TypeScript ni lint.
- Incluye tests relevantes y estos pasan.
- Contempla validaciones, errores y autorización.
- Tiene un PR enlazado al ticket.
- Fue revisada por al menos un compañero.
- La documentación afectada quedó actualizada.
- Fue integrada en la rama correspondiente.
- Puede ser explicada por más de un integrante.

Una historia incompleta al final del sprint no se contabiliza como terminada; vuelve a planificarse con claridad sobre lo que falta.

---

## 15. Riesgos y mitigaciones

| Riesgo                       | Impacto                            | Mitigación                                                          |
| ---------------------------- | ---------------------------------- | ------------------------------------------------------------------- |
| Ampliar demasiado el alcance | Retrasos y baja calidad            | Congelar el MVP y exigir que los extras pasen por priorización      |
| Dejar tests para el final    | Regresiones y refactoring riesgoso | Añadir tests dentro de la Definicion de tarea completada                        |
| Sobrediseñar                 | Complejidad innecesaria            | Exigir un problema concreto antes de introducir un patrón           |
| Integración tardía           | Conflictos y fallos acumulados     | PR pequeños e integración frecuente en `develop`                    |
| Problemas de autorización    | Exposición de datos                | Tests de aislamiento, middleware y RLS desde el MVP                 |
| Entorno no reproducible      | Bloqueos del equipo                | README actualizado, `.env.example`, migraciones y versiones fijadas |
| Estimaciones poco realistas  | Mala planificación                 | Medir velocidad real y ajustar alcance en cada sprint               |

---

## 16. Indicadores de éxito

El proyecto se considerará exitoso si al cierre:

- Un usuario puede completar el flujo principal sin ayuda.
- Los datos de distintos usuarios permanecen aislados.
- El equipo puede instalar y ejecutar el sistema siguiendo el README.
- Los controles automáticos pasan en la versión presentada.
- Existen tests para reglas y riesgos críticos.
- Las decisiones y refactorings importantes pueden explicarse con evidencia.
- Todos los integrantes comprenden la arquitectura y pueden defender una parte distinta del sistema.
- El alcance entregado es coherente con el MVP acordado.

---


