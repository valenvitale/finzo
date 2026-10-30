import { NavLink } from 'react-router-dom';

export default function Sidebar(){
    return(
        <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-200 bg-white p-4">
            <nav className="flex flex-col gap-2">
                <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                    `rounded-lg px-4 py-2 ${
                    isActive
                        ? 'bg-[#343D2B] text-white'
                        : 'text-[#343D2B] hover:bg-orange-100'
                    }`
                }
                >
                Dashboard
                </NavLink>

                <NavLink
                to="/movimientos"
                className={({ isActive }) =>
                    `rounded-lg px-4 py-2 ${
                    isActive
                        ? 'bg-[#343D2B] text-white'
                        : 'text-[#343D2B] hover:bg-orange-100'
                    }`
                }
                >
                Movimientos
                </NavLink>

                <NavLink
                to="/categorias"
                className={({ isActive }) =>
                    `rounded-lg px-4 py-2 ${
                    isActive
                        ? 'bg-[#343D2B] text-white'
                        : 'text-[#343D2B] hover:bg-orange-100'
                    }`
                }
                >
                Categorías
                </NavLink>

                <NavLink
                to="/estadisticas"
                className={({ isActive }) =>
                    `rounded-lg px-4 py-2 ${
                    isActive
                        ? 'bg-[#343D2B] text-white'
                        : 'text-[#343D2B] hover:bg-orange-100'
                    }`
                }
                >
                Estadísticas
                </NavLink>
                
                <NavLink
                to="/perfil"
                className={({ isActive }) =>
                    `rounded-lg px-4 py-2 ${
                    isActive
                        ? 'bg-[#343D2B] text-white'
                        : 'text-[#343D2B] hover:bg-orange-100'
                    }`
                }
                >
                Perfil
                </NavLink>
            </nav>
        </aside>
    );
}