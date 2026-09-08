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

## Flujo General

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

# INSTALACIÓN

1. Clonar el repositorio
``` bash
    git clone <URL_DEL_REPOSITORIO>
    cd finzo
```