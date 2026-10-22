import type { NextFunction, Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { ErrorNoAutorizado } from '../errors/errores.js';

export interface AuthenticatedRequest<
  P = Record<string, string>,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown,
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: {
    id: string;
    email: string;
  };
}

// Helpers para peticiones autenticadas (todas las combinaciones posibles de Params, Body y Query)
// 1 elemento:
export type RequestParams<P> = AuthenticatedRequest<P>;
export type RequestBody<B> = AuthenticatedRequest<Record<string, string>, unknown, B>;
export type RequestQuery<Q> = AuthenticatedRequest<Record<string, string>, unknown, unknown, Q>;

// 2 elementos combinados:
export type RequestParamsBody<P, B> = AuthenticatedRequest<P, unknown, B>;
export type RequestParamsQuery<P, Q> = AuthenticatedRequest<P, unknown, unknown, Q>;
export type RequestBodyQuery<B, Q> = AuthenticatedRequest<Record<string, string>, unknown, B, Q>;

// 3 elementos combinados:
export type RequestParamsBodyQuery<P, B, Q> = AuthenticatedRequest<P, unknown, B, Q>;

export async function authMiddleware(
  req: AuthenticatedRequest,
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