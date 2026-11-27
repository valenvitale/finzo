import { useState, type SubmitEventHandler } from 'react';
import { isAuthApiError } from '@supabase/supabase-js';
import { Link, useNavigate } from 'react-router-dom';
import { Boton } from '../../components/common/Boton';
import { InputTexto } from '../../components/common/InputTexto';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Completá el correo y la contraseña.');
      return;
    }

    setCargando(true);

    try {
      await login(email.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);

      if (isAuthApiError(error) && error.code === 'invalid_credentials') {
        setError('El correo electrónico o la contraseña son incorrectos.');
        return;
      }

      setError(
        error instanceof Error
          ? error.message
          : 'Ocurrió un error desconocido.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-sm border border-slate-200"
      >
        <div className="text-center">
          <div className="relative mx-auto size-14 overflow-hidden">
            <img
              src="/images/finzo-logo.png"
              alt="Finzo"
              className="absolute top-1/2 left-1/2 size-22 max-w-none -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <h1 className="mt-2 text-xl font-semibold text-slate-900">
            Iniciar sesión
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Ingresá a tu cuenta para gestionar tus finanzas.
          </p>
        </div>

        <InputTexto
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <InputTexto
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          placeholder="Ingresá tu contraseña"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <Boton
          type="submit"
          cargando={cargando}
          disabled={cargando}
          className="w-full"
        >
          Iniciar sesión
        </Boton>

        <p className="text-center text-sm text-slate-600">
          ¿No tenés cuenta?{' '}
          <Link
            to="/register"
            className="font-medium text-naranja hover:text-naranja-hover hover:underline"
          >
            Registrate
          </Link>
        </p>
      </form>
    </main>
  );
}
