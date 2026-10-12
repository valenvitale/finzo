import { Router } from 'express';
import {
  asignarMoneda,
  eliminarMonedaPerfil,
  listarMonedas,
  listarMonedasPerfil,
} from '../controllers/moneda.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validarCuerpo, validarParametros } from '../middlewares/validacion.middleware.js';
import { asignarMonedaSchema, monedaIdParamsSchema } from '../types/schemas/moneda.schema.js';

const monedasRouter = Router();
const perfilMonedasRouter = Router();

monedasRouter.get('/', listarMonedas);

perfilMonedasRouter.use(authMiddleware);
perfilMonedasRouter.get('/', listarMonedasPerfil);
perfilMonedasRouter.post('/', validarCuerpo(asignarMonedaSchema), asignarMoneda);
perfilMonedasRouter.delete('/:monedaId', validarParametros(monedaIdParamsSchema), eliminarMonedaPerfil);

export { monedasRouter, perfilMonedasRouter };
