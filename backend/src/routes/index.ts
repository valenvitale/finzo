import { Router } from 'express';
import { monedasRouter, perfilMonedasRouter } from './moneda.routes.js';
import perfilRouter from './perfil.routes.js';
import movimientoRoutes from './movimiento.routes.js';
import categoriaRouter from './categoria.routes.js';

const apiRouter = Router();

apiRouter.use('/perfil', perfilRouter);
apiRouter.use('/monedas', monedasRouter);
apiRouter.use('/perfil/monedas', perfilMonedasRouter);
apiRouter.use('/movimientos', movimientoRoutes);
apiRouter.use('/categorias', categoriaRouter);

export default apiRouter;
