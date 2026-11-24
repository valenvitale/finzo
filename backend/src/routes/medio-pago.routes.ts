import { Router } from 'express';
import { MedioPagoController } from '../controllers/medio-pago.controller.js';
import { MedioPagoRepository } from '../repositories/medio-pago.repository.js';
import { MedioPagoService } from '../services/medio-pago.service.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validarCuerpo, validarParametros } from '../middlewares/validacion.middleware.js';
import {
  crearMedioPagoSchema,
  actualizarMedioPagoSchema,
  medioPagoIdParamsSchema,
} from '../validation/medio-pago.schema.js';

const controller = new MedioPagoController(new MedioPagoService(new MedioPagoRepository()));
const medioPagoRouter  = Router();

medioPagoRouter .use(authMiddleware);
medioPagoRouter .get('/', controller.listar);
medioPagoRouter.post('/', validarCuerpo(crearMedioPagoSchema), controller.crear);
medioPagoRouter.patch(
  '/:id',
  validarParametros(medioPagoIdParamsSchema),
  validarCuerpo(actualizarMedioPagoSchema),
  controller.actualizar,
);
medioPagoRouter.delete(
  '/:id',
  validarParametros(medioPagoIdParamsSchema),
  controller.eliminar,
);

export default medioPagoRouter ;
