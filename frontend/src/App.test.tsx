import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';

describe('Frontend App', () => {
  it('debe renderizar el título de Finzo', () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    expect(screen.getByText(/comprobando sesión/i)).toBeDefined();
  });
});
