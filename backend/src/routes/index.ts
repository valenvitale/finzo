import { Router } from 'express';
import { monedasRouter, perfilMonedasRouter } from './moneda.routes.js';
import perfilRouter from './perfil.routes.js';
import movimientoRoutes from './movimiento.routes.js'

const apiRouter = Router();

apiRouter.use('/perfil', perfilRouter);
apiRouter.use('/monedas', monedasRouter);
apiRouter.use('/perfil/monedas', perfilMonedasRouter);
apiRouter.use('/movimientos', movimientoRoutes);

export default apiRouter;
