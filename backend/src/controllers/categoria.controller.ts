import type { NextFunction, Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import type { CategoriaService } from '../services/categoria.service.js';
import { ErrorNoAutorizado } from '../errors/errores.js';
import type { ActualizarCategoriaDTO, CrearCategoriaDTO } from '../types/categoria.types.js';

function obtenerPerfilId(req: AuthenticatedRequest): string {
  if (!req.user?.id) {
    throw new ErrorNoAutorizado();
  }
  return req.user.id;
}

export class CategoriaController {
  private readonly categoriaService: CategoriaService;

  constructor(categoriaService: CategoriaService) {
    this.categoriaService = categoriaService;
  }

  // Crea una nueva categoría
  // POST /api/categorias
  crear = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const perfilId = obtenerPerfilId(req);
      const datosCategoria = req.body as CrearCategoriaDTO;
      const nuevaCategoria = await this.categoriaService.crear(perfilId, datosCategoria);
      res.status(201).json({ exito: true, datos: nuevaCategoria });
    } catch (error) {
      next(error);
    }
  };

  // Obtiene una categoría por su ID
  // GET /api/categorias/:id
  obtenerPorId = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const perfilId = obtenerPerfilId(req);
      const categoriaId = req.params.id as string;
      const categoria = await this.categoriaService.obtenerPorId(categoriaId, perfilId);
      res.status(200).json({ exito: true, datos: categoria });
    } catch (error) {
      next(error);
    }
  };

  // Actualiza una categoría existente
  // PATCH /api/categorias/:id
  actualizar = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const perfilId = obtenerPerfilId(req);
      const categoriaId = req.params.id as string;
      const datosActualizacion = req.body as ActualizarCategoriaDTO;
      const categoriaActualizada = await this.categoriaService.actualizar(categoriaId, perfilId, datosActualizacion);
      res.status(200).json({ exito: true, datos: categoriaActualizada });
    } catch (error) {
      next(error);
    }
  };

  // Elimina una categoría existente
  // DELETE /api/categorias/:id
  eliminar = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const perfilId = obtenerPerfilId(req);
      const categoriaId = req.params.id as string;
      await this.categoriaService.eliminar(categoriaId, perfilId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  // Lista todas las categorías de un perfil (globales y personalizadas)
  // GET /api/categorias
  listar = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const perfilId = obtenerPerfilId(req);
      const categorias = await this.categoriaService.listarPorPerfil(perfilId);
      res.status(200).json({ exito: true, datos: categorias });
    } catch (error) {
      next(error);
    }
  };
}
