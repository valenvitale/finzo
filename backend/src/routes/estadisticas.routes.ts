import { Router } from 'express';
import { EstadisticasController } from '../controllers/estadisticas.controller.js';
import { EstadisticasService } from '../services/estadisticas.service.js';
import { EstadisticasRepository } from '../repositories/estadisticas.repository.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validarQuery } from '../middlewares/validacion.middleware.js';
import { estadisticasQuerySchema } from '../validation/estadisticas.schema.js';

// Composición de dependencias.
const estadisticasRepository = new EstadisticasRepository();

const estadisticasService = new EstadisticasService(
  estadisticasRepository
);

const estadisticasController = new EstadisticasController(
  estadisticasService
);

const estadisticasRouter = Router();

// Todas las rutas requieren autenticación.
estadisticasRouter.use(authMiddleware);

// GET /api/estadisticas
estadisticasRouter.get(
  '/',
  validarQuery(estadisticasQuerySchema),
  estadisticasController.obtenerEstadisticas
);

export default estadisticasRouter;
