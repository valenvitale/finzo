``` typescript
import { Router } from 'express';
//antes la ruta utilizaba una funcion que tenia su propio ResumenService creado dentro del archivo del controlador.
import { obtenerResumen } from '../controllers/resumen.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const resumenRouter = Router();

// todas las rutas de este router requieren autenticación.
resumenRouter.use(authMiddleware);

// GET /api/resumen
resumenRouter.get('/', obtenerResumen);

export default resumenRouter;
```

## Problema detectado

Originalmente, la ruta importaba directamente una función del controlador:

```typescript
import { obtenerResumen } from '../controllers/resumen.controller.js';
```

El servicio era creado dentro del archivo del controlador, por lo que la ruta no intervenía en la configuración de sus dependencias.

Además, los parámetros de consulta eran validados manualmente dentro del controlador.

## Solución implementada

Se modificó la configuración de rutas para crear las dependencias y conectarlas explícitamente:

```typescript
const resumenService = new ResumenService();
const resumenController = new ResumenController(resumenService);
```

También se incorporó el middleware de validación:

```typescript
resumenRouter.get(
  '/',
  validarQuery(resumenQuerySchema),
  resumenController.obtenerResumen
);
```

La autenticación continúa siendo obligatoria mediante `authMiddleware`.

## Patrón de diseño aplicado

## Organización de middlewares de Express

La ruta `/api/resumen` utiliza middlewares para separar responsabilidades:

- authMiddleware: verifica la autenticación.
- validarQuery: valida los parámetros mediante Zod.
- ResumenController: procesa la petición y consulta el servicio.
- errorHandler: gestiona los errores.

## Inyección de dependencias

La configuración de rutas funciona como punto de composición de las dependencias.

La instancia de `ResumenService` se crea fuera del controlador y se entrega mediante su constructor.

Esto reduce el acoplamiento y permite reemplazar dependencias en las pruebas.

## Validación con Zod

Se creó `resumen.schema.ts` para definir las reglas de validación:

- El mes es opcional y debe estar entre 1 y 12.
- El año es opcional y debe contener cuatro dígitos.
- Los valores válidos se convierten de texto a números.
- Se rechazan parámetros adicionales.

Esta última regla hace más estricta la validación respecto de la implementación original.

## Pruebas realizadas

Se incorporaron diez pruebas nuevas:

- Una prueba unitaria del controlador.
- Cinco pruebas unitarias del esquema Zod.
- Cuatro pruebas de integración del endpoint.

La suite completa del backend finalizó con **99 pruebas aprobadas en 18 archivos**, sin fallos.

## Resultado

La refactorización mejoró la organización del endpoint `/api/resumen`, permitió probar sus componentes de forma aislada y mantuvo el cálculo financiero esperado.