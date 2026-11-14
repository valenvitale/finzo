import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { ErrorNoAutorizado } from '../errors/errores.js';
import type { EstadisticasService } from '../services/estadisticas.service.js';
import type { FiltrosEstadisticasDTO } from '../types/estadisticas.types.js';

export class EstadisticasController {
  constructor(
    private readonly estadisticasService: EstadisticasService
  ) {}

  // Obtiene las estadísticas financieras del usuario autenticado.
  obtenerEstadisticas = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user?.id) {
        throw new ErrorNoAutorizado();
      }

      // Zod ya validó y transformó las fechas.
      const filtros = req.query as FiltrosEstadisticasDTO;

      const estadisticas =
        await this.estadisticasService.obtenerEstadisticas(
          req.user.id,
          filtros
        );

      res.status(200).json({
        exito: true,
        datos: estadisticas,
      });
    } catch (error) {
      next(error);
    }
  };
}