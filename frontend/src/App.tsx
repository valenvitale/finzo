import { Toaster } from 'sonner';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <>
      <AppRouter />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;