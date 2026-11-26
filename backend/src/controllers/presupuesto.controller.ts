import type { NextFunction, Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { ErrorNoAutorizado } from '../errors/errores.js';
import type { IPresupuestoService } from '../services/presupuesto.service.js';
import type { ActualizarPresupuestoDTO, CrearPresupuestoDTO } from '../types/presupuesto.types.js';

function obtenerPerfilId(req: AuthenticatedRequest): string {
  if (!req.user?.id) throw new ErrorNoAutorizado();
  return req.user.id;
}

export class PresupuestoController {
  constructor(private readonly presupuestoService: IPresupuestoService) {}

  listar = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { mes, anio } = req.query as { mes?: number; anio?: number };
      const resumen = await this.presupuestoService.listarPorPeriodo(obtenerPerfilId(req), mes, anio);
      res.status(200).json({ exito: true, datos: resumen });
    } catch (error) {
      next(error);
    }
  };

  crear = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const presupuesto = await this.presupuestoService.crear(obtenerPerfilId(req), req.body as CrearPresupuestoDTO);
      res.status(201).json({ exito: true, datos: presupuesto });
    } catch (error) {
      next(error);
    }
  };

  actualizar = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const presupuesto = await this.presupuestoService.actualizar(
        req.params.id,
        obtenerPerfilId(req),
        req.body as ActualizarPresupuestoDTO
      );
      res.status(200).json({ exito: true, datos: presupuesto });
    } catch (error) {
      next(error);
    }
  };

  eliminar = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.presupuestoService.eliminar(req.params.id, obtenerPerfilId(req));
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };
}
