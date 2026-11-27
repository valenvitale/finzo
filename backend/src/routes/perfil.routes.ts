import { Router } from 'express';
import { PerfilController } from '../controllers/perfil.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validarCuerpo } from '../middlewares/validacion.middleware.js';
import { PerfilRepository } from '../repositories/perfil.repository.js';
import { PerfilAuthService } from '../services/perfil-auth.service.js';
import { PerfilService } from '../services/perfil.service.js';
import { actualizarPerfilSchema } from '../validation/perfil.schema.js';

const perfilRepository = new PerfilRepository();
const perfilAuthService = new PerfilAuthService();
const perfilService = new PerfilService(perfilRepository, perfilAuthService);
const perfilController = new PerfilController(perfilService);

const perfilRouter = Router();

perfilRouter.use(authMiddleware);
perfilRouter.get('/', perfilController.obtenerPerfil);
perfilRouter.patch('/', validarCuerpo(actualizarPerfilSchema), perfilController.actualizarPerfil);

export default perfilRouter;
