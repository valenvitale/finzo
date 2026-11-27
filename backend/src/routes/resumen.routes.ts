import { Router } from 'express';
import { ResumenController } from '../controllers/resumen.controller.js';
import { ResumenService } from '../services/resumen.service.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validarQuery } from '../middlewares/validacion.middleware.js';
import { resumenQuerySchema } from '../validation/resumen.schema.js';
import { MovimientoRepository } from '../repositories/movimiento.repository.js';
import { MonedaRepository } from '../repositories/moneda.repository.js';

// Composición de dependencias: el servicio depende de los repositorios, y el controlador depende del servicio.
const movimientoRepository = new MovimientoRepository();
const monedaRepository = new MonedaRepository();

const resumenService = new ResumenService(movimientoRepository, monedaRepository);

const resumenController = new ResumenController(resumenService);

const resumenRouter = Router();

// Todas las rutas requieren autenticación.
resumenRouter.use(authMiddleware);

// GET /api/resumen
resumenRouter.get(
  '/',
  validarQuery(resumenQuerySchema),
  resumenController.obtenerResumen
);

export default resumenRouter;