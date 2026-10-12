import { Router } from 'express';
import { monedasRouter, perfilMonedasRouter } from './moneda.routes.js';
import perfilRouter from './perfil.routes.js';

const apiRouter = Router();

apiRouter.use('/perfil', perfilRouter);
apiRouter.use('/monedas', monedasRouter);
apiRouter.use('/perfil/monedas', perfilMonedasRouter);

export default apiRouter;
