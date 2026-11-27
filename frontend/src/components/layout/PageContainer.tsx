import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import { obtenerPerfil } from '../../services/perfil.service';
import type { ContextoPerfil } from '../../types/perfil.types';
import Header from './Header';

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
    <div className="flex h-dvh flex-col bg-slate-50">
      <Header nombrePerfil={perfil?.nombre} />

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 pt-5 sm:px-6 sm:pt-6 lg:px-8">
        <Outlet context={contextoPerfil} />
      </main>
    </div>
  );
}
