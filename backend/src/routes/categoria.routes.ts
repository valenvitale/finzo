import { Router } from 'express';
import {
  listarCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from '../controllers/categoria.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validarCuerpo } from '../middlewares/validacion.middleware.js';
import {
  crearCategoriaSchema,
  actualizarCategoriaSchema,
} from '../validation/categoria.schema.js';

const categoriaRouter = Router();

categoriaRouter.use(authMiddleware);

categoriaRouter.get('/', listarCategorias);

categoriaRouter.post(
  '/',
  validarCuerpo(crearCategoriaSchema),
  crearCategoria,
);

categoriaRouter.patch(
  '/:id',
  validarCuerpo(actualizarCategoriaSchema),
  actualizarCategoria,
);

categoriaRouter.delete('/:id', eliminarCategoria);

export default categoriaRouter;