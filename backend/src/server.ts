import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('¡Finzo Backend funcionando! 🚀');
});

app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});