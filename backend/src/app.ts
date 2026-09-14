import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Finzo Backend funcionando! 🚀');
});

// Registrar el middleware de errores SIEMPRE al final
app.use(errorHandler);

export default app;
