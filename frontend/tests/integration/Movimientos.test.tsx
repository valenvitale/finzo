import type { ReactNode } from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import Movimientos from '../../src/pages/Movimientos';
import * as movimientoService from '../../src/services/movimiento.service';
import type { MovimientoResponseDTO } from '../../src/types/movimiento.types';

vi.mock('../../src/components/common/Modal', () => ({
    Modal: ({ abierto, titulo, children }: { abierto: boolean; titulo: string; children: ReactNode }) =>
        abierto ? <div role="dialog" aria-label={titulo}>{children}</div> : null,
}));

vi.mock('../../src/hooks/useCategorias', () => ({
    useCategorias: () => ({ categorias: [{ id: 'sueldo', nombre: 'Sueldo', tipo: 'INGRESO' }] }),
}));

vi.mock('../../src/hooks/useMediosPago', () => ({
    useMediosPago: () => ({ mediosPago: [] }),
}));

vi.mock('../../src/services/moneda.service', () => {
    const ars = { id: 'ars', codigo: 'ARS', nombre: 'Peso argentino', simbolo: '$' };
    const eur = { id: 'eur', codigo: 'EUR', nombre: 'Euro', simbolo: '€' };

    return {
        listarMonedasDisponibles: vi.fn().mockResolvedValue([ars, eur]),
        listarMonedasPerfil: vi.fn().mockResolvedValue([
            { ...ars, esPrincipal: true },
            { ...eur, esPrincipal: false },
        ]),
    };
});

vi.mock('../../src/services/movimiento.service', () => ({
    listarMovimientos: vi.fn(),
    crearMovimiento: vi.fn(),
    actualizarMovimiento: vi.fn(),
}));

it('registra un ingreso y muestra la moneda actualizada después de editarlo', async () => {
    const creado: MovimientoResponseDTO = {
        id: 'movimiento-1',
        perfilId: 'perfil-1',
        fecha: '2026-11-22T00:00:00.000Z',
        monto: 125.5,
        descripcion: 'Sueldo mensual',
        monedaId: 'ars',
        categoriaId: 'sueldo',
        medioPagoId: null,
        tipo: 'INGRESO',
        createdAt: '2026-11-22T00:00:00.000Z',
        updatedAt: '2026-11-22T00:00:00.000Z',
    };
    const editado = { ...creado, monedaId: 'eur' };
    vi.mocked(movimientoService.listarMovimientos)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([creado])
        .mockResolvedValue([editado]);
    vi.mocked(movimientoService.crearMovimiento).mockResolvedValue(creado);
    vi.mocked(movimientoService.actualizarMovimiento).mockResolvedValue(editado);

    render(<Movimientos />);
    const nuevo = await screen.findByRole('button', { name: '+ Nuevo Movimiento' });
    await waitFor(() => expect(nuevo).toHaveProperty('disabled', false));
    fireEvent.click(nuevo);

    const alta = within(screen.getByRole('dialog', { name: 'Nuevo Movimiento' }));
    fireEvent.change(alta.getByLabelText('Tipo'), { target: { value: 'INGRESO' } });
    fireEvent.change(alta.getByLabelText('Categoría'), { target: { value: 'sueldo' } });
    fireEvent.change(alta.getByLabelText('Descripción'), { target: { value: 'Sueldo mensual' } });
    fireEvent.change(alta.getByLabelText('Fecha'), { target: { value: '2026-11-22' } });
    fireEvent.change(alta.getByLabelText('Monto'), { target: { value: '125.50' } });
    fireEvent.change(alta.getByLabelText('Moneda'), { target: { value: 'ars' } });
    fireEvent.click(alta.getByRole('button', { name: 'Guardar' }));

    const botonEditar = await screen.findByRole('button', { name: 'Editar movimiento' });
    expect(movimientoService.crearMovimiento).toHaveBeenCalledExactlyOnceWith({
        fecha: '2026-11-22', monto: 125.5, descripcion: 'Sueldo mensual',
        monedaId: 'ars', categoriaId: 'sueldo', medioPagoId: null,
    });

    fireEvent.click(botonEditar);
    const edicion = within(screen.getByRole('dialog', { name: 'Editar Movimiento' }));
    const moneda = edicion.getByLabelText<HTMLSelectElement>('Moneda');
    expect(moneda.value).toBe('ars');
    fireEvent.change(moneda, { target: { value: 'eur' } });
    fireEvent.click(edicion.getByRole('button', { name: 'Guardar' }));

    expect(await screen.findByRole('cell', { name: /EUR|€/u })).toBeDefined();
    expect(movimientoService.actualizarMovimiento).toHaveBeenCalledExactlyOnceWith('movimiento-1', {
        monedaId: 'eur',
    });
});
