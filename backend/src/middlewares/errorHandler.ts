import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Error capturado:', err.message);
  
  // Error genérico (500)
  res.status(500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
  });
};
