# 🛠️ Hoja de Ruta: Oportunidades de Mejora y Refactorings Pendientes — Finzo

> **Contexto:** Evaluación de Taller II aprobada con éxito.  
> **Objetivo de este documento:** Detallar **únicamente** lo que se puede y debe mejorar en el código, la arquitectura y los tests de cara al Sprint 3 (Taller III), explicado de forma clara, directa y sin rodeos técnicos innecesarios.

---

## 🚦 Semáforo de Prioridades

- 🔴 **Prioridad Alta:** Impacta directamente en la mantenibilidad inmediata, evita errores al conectar frontend con backend o resuelve deuda técnica que rompe la consistencia del diseño.
- 🟡 **Prioridad Media:** Mejora la calidad del código, evita duplicaciones y prepara el sistema para crecer sin dolores de cabeza.
- 🟢 **Prioridad Baja / Deseable:** Buenas prácticas que dejan el proyecto impecable, pero no bloquean el funcionamiento.

---

## 1. ⚙️ Backend: Arquitectura, SOLID y Código

---

### 🔴 1. Estandarizar Perfil y Monedas con Inyección de Dependencias (DIP)

* **¿Qué pasa hoy?**  
  En [`perfil.controller.ts`](../backend/src/controllers/perfil.controller.ts) y [`moneda.controller.ts`](../backend/src/controllers/moneda.controller.ts) se usan funciones sueltas y se instancia el servicio directamente arriba del archivo:
  ```typescript
  // ❌ Acoplamiento rígido actual:
  const perfilService = new PerfilService(new PerfilRepository(), new PerfilAuthService());
  ```
  Esto es exactamente lo mismo que teníamos en Resumen antes del refactor.
* **¿Por qué es un problema?**  
  Rompe el principio **DIP**. Si queremos hacer pruebas unitarias del controlador sin que toque la base de datos real, no podemos "pasarle" un servicio falso o simulado (mock). Además, hace que la mitad del backend use clases con inyección (`CategoriaController`, `MovimientoController`, `ResumenController`) y la otra mitad use funciones estáticas.
* **¿Cómo lo solucionamos?**  
  1. Convertir `PerfilController` y `MonedaController` en clases.
  2. Recibir sus servicios mediante el constructor:
     ```typescript
     export class PerfilController {
       constructor(private readonly perfilService: IPerfilService) {}
     }
     ```
  3. En las rutas (`perfil.routes.ts` y `moneda.routes.ts`), armar la inyección:
     ```typescript
     const repository = new PerfilRepository();
     const authService = new PerfilAuthService();
     const service = new PerfilService(repository, authService);
     const controller = new PerfilController(service);
     ```
* **Principio SOLID involucrado:** **DIP** (Inversión de Dependencias) y **SRP** (Responsabilidad Única).

---

### 🔴 2. Manejo uniforme de errores en los Controladores (`try/catch` con `next`)

* **¿Qué pasa hoy?**  
  En `movimiento.controller.ts` y `resumen.controller.ts` todos los métodos tienen:
  ```typescript
  try {
    // ... lógica
  } catch (error) {
    next(error);
  }
  ```
  Pero en `perfil.controller.ts` y `moneda.controller.ts` no hay ningún `try/catch`.
* **¿Por qué es un problema?**  
  Aunque Express 5 captura promesas rechazadas automáticamente, tener estilos distintos confunde al equipo y puede ocasionar respuestas no controladas si alguna excepción sincrónica no llega al `errorHandler` global.
* **¿Cómo lo solucionamos?**  
  Estandarizar todos los controladores con la misma estructura `try/catch` delegando en `next(error)`.

---

### 🟡 3. Desacoplar Controladores mediante Interfaces de Servicio (`IMovimientoService`, `IMedioPagoService`)

* **¿Qué pasa hoy?**  
  `ResumenController` recibe la interfaz `IResumenService` (excelente). Pero `MovimientoController` recibe directamente la clase concreta `MovimientoService`.
* **¿Por qué es un problema?**  
  El principio **DIP** dice: *"dependé de abstracciones (interfaces), no de clases concretas"*. Al depender de la clase concreta, el controlador sigue conociendo detalles de la implementación.
