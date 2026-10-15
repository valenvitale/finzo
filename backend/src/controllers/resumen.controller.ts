import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { ErrorNoAutorizado } from '../errors/errores.js';
import { IResumenService } from '../services/resumen.service.js';

export class ResumenController {
  // ahora el controlador recibe el servicio desde afuera.
  // esto aplica inyeccion de depndencias y permite justificar DIP.
  // Ademas quitamos las validaciones manuales de mes y anio y se las delegamos a Zod.
  constructor(
    private readonly resumenService: IResumenService
  ) {}

  obtenerResumen = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user?.id) {
        throw new ErrorNoAutorizado();
      }

      // Zod ya validó y transformó los parámetros.
      const { mes, anio } = req.query as unknown as {
        mes?: number;
        anio?: number;
      };

      const resumen = await this.resumenService.obtenerResumen(
        req.user.id,
        mes,
        anio
      );

      res.status(200).json({
        exito: true,
        datos: resumen,
      });
    } catch (error) {
      next(error);
    }
  };
}

/*
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
*/