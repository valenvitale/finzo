import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../src/App';
import { AuthProvider } from '../../src/context/AuthContext';

const { unsubscribe } = vi.hoisted(() => ({ unsubscribe: vi.fn() }));

vi.mock('../../src/services/supabase', () => ({
  supabase: {
    auth: {
      onAuthStateChange: (callback: (event: 'INITIAL_SESSION', session: null) => void) => {
        queueMicrotask(() => callback('INITIAL_SESSION', null));
        return { data: { subscription: { unsubscribe } } };
      },
    },
  },
}));

describe('Frontend App', () => {
  it('muestra el inicio de sesión cuando termina la comprobación de sesión', async () => {
    window.history.replaceState({}, '', '/');
    const { unmount } = render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    expect(screen.getByText(/comprobando sesión/i)).toBeDefined();
    expect(await screen.findByRole('heading', { name: /iniciar sesión/i })).toBeDefined();
    expect(screen.queryByText(/comprobando sesión/i)).toBeNull();
    unmount();
    expect(unsubscribe).toHaveBeenCalledOnce();
  });
});
