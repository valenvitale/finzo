import { Router } from 'express';
import { MovimientoController } from '../controllers/movimiento.controller.js';
import { MovimientoService } from '../services/movimiento.service.js';
import { MovimientoRepository } from '../repositories/movimiento.repository.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

// --- Composición de dependencias ---
const repository = new MovimientoRepository();
const service = new MovimientoService(repository);
const controller = new MovimientoController(service);

const router = Router();

// Todas las rutas de movimientos requieren autenticación
router.use(authMiddleware);

router.post('/', controller.crear);
router.get('/', controller.listar);
router.get('/:id', controller.obtenerPorId);
router.patch('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

export default router;