* **¿Cómo lo solucionamos?**  
  Definir en `types/movimiento.types.ts`:
  ```typescript
  export interface IMovimientoService {
    crear(perfilId: string, datos: CrearMovimientoDTO): Promise<MovimientoResponseDTO>;
    obtenerPorId(id: string, perfilId: string): Promise<MovimientoResponseDTO>;
    actualizar(id: string, perfilId: string, datos: ActualizarMovimientoDTO): Promise<MovimientoResponseDTO>;
    eliminar(id: string, perfilId: string): Promise<void>;
    listarPorPerfil(perfilId: string, filtros?: FiltrosMovimientoDTO): Promise<MovimientoResponseDTO[]>;
  }
  ```
  Y hacer que el constructor de `MovimientoController` pida esa interfaz:
  ```typescript
  constructor(private readonly movimientoService: IMovimientoService) {}
  ```
* **Principio SOLID involucrado:** **DIP** (Inversión de Dependencias).

---

### 🟡 4. Eliminar validaciones manuales duplicadas en el Servicio (DRY + SRP)

* **¿Qué pasa hoy?**  
  En [`movimiento.service.ts`](../backend/src/services/movimiento.service.ts) existe el método:
  ```typescript
  private validarDatosBasicos(datosMovimiento) {
    if (datosMovimiento.monto <= 0) throw new ErrorDeValidacion(...);
    if (!(datosMovimiento.fecha instanceof Date)) throw new ErrorDeValidacion(...);
  }
  ```
  ¡Pero esto ya lo valida Zod en [`movimiento.schema.ts`](../backend/src/validation/movimiento.schema.ts) antes de que la petición llegue siquiera al controlador!
