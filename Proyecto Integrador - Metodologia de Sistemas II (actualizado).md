# PROYECTO INTEGRADOR — METODOLOGÍA DE SISTEMAS II

# 💰 FINZO

### Sistema de gestión y análisis de finanzas personales

---

## 1. IDEA GENERAL

### ¿Qué queremos desarrollar?

**Finzo** será una aplicación web que permita a una persona llevar un registro de sus finanzas personales.

El usuario podrá registrar sus:

- ingresos
- gastos
- categorías
- datos de perfil y preferencias básicas

y posteriormente consultar información sobre su situación financiera mediante estadísticas, gráficos, filtros y resúmenes.

La aplicación buscará resolver un problema sencillo pero cotidiano:

> Muchas personas saben cuánto dinero tienen, pero no saben exactamente en qué lo están gastando, cuánto gastan por categoría o cómo evolucionan sus gastos a lo largo del tiempo.

Finzo busca centralizar esa información y convertirla en información útil para tomar decisiones.

## 2. ¿POR QUÉ ELEGIMOS ESTE PROYECTO?

La propuesta está pensada específicamente para las características de Metodología de Sistemas II.

La materia establece que el proyecto debe tener un **alcance razonable**, ser suficientemente pequeño como para poder mejorarlo y permitir aplicar los conceptos trabajados durante la cursada. También aclara que no se busca hacer la mayor cantidad posible de funcionalidades, sino demostrar criterio, calidad y evolución.

Finzo cumple con esto porque:

#### Es suficientemente pequeño

El núcleo del sistema puede reducirse a:

```text
Usuario
   ↓
Ingresos / Gastos
   ↓
Categorías
   ↓
Balance
```

Por lo tanto, podemos tener una primera versión funcional rápidamente.

#### Pero permite evolucionar

A partir de ese núcleo podemos incorporar:

- Presupuestos
- Metas de ahorro
- Estadísticas
- Gastos recurrentes
- Filtros
- Historial
- Exportación
- Diferentes tipos de usuarios
- Mejoras de seguridad

Sin necesidad de convertirlo en un sistema gigantesco.

#### Permite aplicar los conceptos de la materia

El proyecto puede utilizarse para trabajar:

- Diseño
- Separación de responsabilidades
- SOLID
- Patrones cuando realmente sean necesarios
- Refactoring
- Testing
- Documentación
- Git/GitHub
- Integración continua
- Mantenibilidad

Esto es especialmente importante porque la materia aclara que los patrones no deben agregarse artificialmente: primero se identifica un problema y después se evalúa si un patrón ayuda a resolverlo.

## 3. OBJETIVO PRINCIPAL

Desarrollar una aplicación web que permita a los usuarios registrar, organizar y analizar sus ingresos y gastos personales.

El sistema debe permitir responder preguntas como:

- ¿Cuánto dinero gasté este mes?
- ¿En qué categoría gasto más?
- ¿Cuánto dinero ingresó?
- ¿Cuánto me queda disponible?
- ¿Cómo evolucionaron mis gastos respecto al mes anterior?

## 4. ALCANCE DEL PROYECTO

Es muy importante definir desde el principio qué vamos a hacer y qué NO vamos a hacer.

La idea no es intentar construir una aplicación financiera profesional.

### SÍ vamos a desarrollar en el MVP

#### Usuarios

- Registro
- Inicio de sesión
- Autenticación
- Cierre de sesión
- Consulta y edición del perfil

#### Movimientos

- Crear ingreso
- Crear gasto
- Editar movimiento
- Eliminar movimiento
- Consultar movimientos
- Filtrar movimientos

#### Categorías

- Categorías de ingresos
- Categorías de gastos
- Categorías personalizadas

#### Dashboard

- Saldo actual
- Ingresos del mes
- Gastos del mes
- Balance mensual
- Accesos a movimientos y perfil

#### Perfil

- Consultar datos personales
- Editar nombre y datos básicos

## 5. FUNCIONALIDADES OPCIONALES

Estas funcionalidades NO deberían formar parte del MVP.
Se pueden implementar solamente si el proyecto base ya está estable.

