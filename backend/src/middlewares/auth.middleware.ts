import type { NextFunction, Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { ErrorNoAutorizado } from '../errors/errores.js';

// Request autenticado con parámetros de ruta tipados como cadenas simples por defecto
export type AuthenticatedRequest<P = Record<string, string>> = Request<P>;

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new ErrorNoAutorizado(
        'Token de autenticación ausente'
      );
    }

    const token = authorization.slice(7).trim();

    if (!token) {
      throw new ErrorNoAutorizado(
        'Token de autenticación ausente'
      );
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new ErrorNoAutorizado(
        'Token de autenticación inválido o expirado'
      );
    }

    req.user = {
      id: user.id,
      email: user.email ?? '',
    };

    next();
  } catch (error) {
    if (error instanceof ErrorNoAutorizado) {
      next(error);
      return;
    }

    next(error);
  }
}


