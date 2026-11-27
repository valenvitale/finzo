import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { EstadoVacio } from '../../src/components/common/EstadoVacio';

afterEach(cleanup);

describe('EstadoVacio', () => {
  it('muestra el título, descripción y acción personalizados', () => {
    render(
      <EstadoVacio
        titulo="Sin movimientos"
        descripcion="Registrá tu primer movimiento."
        accion={<button type="button">Agregar</button>}
      />
    );
    expect(screen.getByRole('heading', { name: 'Sin movimientos' })).toBeDefined();
    expect(screen.getByText('Registrá tu primer movimiento.')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Agregar' })).toBeDefined();
  });
});
