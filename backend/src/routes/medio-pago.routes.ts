import { Router } from 'express';
import { MedioPagoController } from '../controllers/medio-pago.controller.js';
import { MedioPagoRepository } from '../repositories/medio-pago.repository.js';
import { MedioPagoService } from '../services/medio-pago.service.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const controller = new MedioPagoController(new MedioPagoService(new MedioPagoRepository()));
const medioPagoRouter  = Router();

medioPagoRouter .use(authMiddleware);
medioPagoRouter .get('/', controller.listar);

export default medioPagoRouter ;
