import type { ReactNode } from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router-dom';
import { expect, it, vi } from 'vitest';
import Movimientos from '../../src/pages/Movimientos';
import * as movimientoService from '../../src/services/movimiento.service';
import type { MovimientoResponseDTO } from '../../src/types/movimiento.types';

vi.mock('../../src/components/common/Modal', () => ({
    Modal: ({ abierto, titulo, children, onCerrar }: {
        abierto: boolean;
        titulo: string;
        children: ReactNode;
        onCerrar: () => void;
    }) =>
        abierto ? (
            <div role="dialog" aria-label={titulo}>
                <button type="button" onClick={onCerrar}>Cerrar</button>
                {children}
            </div>
        ) : null,
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
    eliminarMovimiento: vi.fn(),
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

    render(<MemoryRouter><Movimientos /></MemoryRouter>);
    const nuevo = await screen.findByRole('button', { name: 'Nuevo movimiento' });
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

it('abre el alta desde el Dashboard y limpia el parámetro al cerrar', async () => {
    vi.mocked(movimientoService.listarMovimientos).mockResolvedValue([]);
    const router = createMemoryRouter(
        [{ path: '/movimientos', element: <Movimientos /> }],
        { initialEntries: ['/movimientos?nuevo=1'] },
    );

    render(<RouterProvider router={router} />);

    const formulario = await screen.findByRole('dialog', { name: 'Nuevo Movimiento' });
    fireEvent.click(within(formulario).getByRole('button', { name: 'Cerrar' }));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(router.state.location.search).toBe('');
});

function movimientosDePrueba(total: number): MovimientoResponseDTO[] {
    return Array.from({ length: total }, (_, indice) => ({
        id: `movimiento-${indice + 1}`,
        perfilId: 'perfil-1',
        fecha: '2026-11-22T00:00:00.000Z',
        monto: 125.5,
        descripcion: `Movimiento ${indice + 1}`,
        monedaId: 'ars',
        categoriaId: 'sueldo',
        medioPagoId: null,
        tipo: 'INGRESO',
        createdAt: '2026-11-22T00:00:00.000Z',
        updatedAt: '2026-11-22T00:00:00.000Z',
    }));
}

it('pagina los resultados y vuelve a la primera página al aplicar o limpiar filtros', async () => {
    const movimientos = movimientosDePrueba(24);
    vi.mocked(movimientoService.listarMovimientos)
        .mockResolvedValueOnce(movimientos)
        .mockResolvedValueOnce(movimientos.slice(0, 14))
        .mockResolvedValueOnce(movimientos);

    render(<MemoryRouter><Movimientos /></MemoryRouter>);
    await screen.findByText('Mostrando 1–10 de 24');
    expect(screen.getByRole('button', { name: 'Página anterior' })).toHaveProperty('disabled', true);
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(11);

    fireEvent.click(screen.getByRole('button', { name: 'Página 3'}));
    expect(screen.getByText('Mostrando 21–24 de 24')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Página siguiente' })).toHaveProperty('disabled', true);
    expect(screen.queryByRole('cell', { name: 'Movimiento 1' })).toBeNull();

    fireEvent.change(screen.getByLabelText('Tipo de movimiento'), { target: { value: 'INGRESO' } });
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar filtros' }));
    expect(await screen.findByText('Mostrando 1–10 de 14')).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: 'Página siguiente' }));
    expect(screen.getByText('Mostrando 11–14 de 14')).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar' }));
    expect(await screen.findByText('Mostrando 1–10 de 24')).toBeDefined();
});

it('vuelve a la última página disponible al eliminar el único movimiento de la página', async () => {
    const confirmar = vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.mocked(movimientoService.listarMovimientos).mockResolvedValue(movimientosDePrueba(11));
    vi.mocked(movimientoService.eliminarMovimiento).mockResolvedValue();

    try {
        render(<MemoryRouter><Movimientos /></MemoryRouter>);
        fireEvent.click(await screen.findByRole('button', { name: 'Página siguiente' }));
        expect(screen.getByText('Mostrando 11 de 11')).toBeDefined();

        fireEvent.click(screen.getByRole('button', { name: 'Eliminar movimiento' }));
        expect(await screen.findByText('Mostrando 1–10 de 10')).toBeDefined();
        expect(movimientoService.eliminarMovimiento).toHaveBeenLastCalledWith('movimiento-11');
        expect(screen.queryByRole('navigation', { name: 'Paginación' })).toBeNull();
    } finally {
        confirmar.mockRestore();
    }
});
