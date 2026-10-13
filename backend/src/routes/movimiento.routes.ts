import { Router } from 'express';
import { MovimientoController } from '../controllers/movimiento.controller.js';
import { MovimientoService } from '../services/movimiento.service.js';
import { MovimientoRepository } from '../repositories/movimiento.repository.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validarCuerpo, validarParametros, validarQuery } from '../middlewares/validacion.middleware.js';
import {
  crearMovimientoSchema,
  actualizarMovimientoSchema,
  filtrosMovimientoSchema,
  movimientoIdParamsSchema,
} from '../validation/movimiento.schema.js';

// --- Composición de dependencias ---
const repository = new MovimientoRepository();
const service = new MovimientoService(repository);
const controller = new MovimientoController(service);

const router = Router();

// Todas las rutas de movimientos requieren autenticación
router.use(authMiddleware);

router.post('/', validarCuerpo(crearMovimientoSchema), controller.crear);
router.get('/', validarQuery(filtrosMovimientoSchema), controller.listar);
router.get('/:id', validarParametros(movimientoIdParamsSchema), controller.obtenerPorId);
router.patch(
  '/:id',
  validarParametros(movimientoIdParamsSchema),
  validarCuerpo(actualizarMovimientoSchema),
  controller.actualizar
);
router.delete('/:id', validarParametros(movimientoIdParamsSchema), controller.eliminar);

export default router;

