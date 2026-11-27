import { useState } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { InputTexto } from '../../src/components/common/InputTexto';

afterEach(cleanup);

describe('InputTexto', () => {
  it('asocia el label y actualiza el valor al escribir', () => {
    function Formulario() {
      const [valor, setValor] = useState('Ana');
      return <InputTexto label="Nombre" value={valor} onChange={(evento) => setValor(evento.target.value)} />;
    }

    render(<Formulario />);
    const input = screen.getByLabelText('Nombre') as HTMLInputElement;
    expect(input.value).toBe('Ana');
    fireEvent.change(input, { target: { value: 'María' } });
    expect(input.value).toBe('María');
  });

  it('vincula el mensaje de error y la ayuda al campo', () => {
    render(<InputTexto label="Correo" textoAyuda="Usá tu correo" error="Correo inválido" />);
    const input = screen.getByLabelText('Correo');
    const error = screen.getByRole('alert');
    const ayuda = screen.getByText('Usá tu correo');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(error.textContent).toBe('Correo inválido');
    expect(input.getAttribute('aria-describedby')?.split(' ')).toEqual([ayuda.id, error.id]);
  });
});