### Nivel 2

- Página de estadísticas que contenga:
  - Gráficos de ingresos y gastos
  - Distribución de gastos por categoría
  - Evolución del balance a lo largo del tiempo
  - Indicadores importantes, como tasa de ahorro y categoría con mayor gasto

### Nivel 3

- Presupuestos (establecer límites por categoría)
- Metas de ahorro (fijar objetivos y registrar progreso)
- Gastos recurrentes
- Comparación entre meses
- Búsqueda de movimientos

### Nivel 4

- Notificaciones
- Gráficos más avanzados
- Diferentes roles de usuario
- Modo oscuro
- Configuración personalizada
- Importación CSV para cargar esos datos en la web
- Exportación CSV

### Importante

No debemos comprometernos desde el principio a implementar todo. La prioridad será:

```
FUNCIONALIDAD BÁSICA
        ↓
CALIDAD
        ↓
TESTS
        ↓
REFACTORING
        ↓
FUNCIONALIDADES EXTRA
```

La materia explícitamente indica que la cantidad de funcionalidades, líneas de código o commits no determina la calidad del proyecto.

## 6. MVP — PRIMERA VERSIÓN

El MVP debería ser extremadamente claro. Un usuario puede:

- Registrarse
- Iniciar sesión
- Registrar un ingreso
- Registrar un gasto
- Elegir una categoría
- Consultar sus movimientos
- Ver su saldo
- Filtrar movimientos por fecha/categoría
- Ver un resumen mensual en el Dashboard

Con esto ya tenemos un sistema funcional.

## 7. EJEMPLO DE USO

Un usuario ingresa a Finzo.

### Dashboard

```
─────────────────────────────────────
           FINZO

Saldo disponible
$ 450.000

Ingresos             Gastos
$ 900.000            $ 450.000

─────────────────────────────────────

Gastos del mes

Comida          $120.000
Transporte       $80.000
Hogar            $90.000
Entretenimiento  $60.000
Otros            $100.000

─────────────────────────────────────
```

El Dashboard debe priorizar la lectura rápida del estado actual. Los gráficos detallados, las comparaciones entre períodos y los indicadores históricos pertenecerán a una página independiente de Análisis, para evitar sobrecargar la pantalla principal.

## 8. REGISTRAR UN GASTO

El usuario selecciona:

```
Tipo:
○ Ingreso
● Gasto

Monto:
$25.000

Categoría:
Comida

Descripción:
Supermercado

Fecha:
03/09/2026

[ GUARDAR ]
```

## 9. REGISTRAR UN INGRESO

Por ejemplo:

```
Tipo:
● Ingreso

Monto:
$850.000

Categoría:
Sueldo

Descripción:
Sueldo septiembre

Fecha:
01/09/2026

[ GUARDAR ]
```

El balance pasa a actualizarse.

## 10. CATEGORÍAS

El sistema tendrá categorías para organizar los movimientos.

### Ejemplo

**Gastos:**

- Comida
- Transporte
- Hogar
- Salud
- Entretenimiento
- Educación
- Ropa
- Otros

**Ingresos:**

- Sueldo
- Freelance
- Venta
- Inversiones
- Otros

## 11. PRESUPUESTOS (FUNCIONALIDAD OPCIONAL - NIVEL 3)

El usuario podrá establecer límites.

### PRESUPUESTO SEPTIEMBRE

**Comida**

- Límite: $150.000
- Gastado: $120.000
- Disponible: $30.000

```
████████████████░░░░
       80%
```

## 12. METAS DE AHORRO (FUNCIONALIDAD OPCIONAL - NIVEL 3)

El usuario podrá crear objetivos.

### META: Notebook

- Objetivo: $1.500.000
- Ahorrado: $750.000

```
██████████░░░░░░░░
       50%
```

- Faltan: $750.000

## 13. DASHBOARD

El dashboard será una de las partes principales del frontend.

Podría mostrar:

