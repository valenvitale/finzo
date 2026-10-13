import { Router } from 'express';
import { CategoriaController } from '../controllers/categoria.controller.js';
import { CategoriaService } from '../services/categoria.service.js';
import { CategoriaRepository } from '../repositories/categoria.repository.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validarCuerpo, validarParametros } from '../middlewares/validacion.middleware.js';
import {
  crearCategoriaSchema,
  actualizarCategoriaSchema,
  categoriaIdParamsSchema,
} from '../validation/categoria.schema.js';

// --- Composición de dependencias ---
const repository = new CategoriaRepository();
const service = new CategoriaService(repository);
const controller = new CategoriaController(service);

const router = Router();

// Todas las rutas de categorías requieren autenticación
router.use(authMiddleware);

router.post('/', validarCuerpo(crearCategoriaSchema), controller.crear);
router.get('/', controller.listar);
router.get('/:id', validarParametros(categoriaIdParamsSchema), controller.obtenerPorId);
router.patch(
  '/:id',
  validarParametros(categoriaIdParamsSchema),
  validarCuerpo(actualizarCategoriaSchema),
  controller.actualizar
);
router.delete('/:id', validarParametros(categoriaIdParamsSchema), controller.eliminar);

export default router;
