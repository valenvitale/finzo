# FINZO

**Finzo** es una aplicación web destinada a la gestión de finanzas personales.

Permite a los usuarios registrar sus ingresos y gastos, clasificarlos mediante categorías y consultar información resumida sobre su situación financiera.

El objetivo principal es transformar el registro de movimientos financieros en información útil

## Objetivo general

Desarrollar una aplicación web que permita registrar, organizar y analizar ingresos y gastos personales.

## Objetivos técnicos

Durante el desarrollo se busca aplicar:

- Arquitectura cliente-servidor.
- Desarrollo frontend con React y TypeScript.
- Desarrollo backend con Node.js, TypeScript y Express.
- Persistencia de datos mediante PostgreSQL.
- Autenticación mediante Supabase Auth.
- API REST.
- Separación de responsabilidades.
- Principios SOLID.
- Testing automatizado.
- Control de versiones con Git.
- Pull Requests y Code Review.
- Integración continua mediante GitHub Actions.
- Refactoring.
- Documentación técnica

## Alcance
El proyecto se desarrollará de manera incremental.

La primera versión funcional será un MVP que permita:
- Autenticación
    - Registro.
    - Inicio de sesión.
    - Cierre de sesión.
    - Identificación del usuario autenticado.
- Movimientos
    - Crear ingresos.
    - Crear gastos.
    - Consultar movimientos.
    - Editar movimientos.
    - Eliminar movimientos.
    - Filtrar movimientos.
- Categorías
    - Crear categorías.
    - Consultar categorías.
    - Editar categorías.
    - Eliminar categorías.
    - Diferenciar categorías de ingresos y gastos.
- Dashboard
    - Mostrar saldo.
    - Mostrar ingresos del período.
    - Mostrar gastos del período.
    - Mostrar resumen mensual.

Las funcionalidades adicionales se incorporarán únicamente una vez que el MVP se encuentre estable.

## Funcionalidades posteriores al MVP
Dependiendo del tiempo disponible se podrán incorporar:
- Nivel 2
    - Estadísticas.
    - Gráficos de ingresos y gastos.
    - Distribución de gastos por categoría.
    - Evolución del balance.
    - Tasa de ahorro.
    - Categoría con mayor gasto.
    - Comparación entre períodos.
- Nivel 3
    - Presupuestos.
    - Metas de ahorro.
    - Gastos recurrentes.
    - Búsqueda de movimientos.
    - Comparación entre meses.
- Nivel 4
    - Notificaciones.
    - Gráficos avanzados.
    - Roles de usuario.
    - Configuración personalizada.
    - Importación CSV.
    - Exportación CSV.

# STACK TECNOLÓGICO

## FRONTEND
| Tecnología   | Uso                               |
| ------------ | --------------------------------- |
| React        | Construcción de la interfaz       |
| TypeScript   | Tipado estático                   |
| Tailwind CSS | Estilos                           |
| Vite         | Herramienta de desarrollo y build |

## BACKEND
| Tecnología | Uso                     |
| ---------- | ----------------------- |
| Node.js    | Runtime                 |
| TypeScript | Tipado estático         |
| Express    | Framework para API REST |

## BASE DE DATOS Y AUTENTICACIÓN
| Tecnología    | Uso                               |
| ------------- | --------------------------------- |
| Supabase      | Plataforma de backend y servicios |
| PostgreSQL    | Base de datos relacional          |
| Supabase Auth | Autenticación                     |
| JWT           | Identificación de sesiones        |

## TESTING
| Tecnología      | Uso                  |
| --------------- | -------------------- |
| Vitest          | Tests                |
| Testing Library | Testing del frontend |

## DevOps
| Tecnología     | Uso                        |
| -------------- | -------------------------- |
| Git            | Control de versiones       |
| GitHub         | Repositorio y colaboración |
| GitHub Actions | Integración continua       |
| Vercel         | Deploy del frontend        |
| Supabase       | Hosting de backend/DB      |

## Gestión del Proyecto 
- Jira
- GitHub Issues
- GitHub Pull Requests
- Discord / reuniones presenciales

## Arquitectura

```text
┌──────────────────────────────────┐
│            FRONTEND              │
│                                  │
│       React + TypeScript         │
│           + Vite                 │
│                                  │
└───────────────┬──────────────────┘
                │
                │ HTTP / REST
                ▼
┌──────────────────────────────────┐
│             BACKEND              │
│                                  │
│      Node.js + TypeScript        │
│            Express               │
│                                  │
│ Controllers                      │
│      ↓                           │
│ Services                         │
│      ↓                           │
│ Repositories                     │
│      ↓                           │
└───────────────┬──────────────────┘
                │
                ▼
┌──────────────────────────────────┐
│             SUPABASE             │
│                                  │
│          PostgreSQL              │
│                                  │
│          Supabase Auth           │
└──────────────────────────────────┘
```
## Flujo General

