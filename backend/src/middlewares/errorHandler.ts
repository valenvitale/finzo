import type { NextFunction, Request, Response } from 'express';
import { AppError, ErrorDeValidacion } from '../errors/errores.js';

export const errorHandler = (err: unknown, _req: Request, res: Response, next: NextFunction): void => {
  console.error('Error capturado por el middleware global:', err);

  if (res.headersSent) {
    next(err);
    return;
  }

  const esErrorAplicacion = err instanceof AppError && err.esOperacional;
  const statusCode = esErrorAplicacion ? err.statusCode : 500;
  const esProduccion = process.env.NODE_ENV === 'production';
  const mensaje =
    statusCode === 500 && esProduccion
      ? 'Error interno del servidor'
      : err instanceof Error
        ? err.message
        : 'Error interno del servidor';
  const errores = err instanceof ErrorDeValidacion ? err.errores : [];

  res.status(statusCode).json({
    exito: false,
    mensaje,
    errores,
  });
};
