import type { NextFunction, Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import type { AsignarMonedaDTO } from '../types/moneda.types.js';
import { ErrorNoAutorizado } from '../errors/errores.js';
import type { IMonedaService } from '../services/moneda.service.js';

function obtenerPerfilId(req: AuthenticatedRequest): string {
  if (!req.user) {
    throw new ErrorNoAutorizado();
  }
  return req.user.id;
}

export class MonedaController {
  constructor(private readonly monedaService: IMonedaService) {}

  listarMonedas = async (_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({ exito: true, datos: await this.monedaService.listarDisponibles() });
    } catch (error) {
      next(error);
    }
  };

  listarMonedasPerfil = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({
        exito: true,
        datos: await this.monedaService.listarPorPerfil(obtenerPerfilId(req)),
      });
    } catch (error) {
      next(error);
    }
  };

  asignarMoneda = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const datos: AsignarMonedaDTO = req.body;
      res.status(201).json({
        exito: true,
        datos: await this.monedaService.asignar(obtenerPerfilId(req), datos),
      });
    } catch (error) {
      next(error);
    }
  };

  eliminarMonedaPerfil = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { monedaId } = req.params;
      if (typeof monedaId !== 'string') {
        throw new ErrorNoAutorizado('El identificador de moneda no es válido');
      }
      await this.monedaService.eliminar(obtenerPerfilId(req), monedaId);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };
}
