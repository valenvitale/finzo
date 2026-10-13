import { Router } from 'express';
import { actualizarPerfil, obtenerPerfil } from '../controllers/perfil.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validarCuerpo } from '../middlewares/validacion.middleware.js';
import { actualizarPerfilSchema } from '../validation/perfil.schema.js';

const perfilRouter = Router();

perfilRouter.use(authMiddleware);
perfilRouter.get('/', obtenerPerfil);
perfilRouter.patch('/', validarCuerpo(actualizarPerfilSchema), actualizarPerfil);

export default perfilRouter;
