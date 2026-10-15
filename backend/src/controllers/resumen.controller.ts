import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { ErrorNoAutorizado } from '../errors/errores.js';
import type { IResumenService } from '../services/resumen.service.js';

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