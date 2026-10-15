
import { Router } from 'express';
import { ResumenController } from '../controllers/resumen.controller.js';
import { ResumenService } from '../services/resumen.service.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validarQuery } from '../middlewares/validacion.middleware.js';
import { resumenQuerySchema } from '../validation/resumen.schema.js';

// ahora la ruta crea el servicio y se lo entrega al controlador.
const resumenService = new ResumenService();
// y el controlador depende de IResumenService.
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
