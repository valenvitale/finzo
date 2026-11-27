import { Router } from 'express';
import { MonedaController } from '../controllers/moneda.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { MonedaRepository } from '../repositories/moneda.repository.js';
import { MonedaService } from '../services/moneda.service.js';
import { validarCuerpo, validarParametros } from '../middlewares/validacion.middleware.js';
import { asignarMonedaSchema, monedaIdParamsSchema } from '../validation/moneda.schema.js';

const monedaRepository = new MonedaRepository();
const monedaService = new MonedaService(monedaRepository);
const monedaController = new MonedaController(monedaService);

const monedasRouter = Router();
const perfilMonedasRouter = Router();

monedasRouter.get('/', monedaController.listarMonedas);

perfilMonedasRouter.use(authMiddleware);
perfilMonedasRouter.get('/', monedaController.listarMonedasPerfil);
perfilMonedasRouter.post('/', validarCuerpo(asignarMonedaSchema), monedaController.asignarMoneda);
perfilMonedasRouter.delete(
  '/:monedaId',
  validarParametros(monedaIdParamsSchema),
  monedaController.eliminarMonedaPerfil
);

export { monedasRouter, perfilMonedasRouter };
