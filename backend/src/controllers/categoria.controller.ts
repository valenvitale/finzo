import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { prisma } from '../config/prisma.js';
import { CategoriaRepository } from '../repositories/categoria.repository.js';
import { CategoriaService } from '../services/categoria.service.js';
import { ErrorNoAutorizado, ErrorDeValidacion } from '../errors/errores.js';

const categoriaService = new CategoriaService(
  new CategoriaRepository(prisma),
);

function obtenerPerfilId(req: AuthenticatedRequest): string {
  if (!req.user?.id) {
    throw new ErrorNoAutorizado();
  }

  return req.user.id;
}

function obtenerCategoriaId(req: AuthenticatedRequest): string {
  const { id } = req.params;

  if (typeof id !== 'string' || !id) {
    throw new ErrorDeValidacion('El ID de categoría no es válido');
  }

  return id;
}

export const listarCategorias = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try{
    const idPerfil = obtenerPerfilId(req);
    const categorias = await categoriaService.listar(idPerfil);

    res.status(200).json({exito: true, datos: categorias});
  }catch(error){
    next(error);
  }
};

export const crearCategoria = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try{
    const idPerfil = obtenerPerfilId(req);
    const categoria = await categoriaService.crear(idPerfil, req.body);

    res.status(201).json({exito: true, datos: categoria});
  }catch(error){
    next(error);
  }
};

export const actualizarCategoria = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try{
    const idPerfil = obtenerPerfilId(req);
    const id = obtenerCategoriaId(req);

    const categoria = await categoriaService.actualizar(idPerfil, id, req.body);

    res.status(200).json({exito: true, datos: categoria});
  }catch(error){
    next(error);
  }
};

export const eliminarCategoria = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try{
    const idPerfil = obtenerPerfilId(req);
    const id = obtenerCategoriaId(req);

    await categoriaService.eliminar(idPerfil, id);

    res.status(204).send();
  }catch(error){
    next(error);
  }
};