```
┌──────────────────────────────────────────┐
│              SEPTIEMBRE                  │
├──────────────────────────────────────────┤
│                                          │
│  INGRESOS       GASTOS        BALANCE     │
│  $900.000       $450.000      $450.000    │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  GASTOS POR CATEGORÍA                    │
│                                          │
│  Comida          ███████████             │
│  Hogar           ███████                 │
│  Transporte      █████                   │
│  Entretenimiento ████                    │
│                                          │
└──────────────────────────────────────────┘
```

## 14. PÁGINA DE ANÁLISIS Y ESTADÍSTICAS

La página de análisis complementará al Dashboard. Su objetivo será ayudar al usuario a detectar tendencias y tomar decisiones.

Podría incluir:

- Gráfico de ingresos, gastos y balance por mes
- Gráfico de distribución de gastos por categoría
- Comparación con el período anterior
- Promedio de gasto mensual
- Tasa de ahorro
- Categoría con mayor gasto

## 15. PERFIL DEL USUARIO

El perfil será una pantalla independiente dentro del área autenticada, accesible desde la navegación principal.

### PERFIL

- (FOTO)
- **Nombre:** Ana Pérez
- **Correo:** ana@email.com
- **Miembro desde:** 03/09/2026

### Preferencias

- **Moneda:** ARS
- **Formato:** Mensual

[ EDITAR DATOS ]

## 16. HISTORIAL DE MOVIMIENTOS

### MOVIMIENTOS

| Fecha | Concepto     | Categoría  | Monto     |
| ----- | ------------ | ---------- | --------- |
| 03/09 | Supermercado | Comida     | -$25.000  |
| 02/09 | Nafta        | Transporte | -$20.000  |
| 01/09 | Sueldo       | Sueldo     | +$850.000 |
| 01/09 | Netflix      | Entreten.  | -$15.000  |

### Filtros

- **Desde:** 01/09/2026
- **Hasta:** 30/09/2026
- **Categoría:** [ Todas ]
- **Tipo:** [ Todos ]

[ FILTRAR ]

## 17. ARQUITECTURA GENERAL

### Propuesta

```
┌────────────────────────────┐
│          FRONTEND          │
│       React + TypeScript   │
└──────────────┬─────────────┘
                      │ HTTP / REST
                      ↓
┌────────────────────────────┐
│          BACKEND           │
│     Node.js + TypeScript   │
└──────────────┬─────────────┘
                      │
                      ↓
┌────────────────────────────┐
│   Supabase: PostgreSQL     │
│   Auth + Database + API    │
└────────────────────────────┘
```

## 18. TECNOLOGÍAS

### Frontend

- **React:** componentes, formularios, navegación, dashboard.
- **TypeScript:** tipado, mayor seguridad, mejor autocompletado y código mantenible.

## 19. BACKEND

Node.js + TypeScript (API REST)

### Responsabilidades

- Validación
- Lógica de negocio
- Acceso a Supabase
- Manejo de errores
- Autorización

## 20. SUPABASE Y BASE DE DATOS

Supabase será parte central del stack y se utilizará para:

- Autenticación de usuarios y gestión de sesiones
- Base de datos PostgreSQL administrada
- Políticas de seguridad por fila (RLS) para aislar los datos de cada usuario
- Configuración de variables públicas y sensibles mediante el entorno

### Migrations y Seeders

Para garantizar reproducibilidad y facilitar onboarding:

**Migrations:**

- Scripts SQL versionados que crean/modifican la estructura de BD
- Ubicadas en `backend/migrations/`
- Se ejecutan automáticamente en CI/CD
- Permiten revertir cambios de BD si es necesario

**Seeders:**

- Scripts que populan BD con datos iniciales (categorías, usuarios de prueba)
- Ubicados en `backend/seeders/`
- Facilitan desarrollo local y testing
- No se ejecutan en producción automáticamente

**Comandos:**

```bash
# Ejecutar migrations
pnpm run migrate

# Revertir última migration
pnpm run migrate:rollback

# Ejecutar seeders
pnpm run seed
```

## 21. MODELO INICIAL DE DATOS

Podríamos tener:

### profiles

