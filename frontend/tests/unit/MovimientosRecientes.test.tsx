import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { MovimientosRecientes } from '../../src/components/dashboard/MovimientosRecientes';
import type { MovimientoResponseDTO } from '../../src/types/movimiento.types';

describe('MovimientosRecientes', () => {
  const movimientoBase: MovimientoResponseDTO = {
    id: 'movimiento-1',
    descripcion: 'Compra',
    monto: 50000,
    fecha: '2026-11-23T12:00:00Z',
    tipo: 'GASTO',
    perfilId: 'perfil-1',
    monedaId: 'moneda-ars',
    categoriaId: 'categoria-1',
    medioPagoId: 'medio-1',
    createdAt: '2026-11-23T12:00:00Z',
    updatedAt: '2026-11-23T12:00:00Z',
  };

  it('muestra cada movimiento con el símbolo de su moneda', () => {
    const movimientos: MovimientoResponseDTO[] = [
      {
        ...movimientoBase,
        descripcion: 'Compra en pesos',
      },
      {
        ...movimientoBase,
        id: 'movimiento-2',
        descripcion: 'Compra en dólares',
        monedaId: 'moneda-usd',
      },
      {
        ...movimientoBase,
        id: 'movimiento-3',
        descripcion: 'Compra en euros',
        monedaId: 'moneda-eur',
      },
    ];

    const codigosMoneda = new Map([
      ['moneda-ars', 'ARS'],
      ['moneda-usd', 'USD'],
      ['moneda-eur', 'EUR'],
    ]);

    render(
      <MemoryRouter>
        <MovimientosRecientes
          movimientos={movimientos}
          codigosMoneda={codigosMoneda}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/^-\s*\$\s*50\.000,00$/)
    ).toBeTruthy();

    expect(
      screen.getByText(/^-\s*US\$\s*50\.000,00$/)
    ).toBeTruthy();

    expect(
      screen.getByText(/^-\s*EUR\s*50\.000,00$/)
    ).toBeTruthy();
  });

  it('no muestra pesos argentinos si desconoce la moneda', () => {
    render(
      <MemoryRouter>
        <MovimientosRecientes
          movimientos={[movimientoBase]}
          codigosMoneda={new Map()}
        />
      </MemoryRouter>
    );

    expect(screen.queryByText(/\$/)).toBeNull();
  });
});