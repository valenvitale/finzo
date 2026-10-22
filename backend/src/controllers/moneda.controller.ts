import type { Response } from 'express';
import { type AuthenticatedRequest, type RequestBody } from '../middlewares/auth.middleware.js';
import type { AsignarMonedaDTO } from '../types/moneda.types.js';
import { MonedaRepository } from '../repositories/moneda.repository.js';
import { MonedaService } from '../services/moneda.service.js';
import { ErrorNoAutorizado } from '../errors/errores.js';

const monedaService = new MonedaService(new MonedaRepository());

function obtenerPerfilId(req: AuthenticatedRequest): string {
  if (!req.user) {
    throw new ErrorNoAutorizado();
  }
  return req.user.id;
}

export async function listarMonedas(_req: AuthenticatedRequest, res: Response): Promise<void> {
  res.status(200).json({ exito: true, datos: await monedaService.listarDisponibles() });
}

export async function listarMonedasPerfil(req: AuthenticatedRequest, res: Response): Promise<void> {
  res.status(200).json({
    exito: true,
    datos: await monedaService.listarPorPerfil(obtenerPerfilId(req)),
  });
}

export async function asignarMoneda(
  req: RequestBody<AsignarMonedaDTO>,
  res: Response
): Promise<void> {
  res.status(201).json({
    exito: true,
    datos: await monedaService.asignar(obtenerPerfilId(req), req.body),
  });
}

export async function eliminarMonedaPerfil(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { monedaId } = req.params;
  if (typeof monedaId !== 'string') {
    throw new ErrorNoAutorizado('El identificador de moneda no es válido');
  }
  await monedaService.eliminar(obtenerPerfilId(req), monedaId);
  res.sendStatus(204);
}
