import { Router } from 'express';
import { obtenerResumen } from '../controllers/resumen.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const resumenRouter = Router();

// todas las rutas de este router requieren autenticación.
resumenRouter.use(authMiddleware);

// GET /api/resumen
resumenRouter.get('/', obtenerResumen);

export default resumenRouter;