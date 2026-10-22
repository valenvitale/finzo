import type { NextFunction, Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { ErrorNoAutorizado } from '../errors/errores.js';
import { type MedioPagoService } from '../services/medio-pago.service.js';

export class MedioPagoController {
  constructor(private readonly medioPagoService: MedioPagoService) {}

  listar = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.id) {
        throw new ErrorNoAutorizado();
      }

      const medios = await this.medioPagoService.listarPorPerfil(req.user.id);
      res.status(200).json({ exito: true, datos: medios });
    } catch (error) {
      next(error);
    }
  };
}
