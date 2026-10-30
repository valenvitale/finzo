import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';

import { useAuth } from '../hooks/useAuth';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import TestPage from '../pages/test';
import { PageContainer } from '../components/layout/PageContainer';
// import Dashboard from '../pages/Dashboard';

function DashboardTemporal() {
  const { logout } = useAuth();

  const cerrarSesion = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <main className="p-8">
      <h1>FINZO - Sesión iniciada</h1>
      <p>La autenticación funciona correctamente.</p>

      <button
        onClick={cerrarSesion}
        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white"
      >
        Cerrar sesión
      </button>
    </main>
  );
}

function RutaProtegida({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Comprobando sesión...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function RutaPublica({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Comprobando sesión...</p>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <RutaPublica>
              <Login />
            </RutaPublica>
          }
        />

        <Route
          path="/register"
          element={
            <RutaPublica>
              <Register />
            </RutaPublica>
          }
        />

        <Route
          element={
            <RutaProtegida>
              <PageContainer />
            </RutaProtegida>
          }
        >
          <Route path="/dashboard" element={<DashboardTemporal />} />
          <Route path="/movimientos" element={<h1>Movimientos</h1>} />
          <Route path="/categorias" element={<h1>Categorías</h1>} />
          <Route path="/estadisticas" element={<h1>Estadísticas</h1>} />
          <Route path="/perfil" element={<h1>Perfil</h1>} />
        </Route>

        <Route path="/test" element={<TestPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
