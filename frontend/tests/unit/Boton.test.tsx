import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Boton } from '../../src/components/common/Boton';

afterEach(cleanup);

describe('Boton', () => {
  it.each([
    ['primary', 'bg-naranja'],
    ['secondary', 'border-slate-300'],
    ['danger', 'bg-gasto'],
    ['ghost', 'bg-transparent'],
  ] as const)('aplica la variante %s', (variante, clase) => {
    render(<Boton variante={variante}>Guardar</Boton>);
    expect(screen.getByRole('button', { name: 'Guardar' }).classList.contains(clase)).toBe(true);
  });

  it('ejecuta el click y no lo ejecuta cuando está deshabilitado', () => {
    const onClick = vi.fn();
    const { rerender } = render(<Boton onClick={onClick}>Guardar</Boton>);
    const boton = screen.getByRole('button', { name: 'Guardar' }) as HTMLButtonElement;
    fireEvent.click(boton);
    expect(onClick).toHaveBeenCalledOnce();

    rerender(
      <Boton onClick={onClick} disabled>
        Guardar
      </Boton>
    );
    expect(boton.disabled).toBe(true);
    fireEvent.click(boton);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('muestra el spinner y bloquea la interacción mientras carga', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Boton onClick={onClick} cargando>
        Guardar
      </Boton>
    );
    const boton = screen.getByRole('button', { name: /guardar/i }) as HTMLButtonElement;
    expect(boton.disabled).toBe(true);
    expect(boton.getAttribute('aria-busy')).toBe('true');
    expect(screen.getByText('Cargando')).toBeDefined();
    expect(container.querySelector('svg.animate-spin')).not.toBeNull();
    fireEvent.click(boton);
    expect(onClick).not.toHaveBeenCalled();
  });
});
