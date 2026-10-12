import { Router } from 'express';
import { MovimientoController } from '../controllers/movimiento.controller.js';
import { MovimientoService } from '../services/movimiento.service.js';
import { MovimientoRepository } from '../repositories/movimiento.repository.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validarCuerpo, validarQuery } from '../middlewares/validacion.middleware.js';
import {
  crearMovimientoSchema,
  actualizarMovimientoSchema,
  filtrosMovimientoSchema,
} from '../validation/movimiento.schema.js';

// --- Composición de dependencias ---
const repository = new MovimientoRepository();
const service = new MovimientoService(repository);
const controller = new MovimientoController(service);

const router = Router();

// Todas las rutas de movimientos requieren autenticación
router.use(authMiddleware);

router.post('/',validarCuerpo(crearMovimientoSchema), controller.crear);
router.get('/', validarQuery(filtrosMovimientoSchema), controller.listar);
router.get('/:id', controller.obtenerPorId);
router.patch('/:id', validarCuerpo(actualizarMovimientoSchema), controller.actualizar);
router.delete('/:id', controller.eliminar);

export default router;

