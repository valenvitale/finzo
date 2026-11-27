import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import Categorias from '../pages/Categorias';

import { useAuth } from '../hooks/useAuth';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import TestPage from '../pages/test';
import { PageContainer } from '../components/layout/PageContainer';
import Dashboard from '../pages/Dashboard';
import Perfil from '../pages/Perfil';
import Movimientos from '../pages/Movimientos';
import Estadisticas from '../pages/Estadisticas';
import Presupuestos from '../pages/Presupuestos';

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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/movimientos" element={<Movimientos/>} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="/presupuestos" element={<Presupuestos />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        <Route path="/test" element={<TestPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
