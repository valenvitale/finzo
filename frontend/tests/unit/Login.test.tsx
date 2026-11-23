import { AuthApiError } from '@supabase/supabase-js';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it, vi } from 'vitest';
import { useAuth } from '../../src/hooks/useAuth';
import Login from '../../src/pages/auth/Login';

vi.mock('../../src/hooks/useAuth');

it('muestra las credenciales incorrectas en español', async () => {
  vi.mocked(useAuth).mockReturnValue({
    user: null,
    session: null,
    loading: false,
    login: vi.fn().mockRejectedValue(
      new AuthApiError('Invalid login credentials', 400, 'invalid_credentials')
    ),
    register: vi.fn(),
    logout: vi.fn(),
  });

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
  fireEvent.change(screen.getByLabelText('Correo electrónico'), {
    target: { value: 'usuario@example.com' },
  });
  fireEvent.change(screen.getByLabelText('Contraseña'), {
    target: { value: 'incorrecta' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

  expect((await screen.findByRole('alert')).textContent).toBe(
    'El correo electrónico o la contraseña son incorrectos.'
  );
});
