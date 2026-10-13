import { crearMovimientoSchema, actualizarMovimientoSchema, filtrosMovimientoSchema } from "../validation/movimiento.schema.js";
import { MovimientoService } from "../services/movimiento.service.js";
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js"; 
export class MovimientoController {
    private readonly movimientoService: MovimientoService;

    constructor(movimientoService: MovimientoService) {
        this.movimientoService = movimientoService;
    }

    //Crea un nuevo movimiento
    // POST /api/movimientos
    crear = async (req: AuthenticatedRequest, res: Response, next: NextFunction):Promise<void> => {
        try {
        const perfilId = req.user!.id;
        const datosMovimiento = crearMovimientoSchema.parse(req.body);
        const nuevoMovimiento = await this.movimientoService.crear(perfilId, datosMovimiento);
        res.status(201).json({ exito: true, datos: nuevoMovimiento });
        } catch (error) {
        next(error);
        }
    };
    
    //Obtiene un movimiento por su ID
    // GET /api/movimientos/:id
    obtenerPorId = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
        const perfilId = req.user!.id;
        const movimientoId = req.params.id as string;
        const movimiento = await this.movimientoService.obtenerPorId(movimientoId, perfilId);
        res.status(200).json({ exito: true, datos: movimiento });
        } catch (error) {
        next(error);
        }
    };

    //Actualiza un movimiento existente
    // PATCH /api/movimientos/:id
    actualizar = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try{
        const perfilId = req.user!.id;
        const movimientoId = req.params.id as string;
        const datosActualizacion = actualizarMovimientoSchema.parse(req.body);
        const movimientoActualizado = await this.movimientoService.actualizar(movimientoId, perfilId, datosActualizacion);
        res.status(200).json({ exito: true, datos: movimientoActualizado });
        } catch (error) {
        next(error);
        }
    }

    //Elimina un movimiento existente
    // DELETE /api/movimientos/:id
    eliminar = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => { 
        try {
        const perfilId = req.user!.id;
        const movimientoId = req.params.id as string;
        await this.movimientoService.eliminar(movimientoId, perfilId);
        res.status(204).send();
        } catch (error) {
        next(error);
        }
    }

    //Lista todos los movimientos de un perfil con filtros opcionales
    // GET /api/movimientos
    listar = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
        const perfilId = req.user!.id;
        const filtros = filtrosMovimientoSchema.parse(req.query);
        const movimientos = await this.movimientoService.listarPorPerfil(perfilId, filtros);
        res.status(200).json({ exito: true, datos: movimientos });
        } catch (error) {
        next(error);
        }
    }
}