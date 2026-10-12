import type { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { PerfilRepository } from '../repositories/perfil.repository.js';
import { PerfilAuthService } from '../services/perfil-auth.service.js';
import { PerfilService } from '../services/perfil.service.js';
import { ErrorNoAutorizado } from '../utils/errores.js';

const perfilService = new PerfilService(new PerfilRepository(), new PerfilAuthService());

function obtenerIdentidad(req: AuthenticatedRequest): { id: string; email: string } {
  if (!req.user) {
    throw new ErrorNoAutorizado();
  }
  return req.user;
}

export async function obtenerPerfil(req: AuthenticatedRequest, res: Response): Promise<void> {
  const usuario = obtenerIdentidad(req);
  res.status(200).json({ exito: true, datos: await perfilService.obtenerPerfil(usuario.id, usuario.email) });
}

export async function actualizarPerfil(req: AuthenticatedRequest, res: Response): Promise<void> {
  const usuario = obtenerIdentidad(req);
  res.status(200).json({
    exito: true,
    datos: await perfilService.actualizarPerfil(usuario.id, usuario.email, req.body),
  });
}
