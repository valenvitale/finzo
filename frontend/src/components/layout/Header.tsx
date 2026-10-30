import { useAuth } from '../../hooks/useAuth';

export default function Header(){
    const { user, logout } = useAuth();

    const cerrarSesion = async () => {
        try{
            await logout();
        }catch(error){
            console.error('Error al cerrar sesión', error);
        }
    };

    return(
        <header className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white px-6 py-4">
            <img
                src="/images/finzo-logo.png"
                alt="Finzo"
                className="mr-auto h-18 w-auto"
            />
            <span className="font-medium text-slate-700">
                {user?.user_metadata?.nombre ?? 'Usuario'}
            </span>
            <button 
                type="button" 
                onClick={cerrarSesion}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
                Cerrar sesión
            </button>
        </header>
    );
}