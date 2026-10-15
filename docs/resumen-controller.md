``` typescript
// Esto hacia que el controlador creara su propia dependencia.
const resumenService = new ResumenService();

export async function obtenerResumen(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  // comprobamos que exista un usuario autenticado.
  if (!req.user) {
    throw new ErrorNoAutorizado();
  }

  // obtenemos los parámetros opcionales de la URL.
  const mesParametro = req.query.mes;
  const anioParametro = req.query.anio;

  // validamos que sean números enteros dentro de rangos permitidos.
  if (
    (mesParametro !== undefined &&
      (typeof mesParametro !== 'string' ||
        !/^\d+$/.test(mesParametro) ||
        Number(mesParametro) < 1 ||
        Number(mesParametro) > 12)) ||
    (anioParametro !== undefined &&
      (typeof anioParametro !== 'string' ||
        !/^\d{4}$/.test(anioParametro) ||
        Number(anioParametro) < 1))
  ) {
    res.status(400).json({
      exito: false,
      mensaje: 'El mes o año ingresado no es válido',
      errores: [],
    });
    return;
  }

  const mes = mesParametro === undefined ? undefined : Number(mesParametro);
  const anio = anioParametro === undefined ? undefined : Number(anioParametro);

  // el servicio se encarga de consultar y calcular los importes.
  const resumen = await resumenService.obtenerResumen(req.user.id, mes, anio);

  res.status(200).json({
    exito: true,
    datos: resumen,
  });
}
```

## Problemas detectados

En la implementación original, el controlador presentaba dos problemas principales:

**1. Acoplamiento con una implementación concreta**

El controlador creaba directamente una instancia de `ResumenService`:

```typescript
const resumenService = new ResumenService();
```

Esto dificultaba reemplazar el servicio por una implementación simulada durante las pruebas y hacía que el controlador conociera una dependencia concreta.

**2. Múltiples responsabilidades**

El controlador se encargaba de:
- Verificar la existencia de un usuario autenticado.
- Validar los parámetros `mes` y `anio`.
- Convertir los parámetros de texto a números.
- Invocar al servicio.
- Construir la respuesta HTTP.

La validación estaba mezclada con la responsabilidad principal del controlador.

## Solución implementada

Se transformó el controlador en una clase `ResumenController`, que recibe un servicio mediante su constructor.

```typescript
export class ResumenController {
  constructor(
    private readonly resumenService: IResumenService
  ) {}
}
```

También se trasladó la validación de los parámetros a un esquema Zod y al middleware `validarQuery`.

De esta manera, el controlador recibe los datos previamente validados y transformados, y se concentra en coordinar la petición con el servicio.

## Principios SOLID aplicados

### DIP — Principio de inversión de dependencias

El controlador depende de la abstracción `IResumenService`, en lugar de depender directamente de `ResumenService`.

Esto permite sustituir el servicio real por uno simulado sin modificar el controlador.

### SRP — Principio de responsabilidad única

La validación de datos se separó del controlador y se delegó al middleware correspondiente.

El controlador mantiene su responsabilidad de gestionar la petición HTTP y delegar la lógica financiera al servicio.

## Beneficios obtenidos

- Menor acoplamiento entre controlador y servicio.
- Mayor facilidad para realizar pruebas unitarias.
- Separación clara de responsabilidades.
- Reutilización del middleware de validación.
- Mayor facilidad de mantenimiento y modificación del código.