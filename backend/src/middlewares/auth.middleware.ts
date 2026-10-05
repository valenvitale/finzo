import type { NextFunction, Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'No autorizado',
      message: 'Token de autenticación ausente',
    });
    return;
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    res.status(401).json({
      error: 'No autorizado',
      message: 'Token de autenticación ausente',
    });
    return;
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    res.status(401).json({
      error: 'No autorizado',
      message: 'Token de autenticación inválido',
    });
    return;
  }

  req.user = {
    id: user.id,
    email: user.email ?? '',
  };

  next();
}