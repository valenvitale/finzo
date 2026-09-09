# FINZO

**Finzo** es una aplicación web destinada a la gestión de finanzas personales.

Permite a los usuarios registrar sus ingresos y gastos, clasificarlos mediante categorías y consultar información resumida sobre su situación financiera.

El objetivo principal es transformar el registro de movimientos financieros en información útil.

## Integrantes del Proyecto

* **Alessio Cragno:** @
* **Federico Heinreich** @fedeheinreich
* **Máximo Messina** @maxemessina
* **Valentina Vitale** @valenvitale

## Objetivo general

Desarrollar una aplicación web que permita registrar, organizar y analizar ingresos y gastos personales.

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
- Documentación técnica

---
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
## Dependencias elegidas (por definir)

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

## Alcance planificado para el desarrollo
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

Funcionalidades adicionales podrán ser incorporaradas una vez que el MVP se encuentre estable.

### Funcionalidades Extra
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