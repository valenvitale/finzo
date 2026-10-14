import { useState, type SubmitEventHandler } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Boton } from '../../components/common/Boton';
import { InputTexto } from '../../components/common/InputTexto';
import { useAuth } from '../../hooks/useAuth';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [registrado, setRegistrado] = useState(false);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setError('');

    if (!nombre.trim() || !apellido.trim() || !email.trim() || !password) {
      setError('Completá todos los campos.');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setCargando(true);

    try {
        await register(nombre.trim(), apellido.trim(), email.trim(), password);
        setRegistrado(true);
    } catch (error) {
        console.error('Error al registrar usuario:', error);

        setError(
            error instanceof Error
            ? error.message
            : 'Ocurrió un error desconocido.'
        );
    } finally {
    setCargando(false);
    }
  };

  if (registrado) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 text-center shadow-md">
          <h1 className="text-2xl font-bold text-indigo-600">¡Registro recibido!</h1>
          <p className="text-slate-600">
            Si se requiere confirmar tu correo, revisá tu bandeja de entrada.
            Después podés iniciar sesión.
          </p>
          <Boton className="w-full" onClick={() => navigate('/login')}>
            Ir al inicio de sesión
          </Boton>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-xl bg-white p-8 shadow-md"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-600">FINZO</h1>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Crear cuenta</h2>
        </div>

        <InputTexto
          label="Nombre"
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
          autoComplete="given-name"
          required
        />

        <InputTexto
          label="Apellido"
          value={apellido}
          onChange={(event) => setApellido(event.target.value)}
          autoComplete="family-name"
          required
        />

        <InputTexto
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />

        <InputTexto
          label="Contraseña"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          minLength={8}
          required
        />

        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

        <Boton type="submit" cargando={cargando} className="w-full">
          Crear cuenta
        </Boton>

        <p className="text-center text-sm text-slate-600">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </form>
    </main>
  );
}
