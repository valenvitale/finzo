import { Router } from 'express';
import { PresupuestoController } from '../controllers/presupuesto.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validarCuerpo, validarParametros, validarQuery } from '../middlewares/validacion.middleware.js';
import { PresupuestoRepository } from '../repositories/presupuesto.repository.js';
import { PresupuestoService } from '../services/presupuesto.service.js';
import {
  actualizarPresupuestoSchema,
  crearPresupuestoSchema,
  listarPresupuestosQuerySchema,
  presupuestoIdParamsSchema,
} from '../validation/presupuesto.schema.js';

const presupuestoController = new PresupuestoController(new PresupuestoService(new PresupuestoRepository()));
const router = Router();

router.use(authMiddleware);
router.get('/', validarQuery(listarPresupuestosQuerySchema), presupuestoController.listar);
router.post('/', validarCuerpo(crearPresupuestoSchema), presupuestoController.crear);
router.patch(
  '/:id',
  validarParametros(presupuestoIdParamsSchema),
  validarCuerpo(actualizarPresupuestoSchema),
  presupuestoController.actualizar
);
router.delete('/:id', validarParametros(presupuestoIdParamsSchema), presupuestoController.eliminar);

export default router;