```
├── id
├── user_id
├── name
├── currency
├── preferences
└── created_at
```

### auth.users (gestionada por Supabase Auth)

```
├── id
├── email
└── created_at
```

### categories

```
├── id
├── user_id
├── name
├── type
└── created_at
```

### transactions

```
├── id
├── user_id
├── category_id
├── amount
├── type
├── description
├── date
└── created_at
```

> Si se añaden funcionalidades de nivel 3, se incluirán tablas budgets y goals.

## 22. RELACIONES

```
┌─────────────────────────────────────────────────────┐
│                      USER                          │
│  (id, email, created_at)                           │
└─────────────────────────────────────────────────────┘
           │                           │
           │ (1:M)                     │ (1:M)
           ↓                           ↓
┌──────────────────────┐    ┌──────────────────────┐
│    TRANSACTIONS      │    │    CATEGORIES        │
│ (id, user_id,       │    │ (id, user_id,        │
│  category_id,       │    │  name, type)         │
│  amount, type,      │    │                      │
│  description,       │    │ types:               │
│  date)              │    │ - income             │
└──────────────────────┘    │ - expense            │
           │                └──────────────────────┘
           │ (M:1)
           ↓
    Foreign Key
   category_id
```

## 23. AUTENTICACIÓN

```
REGISTER
   ↓
Supabase Auth registra el usuario
   ↓
LOGIN
   ↓
Supabase valida las credenciales
   ↓
Generar sesión y token JWT
   ↓
El backend verifica el token
        ↓
Acceder al sistema
```

## 24. ESTRUCTURA DEL BACKEND

Una posible estructura:

```
backend/
│
├── src/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── routes/
│   ├── middlewares/
│   ├── models/
│   ├── types/
│   ├── utils/
│   └── app.ts
│
├── tests/
├── package.json
└── README.md
```

## 25. SEPARACIÓN DE RESPONSABILIDADES

Una de las cosas que queremos demostrar es que no vamos a poner toda la lógica en los controllers.

Preferimos:

```
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

## 26. ¿QUÉ PATRONES USAR?

NO vamos a decidir desde ahora meter patrones porque sí. Primero desarrollamos, después observamos problemas y luego evaluamos si algún patrón realmente ayuda.

## 27. POSIBLES PATRONES QUE PODRÍAN APARECER

- **Strategy:** Para diferentes formas de calcular estadísticas o reglas.
- **Repository:** Para separar el acceso a datos de la lógica de negocio.
- **Factory:** Para construir distintos tipos de movimientos.

## 28. SOLID

El proyecto debe permitirnos identificar oportunidades para aplicar principios SOLID, como:

- **Single Responsibility Principle (SRP):** Evitar controllers que validen, consulten, calculen y envíen datos todo al mismo tiempo.
- **Open/Closed Principle:** Diseñar partes que puedan extenderse sin modificar el código base.
- **Dependency Inversion:** Evitar dependencias directas en lógicas concretas.

## 29. REFACTORING

El proyecto no tiene que salir perfecto desde el primer día. Parte del objetivo es demostrar evolución.

Por ejemplo:

**Primera versión:**

```
Controller
    ↓
Database
```

**Después detectamos que el controller maneja demasiada lógica y refactorizamos:**

```
TransactionController
        ↓
TransactionService
        ↓
TransactionRepository (Interactúa con el cliente de Supabase/PostgreSQL)
        ↓
