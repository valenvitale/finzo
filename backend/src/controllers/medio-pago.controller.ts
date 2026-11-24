import type { NextFunction, Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { ErrorNoAutorizado } from '../errors/errores.js';
import type { IMedioPagoService, CrearMedioPagoDTO, ActualizarMedioPagoDTO } from '../types/medio-pago.types.js';

export class MedioPagoController {
  constructor(private readonly medioPagoService: IMedioPagoService) {}

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

  crear = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> =>{
    try{
      const datos: CrearMedioPagoDTO = req.body;
      if (!req.user?.id) {
        throw new ErrorNoAutorizado();
      }

      const medio = await this.medioPagoService.crear(req.user.id, datos);
      res.status(201).json({ exito: true, datos: medio });
    }catch(error){
      next(error);
    }
  };

  actualizar = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> =>{
    try{
      if (!req.user?.id) {
        throw new ErrorNoAutorizado();
      }
      const id = req.params.id;
      const datos: ActualizarMedioPagoDTO = req.body;
      const medio = await this.medioPagoService.actualizar(id, req.user.id, datos);
      res.status(200).json({ exito: true, datos: medio });
    }catch(error){
      next(error);
    }
  };

  eliminar = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> =>{
    try{
      if (!req.user?.id) {
        throw new ErrorNoAutorizado();
      }
      const id = req.params.id;
      await this.medioPagoService.eliminar(id, req.user.id);
      res.status(204).send();
    }catch(error){
      next(error);
    }
  };
}