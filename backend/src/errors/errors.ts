/**
 * Clases de error personalizadas para diferentes tipos de errores.
 */
export class ErrorDeValidacion extends Error{
    constructor(mensaje: string){
        super(mensaje);
        this.name = "ErrorDeValidacion";
    }
}

export class ErrorNoEncontrado extends Error{
    constructor(mensaje: string){
        super(mensaje);
        this.name = "ErrorNoEncontrado";
    }
}

export class ErrorProhibido extends Error{
    constructor(mensaje: string){
        super(mensaje);
        this.name = "ErrorProhibido";
    }
}