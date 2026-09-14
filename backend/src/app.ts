import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
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
