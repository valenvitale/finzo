import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { ErrorNoAutorizado } from '../errors/errores.js';
import { ActualizarMovimientoDTO, CrearMovimientoDTO, FiltrosMovimientoDTO } from '../types/movimiento.types.js';
import type { IMovimientoService } from '../services/movimiento.service.js';

function obtenerPerfilId(req: AuthenticatedRequest): string {
  if (!req.user?.id) {
    throw new ErrorNoAutorizado();
  }
  return req.user.id;
}

export class MovimientoController {
  private readonly movimientoService: IMovimientoService;

  constructor(movimientoService: IMovimientoService) {
    this.movimientoService = movimientoService;
  }

  // Crea un nuevo movimiento
  // POST /api/movimientos
  crear = async (
    req: AuthenticatedRequest<Record<string, string>, unknown, CrearMovimientoDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const perfilId = obtenerPerfilId(req);
      const datosMovimiento = req.body;
      const nuevoMovimiento = await this.movimientoService.crear(perfilId, datosMovimiento);
      res.status(201).json({ exito: true, datos: nuevoMovimiento });
    } catch (error) {
      next(error);
    }
  };

  // Obtiene un movimiento por su ID
  // GET /api/movimientos/:id
  obtenerPorId = async (
    req: AuthenticatedRequest<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const perfilId = obtenerPerfilId(req);
      const movimientoId = req.params.id;
      const movimiento = await this.movimientoService.obtenerPorId(movimientoId, perfilId);
      res.status(200).json({ exito: true, datos: movimiento });
    } catch (error) {
      next(error);
    }
  };

  // Actualiza un movimiento existente
  // PATCH /api/movimientos/:id
  actualizar = async (
    req: AuthenticatedRequest<{ id: string }, unknown, ActualizarMovimientoDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const perfilId = obtenerPerfilId(req);
      const movimientoId = req.params.id;
      const datosActualizacion = req.body;
      const movimientoActualizado = await this.movimientoService.actualizar(
        movimientoId,
        perfilId,
        datosActualizacion
      );
      res.status(200).json({ exito: true, datos: movimientoActualizado });
    } catch (error) {
      next(error);
    }
  };

  // Elimina un movimiento existente
  // DELETE /api/movimientos/:id
  eliminar = async (
    req: AuthenticatedRequest<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const perfilId = obtenerPerfilId(req);
      const movimientoId = req.params.id;
      await this.movimientoService.eliminar(movimientoId, perfilId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  // Lista todos los movimientos de un perfil con filtros opcionales
  // GET /api/movimientos
  listar = async (
    req: AuthenticatedRequest<Record<string, string>, unknown, unknown, FiltrosMovimientoDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const perfilId = obtenerPerfilId(req);
      const filtros = req.query;
      const movimientos = await this.movimientoService.listarPorPerfil(perfilId, filtros);
      res.status(200).json({ exito: true, datos: movimientos });
    } catch (error) {
      next(error);
    }
  };
}