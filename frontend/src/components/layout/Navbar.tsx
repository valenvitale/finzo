import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar(){
    const [abierto, setAbierto] = useState(false);

    return(
        <nav className="border-b border-slate-200 bg-white p-4 md:hidden">
            <button
                type="button"
                onClick={() => setAbierto(!abierto)}
                aria-expanded={abierto}
                aria-controls="menu-movil"
            >
                {abierto ? 'Cerrar menú' : 'Abrir menú'}
            </button>
            {abierto &&(
                <div id="menu-movil" className="mt-3 flex flex-col gap-2">
                    <NavLink
                        to="/dashboard"
                        onClick={() => setAbierto(false)}
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
                        onClick={() => setAbierto(false)}
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
                        onClick={() => setAbierto(false)}
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
                        onClick={() => setAbierto(false)}
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
                        onClick={() => setAbierto(false)}
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
                </div>
            )}
        </nav>
    );
}