export class AppError extends Error {
  constructor(
    mensaje: string,
    public readonly statusCode: number,
    public readonly esOperacional = true
  ) {
    super(mensaje);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ErrorNoEncontrado extends AppError {
  constructor(mensaje = 'Recurso no encontrado') {
    super(mensaje, 404);
  }
}

export class ErrorProhibido extends AppError {
  constructor(mensaje = 'Acceso prohibido') {
    super(mensaje, 403);
  }
}

export class ErrorNoAutorizado extends AppError {
  constructor(mensaje = 'No autorizado') {
    super(mensaje, 401);
  }
}

export class ErrorDeValidacion extends AppError {
  constructor(
    mensaje = 'Error de validación',
    public readonly errores: string[] = []
  ) {
    super(mensaje, 400);
  }
}

export class ErrorDeConflicto extends AppError {
  constructor(mensaje = 'Conflicto con el estado actual del recurso') {
    super(mensaje, 409);
  }
}