PostgreSQL
```

Y documentamos el problema, la solución (separación de responsabilidades) y el resultado.

## 30. TESTING

Podemos tener:

- **Unit tests:** Para lógicas aisladas (ej. `calculateBalance()`).
- **Tests de servicios:** Validar si un servicio crea bien un movimiento.
- **Tests de API:** Comprobar si POST /transactions devuelve Status 201 o rechaza parámetros incorrectos.

## 31. CASOS QUE DEBEMOS TESTEAR

No solamente los casos felices. Debemos testear:

- Montos correctos
- Montos negativos (debe fallar)
- Categorías inexistentes (404)
- Intentos de modificar datos de otro usuario (403 Forbidden)

## 32. VALIDACIONES

Toda validación (monto, fechas, categorías) debe ocurrir fuertemente en el backend. El frontend valida para mejorar experiencia, pero nunca confiamos ciegamente en él.

## 33. SEGURIDAD

Considerar:

- Contraseñas hasheadas y Auth gestionado por Supabase
- JWT y autorización
- No subir claves a GitHub

Por ejemplo, las variables de entorno:

**.env** (No se sube, se ignora en .gitignore)

```
DATABASE_URL=...
JWT_SECRET=...
```

**.env.example** (Se sube al repositorio)

```
DATABASE_URL=
JWT_SECRET=
```

El archivo `.env.example` permite que cualquier integrante del equipo clone el proyecto y sepa qué variables debe configurar en su entorno local de manera segura.

## 34. GIT Y GITHUB (ESTRATEGIA GIT FLOW)

El repositorio será una parte importante del proyecto. Para mantener el repositorio organizado entre los cuatro integrantes, utilizaremos la estrategia de ramificación Git Flow y los estándares de contribución.

### Estrategia de Ramificación Git Flow

- **main:** Código en su versión estable y completa (V1.0).
- **release/x.0:** Preparación de una nueva versión. Se crea cuando develop tiene suficientes funcionalidades para una entrega, sirve para corregir errores menores durante la revisión, ajustar números de versión y actualizar documentación. **IMPORTANTE:** no agregar funcionalidades nuevas. Se crea desde develop, y una vez que se completa el trabajo (versión estable) se realiza el merge a develop y a main para actualizar el código en ambas ramas.
- **develop:** Rama de desarrollo.
- **feature/nombre-de-la-funcionalidad:** Para crear nuevas funcionalidades. Se crea desde develop para trabajar en una nueva función. Una vez completada, se hace el merge a develop y se elimina la rama.
- **hotfix:** Corrección urgente de un error que se encuentra en main. Se crea desde main para trabajar en la corrección del error lo antes posible. Una vez corregido, se hace el merge a main y a develop.

### Diagrama de ramificación

**Árbol de ramificación (Git Flow):**

```
main (producción, estable)
 │
 ├─ hotfix/bug-urgente ─→ testing/correcciones → merge a main (tag v1.0-fix)
 │                                             ↘ merge a develop
 │
 └─ ← recibe merges de release/ (tag v1.0)

develop (integración, rama madre)
 │
 ├─ feature/auth ───────────────→ PR → merge a develop
 ├─ feature/transactions ───────→ PR → merge a develop
 ├─ feature/categories ──────────→ PR → merge a develop
 └─ feature/dashboard ──────────→ PR → merge a develop
 │
 └─ release/1.0 ────────────────→ testing/ajustes → merge a main (tag)
                                                                         ↘ merge a develop
