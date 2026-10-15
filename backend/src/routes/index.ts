import { Router } from 'express';
import { monedasRouter, perfilMonedasRouter } from './moneda.routes.js';
import perfilRouter from './perfil.routes.js';
import movimientoRoutes from './movimiento.routes.js'
import categoriaRouter from './categoria.routes.js';
import medioPagoRouter  from './medio-pago.routes.js';
import resumenRouter from './resumen.routes.js';

const apiRouter = Router();

apiRouter.use('/perfil', perfilRouter);
apiRouter.use('/monedas', monedasRouter);
apiRouter.use('/perfil/monedas', perfilMonedasRouter);
apiRouter.use('/movimientos', movimientoRoutes);
apiRouter.use('/categorias', categoriaRouter);
apiRouter.use('/medios-pago', medioPagoRouter );
apiRouter.use('/resumen', resumenRouter);

export default apiRouter;
