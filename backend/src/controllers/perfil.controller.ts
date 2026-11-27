import type { NextFunction, Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import type { ActualizarPerfilDTO } from '../types/perfil.types.js';
import { ErrorNoAutorizado } from '../errors/errores.js';
import type { IPerfilService } from '../services/perfil.service.js';

function obtenerIdentidad(req: AuthenticatedRequest): { id: string; email: string } {
  if (!req.user) {
    throw new ErrorNoAutorizado();
  }
  return req.user;
}

export class PerfilController {
  constructor(private readonly perfilService: IPerfilService) {}

  obtenerPerfil = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const usuario = obtenerIdentidad(req);
      res.status(200).json({
        exito: true,
        datos: await this.perfilService.obtenerPerfil(usuario.id, usuario.email),
      });
    } catch (error) {
      next(error);
    }
  };

  actualizarPerfil = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const usuario = obtenerIdentidad(req);
      const datos: ActualizarPerfilDTO = req.body;
      res.status(200).json({
        exito: true,
        datos: await this.perfilService.actualizarPerfil(usuario.id, usuario.email, datos),
      });
    } catch (error) {
      next(error);
    }
  };
}
