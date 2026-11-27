import { describe, expect, it } from 'vitest';
import {
  AppError,
  ErrorDeConflicto,
  ErrorDeValidacion,
  ErrorNoAutorizado,
  ErrorNoEncontrado,
  ErrorProhibido,
} from '../../src/errors/errores.js';

describe('Jerarquía de errores de la aplicación', () => {
  it.each([
    [ErrorNoEncontrado, 404],
    [ErrorProhibido, 403],
    [ErrorNoAutorizado, 401],
    [ErrorDeValidacion, 400],
    [ErrorDeConflicto, 409],
  ])('%s establece el código HTTP %i y es operacional', (ErrorClass, statusCode) => {
    const error = new ErrorClass();

    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(statusCode);
    expect(error.esOperacional).toBe(true);
  });

  it('conserva el mensaje y los errores de validación', () => {
    const error = new ErrorDeValidacion('Datos inválidos', ['nombre requerido']);

    expect(error.message).toBe('Datos inválidos');
    expect(error.errores).toEqual(['nombre requerido']);
  });

  it('permite indicar errores no operacionales en la clase base', () => {
    const error = new AppError('Fallo inesperado', 500, false);

    expect(error.statusCode).toBe(500);
    expect(error.esOperacional).toBe(false);
  });
});
