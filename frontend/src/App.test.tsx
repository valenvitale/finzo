import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('Frontend App', () => {
  it('debe renderizar el título de Finzo', () => {
    render(<App />);
    expect(screen.getByText('Finzo')).toBeDefined();
  });
});