```

**Resumen comparativo:**

| Rama        | Origen  | Destino        | Propósito                | Frecuencia    |
| ----------- | ------- | -------------- | ------------------------ | ------------- |
| `feature/*` | develop | develop        | Nuevas funcionalidades   | Muy frecuente |
| `release/*` | develop | main + develop | Preparar versión estable | Ocasional     |
| `hotfix/*`  | main    | main + develop | Corregir bugs urgentes   | Raro          |
| `develop`   | —       | —              | Rama de integración      | —             |
| `main`      | —       | —              | Rama de producción       | —             |

## 35. PULL REQUESTS Y ESTÁNDARES DE CONTRIBUCIÓN

La idea es evitar que los integrantes trabajen directamente sobre main o develop.

### Flujo

```

feature/transactions
↓
Pull Request (PR)
↓
Revisión
↓
Merge

```

### Estándares de contribución

- **Commits:** Utilizar títulos descriptivos con el formato `tipo: descripción`.
  - Ejemplo: `feat: implementación de login` o `fix: corrección de ruta API`.
- **Revisiones de Pull Requests (PR):** Al menos un compañero de equipo debe revisar una solicitud de incorporación de cambios antes de fusionarla (merge) con develop.

## 36. ISSUES

Utilizar GitHub Issues para organizar tareas (ej. #21 Crear endpoint de transacciones) y asignar responsables.

## 37. CI — INTEGRACIÓN CONTINUA

Para el Taller III implementaremos GitHub Actions. Cada Pull Request ejecutará:

```

Verificar formato de Commit (feat:, fix:)
↓
Validar aprobación de PR (Reviewers)
↓
pnpm install
↓
lint
↓
typecheck
↓
tests

```

Si algo falla, el PR no se puede mergear. Esto nos permite asegurar automatización y calidad.

## 38. DOCUMENTACIÓN

Desde el principio mantener un README explicando cómo instalar, ejecutar y probar el proyecto.

## 39. DECISIONES TÉCNICAS

Mantener un archivo DECISIONES.md para documentar por qué elegimos una tecnología o descartamos un patrón. Vital para la defensa final.

## 40. QUÉ NO QUEREMOS HACER

NO vamos a implementar: conexiones con bancos reales, Mercado Pago, tarjetas reales, criptomonedas, inteligencia artificial, microservicios, etc. Aumentan la complejidad y nos sacan de foco.

## 41. STACK FINAL PROPUESTO

- **FRONTEND:** React, TypeScript, Tailwind CSS, Vite.
- **BACKEND:** Node.js, TypeScript, Express.
- **DATABASE:** Supabase + PostgreSQL (con migrations y seeders).
- **AUTH:** Supabase Auth (JWT).
- **TESTING:** Vitest + Testing Library.
- **CI/CD:** GitHub Actions.
- **DEPLOYMENT:** Vercel (Frontend) + Supabase (Backend/DB).
- **CONTROL VERSIONES:** Git + GitHub.
- **TRACKING:** Jira.

## 42. DIVISIÓN DEL TRABAJO ENTRE 4 PERSONAS

No significa que cada persona sea dueña de una parte y jamás toque las demás. Todos deben conocer el proyecto, pero se asignan roles principales:

### 👤 PERSONA 1 — BACKEND / AUTENTICACIÓN

Configuración inicial del backend, API, Auth, registro, JWT, usuarios, .env, documentación API inicial.

### 👤 PERSONA 2 — BACKEND / LÓGICA DE NEGOCIO

Transacciones, categorías, perfil de usuario, lógicas de balance, estadísticas. (Services, Repositories).

### 👤 PERSONA 3 — FRONTEND A

React, routing, componentes, Login, Register, Transacciones, Categorías.

### 👤 PERSONA 4 — FRONTEND B / CALIDAD & DEVOPS

Dashboard, página de análisis, UX/UI, GitHub Actions, CI, revisión de testing, documentación de integración.

## 43. PERO TODOS DEBEN TOCAR TODO

Cada integrante debe participar en code reviews, testing y decisiones de arquitectura. Todos deben entender todo el código para la defensa final.

## 44. ETAPAS DEL TRABAJO

- **ETAPA 1 — FUNDACIÓN:** GitHub, dependencias, variables, conexiones. Todos pueden clonar y ejecutar.
- **ETAPA 2 — MVP:** Crear y mostrar usuario, gastos, categorías y dashboard básico.
- **ETAPA 3 — MEJORAS:** Filtros, estadísticas, funcionalidades nivel 2 (si hay tiempo).
- **ETAPA 4 — CALIDAD:** Refactoring, tests, lint, TypeScript, CI, documentación.

## 45. CRONOGRAMA DE LA MATERIA

### Taller I — 11/09: Proyecto inicial, repositorio, README, dependencias y reproducibilidad

**Objetivos:**

- Constitución y viabilidad del proyecto
- Repositorio creado y configurado en GitHub
- README con instrucciones de setup
- Dependencias instaladas y funcionando
- Todos pueden clonar y ejecutar el proyecto localmente
- Configuración inicial de Jira

### Taller II — 16/10: Diseño, patrones justificados, SOLID, refactoring y mantenibilidad

**Objetivos:**

- MVP funcional (usuarios, transacciones, categorías, dashboard)
- Aplicación de principios SOLID
- Patrones de diseño justificados y documentados
- Refactoring demostrado en el código
- Separación de responsabilidades en backend
- Estructura de proyecto mantenible

### Taller III — 27/11: Documentación, testing, calidad, automatización, CI y entrega

**Objetivos:**

- Testing completo (unit, servicios, API) con Vitest
- Documentación exhaustiva (README, API docs, decisiones técnicas)
- GitHub Actions configurado y funcionando
- Lint y TypeScript sin errores
- Code coverage aceptable (≥70%)
- Código listo para producción

### Presentación final — 04/12: Presentación grupal y defensa individual

**Objetivos:**

- Demostración en vivo del proyecto
- Defensa individual sobre decisiones y arquitectura
- Explicación de evolución del código
- Responder preguntas sobre SOLID, Git Flow, testing

## 46. HERRAMIENTAS DE TRACKING Y COORDINACIÓN

### Jira

Usaremos Jira para organizar y rastrear el trabajo:

- **Issues/Tickets:** Cada funcionalidad, bug fix o tarea debe tener un ticket
- **Story Points:** Estimaremos complejidad relativa
- **Sprints:** Organizados según el cronograma (Sprint 1: hasta Taller I, Sprint 2: hasta Taller II, Sprint 3: hasta Taller III)
- **Estados:** Backlog → In Progress → In Review → Done
- **Assignees:** Cada ticket asignado al responsable principal
- **Boards:** Vista Kanban para seguimiento visual

### Daily Standups

- **Frecuencia:** 2-3 veces por semana (30 minutos)
- **Formato:** Qué hice → Qué voy a hacer → Qué problema tengo
- **Lugar:** Discord o presencial

## 47. TALLERES Y DEFENSA

El enfoque debe estar en demostrar un código defendible, evolucionable y justificado, en vez de solo mostrar funcionalidades corriendo sin bases teóricas.

## 48. ESTIMACIONES POR ETAPA

Basadas en 4 personas trabajando ~20-25 horas/semana durante 13 semanas:

### Semana 1-2 (hasta Taller I — 11 días)

**Estimación:** 80 puntos de historia

- Estructura base frontend + backend: 34 puntos
- Configuración Supabase y BD: 21 puntos
- Setup repositorio y dependencias: 13 puntos
- README y documentación inicial: 8 puntos
- Testing setup (Vitest): 4 puntos

### Semana 3-7 (Taller I a Taller II — 35 días)

**Estimación:** 200 puntos de historia

- Dashboard básico: 42 puntos
- CRUD transacciones: 38 puntos
- Refactoring y SOLID: 35 puntos
- Auth (registro, login, JWT): 34 puntos
- Tests unitarios: 30 puntos
- CRUD categorías: 21 puntos

### Semana 8-11 (Taller II a Taller III — 35 días)

**Estimación:** 180 puntos de historia

- Gráficos y estadísticas: 42 puntos
- Tests API y servicios: 34 puntos
- Página de análisis: 30 puntos
- Filtros y búsqueda: 25 puntos
- Documentación técnica: 25 puntos
- GitHub Actions setup: 13 puntos
- Code review y ajustes: 11 puntos

### Semana 12-13 (Taller III a Defensa — 14 días)

**Estimación:** 80 puntos de historia

- Preparación defensa: 25 puntos
- Testing final y coverage: 21 puntos
- Documentación de decisiones: 17 puntos
- Performance y optimizaciones: 17 puntos

**Total estimado:** ~540 puntos de historia para el proyecto completo.

### Timeline visual del proyecto

```
SEMANA 1-2 (6-20 SEP)
└─ Setup inicial (80 pts)
   ├─ Repositorio, dependencias, README
   ├─ Estructura base frontend + backend
   ├─ Supabase + BD
   └─ Testing setup

   TALLER I (11/09) ✓

SEMANA 3-7 (21 SEP - 24 OCT)
└─ MVP Funcional (200 pts)
   ├─ Auth: registro, login, JWT
   ├─ CRUD transacciones
   ├─ CRUD categorías
   ├─ Dashboard básico
   ├─ Unit tests
   └─ Refactoring SOLID

   TALLER II (16/10) ✓

SEMANA 8-11 (25 OCT - 27 NOV)
└─ Calidad y Funcionalidades (180 pts)
   ├─ Tests API y servicios
   ├─ Filtros y búsqueda
   ├─ Gráficos y estadísticas
   ├─ Documentación técnica
   └─ GitHub Actions setup

   TALLER III (27/11) ✓

SEMANA 12-13 (28 NOV - 04 DIC)
└─ Finalización (80 pts)
   ├─ Testing final (coverage ≥70%)
   ├─ DECISIONES.md
   ├─ Performance
   └─ Preparación defensa

   PRESENTACIÓN Y DEFENSA (04/12) ✓
```

## 49. POSIBLE EVOLUCIÓN DEL PROYECTO

Versión 1 (Básicos) → Versión 2 (Estadísticas) → Versión 3 (Opcionales niveles 3 y 4) → Versión 4 (Calidad de Código y Tests).

## 50. RIESGOS DEL PROYECTO

- Querer hacer demasiado.
- Programar en silos.
- Dejar los tests para el final.
- Sobrediseñar (patrones innecesarios).
- Conocimiento concentrado en una sola persona.

## 51. REUNIONES DEL GRUPO

Reuniones cortas (Dailys o Weeklys):

- ¿Qué hice?
- ¿Qué voy a hacer?
- ¿Qué problema tengo?

## 52. DEFINITION OF DONE

Una tarea se considera terminada si:

- ☑ Código implementado y funcional.
- ☑ Sin errores de tipado (TypeScript).
- ☑ Tests agregados.
- ☑ PR creado, revisado (Code Review) y mergeado.
- ☑ Documentación actualizada.

## 53. MVP DEFINITIVO

Si tuviéramos que reducir TODO el proyecto a una lista, estas son las obligatorias:

### AUTENTICACIÓN

- ☑ Registro
- ☑ Login
- ☑ Logout
- ☑ Usuario autenticado

### MOVIMIENTOS

- ☑ Crear
- ☑ Editar
- ☑ Eliminar
- ☑ Consultar
- ☑ Filtrar

### CATEGORÍAS

- ☑ Crear
- ☑ Editar
- ☑ Eliminar
- ☑ Consultar

### DASHBOARD

- ☑ Saldo
- ☑ Ingresos
- ☑ Gastos
- ☑ Resumen mensual

Es preferible tener un MVP con arquitectura limpia, CI y tests, que 25 funcionalidades imposibles de testear y mantener.

## 54. PROPUESTA FINAL DE STACK (RESUMEN)

- **Frontend:** React + TypeScript.
- **Backend:** Node.js + TypeScript + Express.
- **DB/Auth:** Supabase + PostgreSQL (con migrations y seeders).
- **Testing/CI:** Vitest + Testing Library + GitHub Actions.
- **Deployment:** Vercel (Frontend) + Supabase (Backend/DB).

### Deployment

**Frontend (Vercel):**

- Push a `main` o `develop` → Vercel auto-deploya
- Preview deploy para cada PR
- Logs y monitoring integrados
- Dominio: finzo.vercel.app (o similar)

**Backend + Database (Supabase):**

- Supabase hosting integrado
- Auto-deployments via CLI o GitHub Actions
- Backups automáticos
- Migrations ejecutadas en CI antes de deploy

## 55. CONCLUSIÓN

El objetivo será utilizar un problema sencillo para demostrar que podemos:

- Diseñar software
- Trabajar colaborativamente usando Git Flow
- Organizar un repositorio
- Separar responsabilidades
- Justificar decisiones
- Aplicar SOLID
- Refactorizar
- Automatizar verificaciones

**Queremos demostrar:** "Podemos tomar un problema, diseñar una solución, construirla, probarla, trabajar en equipo y explicar por qué tomamos cada decisión".

---

**Documento actualizado:** 05/09/2026  
**Versión:** 2.0 — Con estimaciones, herramientas y deployment definidos