* **¿Por qué es un problema?**  
  Violamos el principio **DRY** (Don't Repeat Yourself) y **SRP**. Si el día de mañana queremos cambiar un mensaje o regla sobre el monto, tenemos que cambiarlo en dos lugares distintos.
* **¿Cómo lo solucionamos?**  
  - Dejar las validaciones de formato, tipo y valores positivos en **Zod**.
  - Dejar en el **Servicio** únicamente las validaciones de negocio que requieren hablar con la base de datos (por ejemplo: comprobar si la categoría pertenece al usuario o si el medio de pago existe).

### 🟢 5. Evitar "Type Assertions" (`as`) en Controladores

* **¿Qué pasa hoy?**  
  En varios controladores encontramos:
  ```typescript
  const datosMovimiento = req.body as CrearMovimientoDTO;
  const movimientoId = req.params.id as string;
  ```
* **¿Por qué es un problema?**  
  El operador `as` de TypeScript le dice al compilador: *"confiá en mí, sé lo que hago"*, apagando la verificación de tipos. Si el esquema de Zod cambia y el DTO no, TypeScript no nos avisa del error en tiempo de compilación.
* **¿Cómo lo solucionamos?**  
  Inyectar tipos fuertemente tipados a través de `Request` genéricos de Express o utilizar `z.infer<typeof schema>` directamente.

---

## 2. 🖥️ Frontend: Conexión, Experiencia de Usuario y Pruebas

---

### 🔴 6. Reemplazar el `DashboardTemporal` y Activar las Páginas Reales

* **¿Qué pasa hoy?**  
  En [`AppRouter.tsx`](../frontend/src/routes/AppRouter.tsx) está activa una función `DashboardTemporal` que solo tiene un cartel que dice *"FINZO - Sesión iniciada"* y un botón rojo de logout. La página real [`Dashboard.tsx`](../frontend/src/pages/Dashboard.tsx) está comentada.
* **¿Cómo lo solucionamos?**  
  Conectar `Dashboard.tsx` dentro del layout general (`PageContainer` con `Sidebar` y `Header`), montando las rutas privadas para:
  - `/dashboard`
  - `/movimientos`
  - `/categorias`
  - `/perfil`

---

### 🔴 7. Crear Custom Hooks para Aislar la Lógica de las Vistas (SRP en React)

* **¿Qué pasa hoy?**  
  Actualmente solo existe `useAuth.ts`. Si escribimos las llamadas `apiClient.get('/movimientos')` directamente adentro de los componentes visuales (`Movimientos.tsx`), los componentes mezclarán maquetado con llamadas HTTP y manejo de errores.
* **¿Cómo lo solucionamos?**  
  Crear hooks especializados con una única responsabilidad:
  - `useMovimientos`: se encarga de llamar al servicio, guardar la lista de movimientos, aplicar filtros y manejar estados de `cargando` y `error`.
  - `useCategorias`: maneja la lista de categorías y el límite de 8 personalizadas.
  - `useResumen`: consulta `/api/resumen` y devuelve totales calculados.
  Las páginas solo llaman al hook y pintan la pantalla:
  ```tsx
  // Limpio, legible y fácil de probar:
  const { movimientos, cargando, error, agregarMovimiento } = useMovimientos();
  ```

---

### 🟡 8. Integrar Toasts y Manejo Visual de Sesión Expirada

* **¿Qué pasa hoy?**  
  En [`frontend/src/services/api.ts`](../frontend/src/services/api.ts), cuando el backend devuelve `401 Unauthorized`, el interceptor de Axios hace `supabase.auth.signOut({ scope: 'local' })`. Pero el usuario no recibe ningún mensaje explicativo; simplemente es redirigido de golpe al login.
* **¿Cómo lo solucionamos?**  
  Ya tenemos instalada y configurada la librería `sonner` en `frontend/src/components/common/index.ts`. En el interceptor o en el `AuthContext`, disparar un mensaje amigable:
  ```typescript
  toast.error('Tu sesión ha expirado. Por favor, ingresa nuevamente.');
  ```

---

### 🟡 9. Corregir el Warning de `act(...)` y Aumentar la Cobertura en Frontend

* **¿Qué pasa hoy?**  
  Al correr los tests con `pnpm --filter frontend test`, solo corre 1 prueba (`App.test.tsx`), y arroja una advertencia en consola:
  ```text
  stderr | src/App.test.tsx > Frontend App > debe renderizar el título de Finzo
  An update to AuthProvider inside a test was not wrapped in act(...).
  ```
* **¿Por qué es un problema?**  
  Ocurre porque el `useEffect` de `AuthProvider` resuelve una promesa asíncrona de Supabase que actualiza el estado después de que el test ya hizo su verificación.
* **¿Cómo lo solucionamos?**  
  1. Envolver la renderización o esperar el estado con `await waitFor(...)` de React Testing Library.
  2. Mockear `supabase.auth.onAuthStateChange` para controlar el estado inicial sin efectos secundarios.
  3. Crear tests unitarios para los componentes comunes (`Boton.test.tsx`, `Modal.test.tsx`, `InputTexto.test.tsx`).

---

## 3. 📋 Resumen Visual de Tareas Pendientes para Sprint 3

| # | Área | Tarea Concreta | Beneficio Principal | Dificultad |
| :-: | :--- | :--- | :--- | :-: |
| **1** | Backend | Migrar `PerfilController` y `MonedaController` a clases con inyección por constructor | Cumple DIP, 100% testeable con mocks y unifica el estilo de todo el backend | Media |
| **2** | Backend | Unificar bloques `try/catch` con `next(error)` en todos los controladores | Manejo consistente y predecible de errores | Baja |
| **3** | Backend | Crear interfaces `IMovimientoService` e `IMedioPagoService` | Cumple DIP desacoplando controladores de implementaciones concretas | Baja |
| **4** | Backend | Quitar `validarDatosBasicos` manuales en `MovimientoService` | Elimina código duplicado delegando el formato a Zod (DRY/SRP) | Baja |
| **5** | Backend | Eliminar aserciones de tipo (`as`) en controladores tipando `Request` | Mayor seguridad de tipos en tiempo de compilación | Baja |
| **6** | Frontend | Reemplazar `DashboardTemporal` y activar las rutas reales | Conecta la experiencia de usuario real de Finzo | Media |
| **7** | Frontend | Implementar hooks `useMovimientos`, `useCategorias` y `useResumen` | Separa la lógica asíncrona de los componentes visuales | Media |
| **8** | Frontend | Agregar notificación de "Sesión expirada" en el interceptor 401 | Mejora la experiencia y claridad del usuario | Baja |
| **9** | Frontend | Corregir warning `act(...)` y sumar tests de componentes UI | Pruebas limpias y confiables en el pipeline de CI/CD | Media |

---

## 4. 💡 Conclusión para el Equipo

El backend de Finzo ya cuenta con una base sólida (103 tests funcionando, seguridad JWT, migraciones en Supabase y capas bien diferenciadas). 

Aplicando estas mejoras:
1. El backend quedará **100% simétrico y uniforme** (todos los controladores e interfaces estructurados bajo las mismas reglas).
2. Se evitará duplicar validaciones.
3. El frontend se conectará de manera limpia y modular mediante **Custom Hooks**, evitando componentes sobrecargados.

