import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodType } from 'zod';
import { ErrorDeValidacion } from '../utils/errores.js';

type PropiedadValidada = 'body' | 'params' | 'query';

function validar(schema: ZodType, propiedad: PropiedadValidada): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const resultado = schema.safeParse(req[propiedad]);

    if (!resultado.success) {
      const errores = resultado.error.issues.map((issue) => {
        if (issue.code === 'unrecognized_keys') {
          return 'No se permiten propiedades adicionales';
        }

        const campo = issue.path.join('.');
        return campo ? `${campo}: ${issue.message}` : issue.message;
      });

      next(new ErrorDeValidacion('Los datos enviados no son válidos', errores));
      return;
    }

    Object.defineProperty(req, propiedad, {
      configurable: true,
      enumerable: true,
      writable: true,
      value: resultado.data,
    });
    next();
  };
}

export function validarCuerpo(schema: ZodType): RequestHandler {
  return validar(schema, 'body');
}

export function validarParametros(schema: ZodType): RequestHandler {
  return validar(schema, 'params');
}

export function validarQuery(schema: ZodType): RequestHandler {
  return validar(schema, 'query');
}
