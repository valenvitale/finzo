import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { FiltrosMovimiento } from '../../src/components/movimientos/FiltrosMovimiento';

it('oculta y limpia el medio de pago al filtrar por ingresos', () => {
    const cambiarFiltros = vi.fn();
    render(
        <FiltrosMovimiento
            filtros={{ tipo: 'GASTO', medioPagoId: 'efectivo' }}
            cambiarFiltros={cambiarFiltros}
            categorias={[]}
            mediosPago={[{
                id: 'efectivo',
                nombre: 'Efectivo',
                icono: 'cash',
                id_perfil: null,
                created_at: '',
                updated_at: '',
            }]}
            limpiarFiltros={vi.fn()}
        />
    );

    const tipo = screen.getByLabelText('Tipo de movimiento');
    expect(screen.getByLabelText<HTMLSelectElement>('Medio de pago').value).toBe('efectivo');

    fireEvent.change(tipo, { target: { value: 'INGRESO' } });
    expect(screen.queryByLabelText('Medio de pago')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar filtros' }));
    expect(cambiarFiltros).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ tipo: 'INGRESO', medioPagoId: undefined })
    );

    fireEvent.change(tipo, { target: { value: 'GASTO' } });
    expect(screen.getByLabelText<HTMLSelectElement>('Medio de pago').value).toBe('');
});
