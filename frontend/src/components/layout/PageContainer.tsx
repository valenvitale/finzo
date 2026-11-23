import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import { obtenerPerfil } from '../../services/perfil.service';
import type { ContextoPerfil } from '../../types/perfil.types';
import Sidebar from './Sidebar';
import Header from './Header';
import Navbar from './Navbar';

export function PageContainer() {
  const { user } = useAuth();
  return <ContenidoPrivado key={user?.id} />;
}

function ContenidoPrivado() {
  const { data: perfil, loading: cargando, error, ejecutar: cargar, setData } = useApi(obtenerPerfil);

  useEffect(() => {
    void cargar().catch(() => undefined);
  }, [cargar]);

  const contextoPerfil: ContextoPerfil = { perfil, cargando, error, cargar, actualizarPerfilLocal: setData };

  return (
    <div className="h-screen overflow-hidden">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex h-full flex-col md:ml-64">
        <div className="max-h-[50vh] shrink-0 overflow-y-auto">
          <Navbar />
        </div>
        <div className="shrink-0 p-6">
          <Header nombrePerfil={perfil?.nombre} />
        </div>

        <main className="min-h-0 flex-1 overflow-y-auto p-6">
          <Outlet context={contextoPerfil} />
        </main>
      </div>
    </div>
  );
}
