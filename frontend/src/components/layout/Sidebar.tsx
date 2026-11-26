import type { Ref } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowLeftRight, ChartNoAxesColumn, LayoutDashboard, Tags, X } from 'lucide-react';

const secciones = [
  { ruta: '/dashboard', nombre: 'Dashboard', Icono: LayoutDashboard },
  { ruta: '/movimientos', nombre: 'Movimientos', Icono: ArrowLeftRight },
  { ruta: '/categorias', nombre: 'Categorías', Icono: Tags },
  { ruta: '/estadisticas', nombre: 'Estadísticas', Icono: ChartNoAxesColumn },
];

interface SidebarProps {
  ref: Ref<HTMLDialogElement>;
  onClose: () => void;
}

export default function Sidebar({ ref, onClose }: SidebarProps) {
  return (
    <dialog
      ref={ref}
      id="menu-navegacion"
      aria-labelledby="titulo-navegacion"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      className="fixed inset-[0_auto_0_0] m-0 h-dvh max-h-none w-72 max-w-[calc(100%-2rem)] bg-white text-slate-800 shadow-xl backdrop:bg-slate-950/35"
    >
      <div className="min-h-full">
        <div className="flex h-[60px] items-center justify-between border-b border-slate-200 pr-3 pl-5">
          <h2 id="titulo-navegacion" className="text-sm font-semibold text-oliva">
            Navegación
          </h2>
          <form method="dialog">
            <button
              type="submit"
              aria-label="Cerrar menú de navegación"
              className="grid size-11 cursor-pointer place-items-center rounded-lg text-oliva transition-colors hover:bg-oliva-claro focus-visible:outline-2 focus-visible:outline-oliva"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </form>
        </div>

        <nav aria-labelledby="titulo-navegacion" className="grid gap-1 p-3">
          {secciones.map(({ ruta, nombre, Icono }) => (
            <NavLink
              key={ruta}
              to={ruta}
              onClick={(event) => event.currentTarget.closest('dialog')?.close()}
              className={({ isActive }) =>
                `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-oliva ${
                  isActive
                    ? 'bg-oliva/10 font-semibold text-oliva'
                    : 'font-medium text-slate-700 hover:bg-slate-50 hover:text-oliva'
                }`
              }
            >
              <Icono size={18} aria-hidden="true" />
              {nombre}
            </NavLink>
          ))}
        </nav>
      </div>
    </dialog>
  );
}