```text
Usuario
   │
   ▼
Formulario React
   │
   ▼
Request HTTP
   │
   ▼
Express Route
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
Supabase / PostgreSQL
   │
   ▼
Response
   │
   ▼
Frontend
```

# INSTALACIÓN

1. Clonar el repositorio
``` bash
git clone <URL_DEL_REPOSITORIO>
cd finzo
```

2. Instalar dependencias
``` bash
pnpm install
```

Si el proyecto esta dividido en frontend y backend:

``` bash
cd frontend
pnpm install

cd backend
pnpm install
```

# VARIABLES DEL ENTORNO
El archivo `.env` no debe subirse al repositorio.

Debe existir un archivo `.env.example` que muestre las variables necesarias sin contener valores sensibles.

Ejemplo:
```
DATABASE_URL=
JWT_SECRET=
```

## '.gitignore':

El respositorio debe ignorar:
* .env
* .env.local
* node_modules/
* dist/
* coverage/

# ESTRUCTURA DEL PROYECTO

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

## ¿Por qué esta estructura?
Cada parte tendria una **responsabilidad clara**.

                  HTTP
                   │
                   ▼
              ┌─────────┐
              │ Routes  │
              └────┬────┘
                   │
                   ▼
            ┌──────────────┐
            │ Controllers  │
            └──────┬───────┘
                   │
                   ▼
             ┌──────────┐
             │ Services │
             └────┬─────┘
                  │
                  ▼
          ┌────────────────┐
          │  Repositories  │
          └───────┬────────┘
                  │
                  ▼
             PostgreSQL

## A DEFINIR !!

### DEPENDENCIAS

1. Backend
```text
| Dependencia             | Para qué la usamos                             |
| ----------------------- | ---------------------------------------------- |
| `express`               | Crear la API REST y manejar rutas HTTP         |
| `@supabase/supabase-js` | Conectarnos con Supabase                       |
| `cors`                  | Permitir comunicación entre frontend y backend |
| `dotenv`                | Cargar variables de entorno                    |
| `zod`                   | Validar los datos que recibe la API            |

   > DESAROLLO
   | Dependencia         | Para qué                               |
   | ------------------- | -------------------------------------- |
   | `typescript`        | Tipado estático                        |
   | `tsx`               | Ejecutar TypeScript durante desarrollo |
   | `vitest`            | Testing                                |
   | `supertest`         | Probar endpoints HTTP                  |
   | `eslint`            | Lint                                   |
   | `typescript-eslint` | Integrar ESLint con TypeScript         |
```
2. Frontend
```text
| Dependencia             | Para qué                          |
| ----------------------- | --------------------------------- |
| `react`                 | Construcción de la interfaz       |
| `react-dom`             | Renderizar React en el navegador  |
| `react-router-dom`      | Navegación entre páginas          |
| `@supabase/supabase-js` | Autenticación/sesión con Supabase |
| `recharts`              | Gráficos de reportes              |
| `zod`                   | Validación de formularios/datos   |

   > DESARROLLO
   | Dependencia                   | Para qué                             |
   | ----------------------------- | ------------------------------------ |
   | `typescript`                  | Tipado                               |
   | `vite`                        | Servidor de desarrollo y build       |
   | `@vitejs/plugin-react`        | Integración React + Vite             |
   | `vitest`                      | Tests                                |
   | `@testing-library/react`      | Testing de componentes               |
   | `@testing-library/jest-dom`   | Matchers para DOM                    |
   | `eslint`                      | Lint                                 |
   | `typescript-eslint`           | ESLint + TypeScript                  |
   | `eslint-plugin-react-hooks`   | Reglas para React Hooks              |
   | `eslint-plugin-react-refresh` | Reglas relacionadas con Fast Refresh |
```

 3. Tailwind ??

    Como el diseño que charlamos contiene fondo oscuro, cards, bordes redondeados, colores suaves,         componentes reutilizables y dashbord (entre otras cosas), Tailwind CSS nos vendria bien pero           todavia esta por definirse. Dependiendo de la versión/configuración que elijamos, tendriamos que       determinar las herramientas correspondientes de Vite.
