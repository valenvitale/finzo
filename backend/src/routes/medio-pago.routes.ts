import { Router } from 'express';
import { MedioPagoController } from '../controllers/medio-pago.controller.js';
import { MedioPagoRepository } from '../repositories/medio-pago.repository.js';
import { MedioPagoService } from '../services/medio-pago.service.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validarCuerpo } from '../middlewares/validacion.middleware.js';
import {
  crearMedioPagoSchema,
  actualizarMedioPagoSchema,
} from '../validation/medio-pago.schema.js';

const controller = new MedioPagoController(new MedioPagoService(new MedioPagoRepository()));
const medioPagoRouter  = Router();

medioPagoRouter .use(authMiddleware);
medioPagoRouter .get('/', controller.listar);
medioPagoRouter.post('/', validarCuerpo(crearMedioPagoSchema), controller.crear);
medioPagoRouter.patch('/:id', validarCuerpo(actualizarMedioPagoSchema), controller.actualizar);
medioPagoRouter.delete('/:id', controller.eliminar);

export default medioPagoRouter ;
