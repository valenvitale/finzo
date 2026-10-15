# Refactorización del Módulo de Resumen (`/api/resumen`)

## 2. Las 2 Mejoras y qué Patrones aplican

### Mejora 1: Convertir `ResumenController` en Clase con Inyección de Dependencias

* **El cambio:** Pasar de una función suelta con `const service = new ResumenService()` fijo en el archivo, a una clase que recibe el servicio por el constructor: `constructor(private service: ResumenService)`.
* **Patrones aplicados:**
  * **Inyección de Dependencias:** El controlador no crea sus herramientas, las recibe desde afuera.
  * **Composition Root:** En `resumen.routes.ts` creamos el servicio y se lo inyectamos al controlador.
* **Principios SOLID:**
  * **D - Inversión de Dependencias (DIP):** El controlador depende de una abstracción inyectable y no de una instancia rígida fija en el archivo.
  * **S - Responsabilidad Única (SRP):** El controlador no tiene la responsabilidad de crear servicios, solo de coordinar la petición y respuesta HTTP.
* **Beneficio real:** **Testeabilidad.** Nos permite escribir tests unitarios del controlador usando un servicio simulado (*mock*), sin levantar base de datos real.

---

### Mejora 2: Mover la validación de `mes` y `anio` a Middleware Zod

* **El cambio:** Quitar los `if` y expresiones regulares (`/^\d+$/`) de adentro del controlador y validar con un esquema Zod en la ruta (`validarQuery(resumenQuerySchema)`).
* **Patrones aplicados:**
  * **Cadena de Responsabilidad (Chain of Responsibility):** Express procesa en fila (`auth` → `validarQuery` → `controller`).
  * **Estrategia (Strategy):** El esquema Zod es una estrategia intercambiable que el middleware genérico ejecuta sin conocer sus campos.
  * **Fail-Fast:** Si mandan datos inválidos, la petición se rechaza en la puerta antes de llegar al controlador o a la base de datos.
* **Principios SOLID:**
  * **S - Responsabilidad Única (SRP):** El validador valida los datos; el controlador solo coordina el caso de uso. Si las reglas de formato cambian, no se toca el controlador.
  * **O - Abierto / Cerrado (OCP):** Se pueden agregar nuevos esquemas y validaciones sin modificar el código del middleware genérico.

---

## 3. Código a modificar

### A. Crear `backend/src/validation/resumen.schema.ts`
```typescript
import { z } from 'zod';

export const resumenQuerySchema = z
  .object({
    mes: z
      .string()
      .regex(/^\d+$/, 'El mes debe ser un número entero')
      .transform(Number)
      .refine((val) => val >= 1 && val <= 12, {
        message: 'El mes debe estar entre 1 y 12',
      })
      .optional(),
    anio: z
      .string()
      .regex(/^\d{4}$/, 'El año debe ser de 4 dígitos')
      .transform(Number)
      .refine((val) => val >= 2000, {
        message: 'El año no es válido',
      })
      .optional(),
  })
  .strict();
```

### B. Modificar `backend/src/controllers/resumen.controller.ts`
```typescript
import type { NextFunction, Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { ErrorNoAutorizado } from '../errors/errores.js';
import { ResumenService } from '../services/resumen.service.js';

export class ResumenController {
  constructor(private readonly resumenService: ResumenService = new ResumenService()) {}

  obtenerResumen = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user?.id) {
        throw new ErrorNoAutorizado();
      }

      // Los query params ya fueron validados y convertidos a número por Zod
      const { mes, anio } = (req.query as unknown as { mes?: number; anio?: number }) || {};

      const resumen = await this.resumenService.obtenerResumen(req.user.id, mes, anio);

      res.status(200).json({
        exito: true,
        datos: resumen,
      });
    } catch (error) {
      next(error);
    }
  };
}
```

### C. Modificar `backend/src/routes/resumen.routes.ts`
```typescript
import { Router } from 'express';
import { ResumenController } from '../controllers/resumen.controller.js';
import { ResumenService } from '../services/resumen.service.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validarQuery } from '../middlewares/validacion.middleware.js';
import { resumenQuerySchema } from '../validation/resumen.schema.js';

const resumenService = new ResumenService();
const resumenController = new ResumenController(resumenService);

const resumenRouter = Router();

resumenRouter.use(authMiddleware);
resumenRouter.get('/', validarQuery(resumenQuerySchema), resumenController.obtenerResumen);

export default resumenRouter;
```

---

## 4. ¿Cómo explicarlo a los profes en el Taller II?

Solo 3 ideas simples:

1. *"Primero integramos el módulo funcional de Valentina con sus tests de cálculo y autenticación."*
2. *"Aplicamos **Inyección de Dependencias** convirtiendo el controlador en clase para poder testearlo sin base de datos."*
3. *"Usamos la **Cadena de Responsabilidad** con un esquema **Zod** para cortar peticiones inválidas antes de que toquen el controlador (*Fail-Fast*)."*
