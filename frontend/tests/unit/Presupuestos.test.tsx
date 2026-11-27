import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { toast } from 'sonner';
import Presupuestos from '../../src/pages/Presupuestos';
import * as presupuestoService from '../../src/services/presupuesto.service';
import type { ResumenPresupuestosDTO } from '../../src/types/presupuesto.types';

vi.mock('../../src/hooks/useCategorias', () => ({
  useCategorias: () => ({ categoriasGasto: [], cargando: false, error: null }),
}));

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('../../src/services/presupuesto.service', () => ({
  listarPresupuestos: vi.fn(),
  guardarMetaAhorro: vi.fn(),
  crearPresupuesto: vi.fn(),
  actualizarPresupuesto: vi.fn(),
  eliminarPresupuesto: vi.fn(),
}));

const ahora = new Date();
const mes = ahora.getMonth() + 1;
const anio = ahora.getFullYear();
const resumen: ResumenPresupuestosDTO = {
  mes,
  anio,
  moneda: { id: 'moneda-1', codigo: 'ARS', simbolo: '$' },
  totalLimiteMensual: 10000,
  totalGastado: 2000,
  totalDisponible: 8000,
  porcentajeUsado: 20,
  presupuestos: [],
  metaAhorro: { monto: 5000, ahorroActual: 2000, porcentajeCumplido: 40 },
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(presupuestoService.listarPresupuestos).mockResolvedValue(resumen);
  vi.mocked(presupuestoService.guardarMetaAhorro).mockResolvedValue();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Presupuestos', () => {
  it('muestra el avance y guarda una meta para el período seleccionado', async () => {
    render(<Presupuestos />);
    expect(await screen.findByText(/40.0%/)).toBeDefined();
    fireEvent.change(screen.getByLabelText('Meta de ahorro mensual'), { target: { value: '8000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar meta' }));
    await waitFor(() => expect(presupuestoService.guardarMetaAhorro).toHaveBeenCalledWith('moneda-1', mes, anio, 8000));
  });

  it('confirma el guardado de la meta y permite reintentar solo la recarga', async () => {
    const resumenActualizado = {
      ...resumen,
      metaAhorro: { monto: 8000, ahorroActual: 2000, porcentajeCumplido: 25 },
    };
    vi.mocked(presupuestoService.listarPresupuestos)
      .mockResolvedValueOnce(resumen)
      .mockRejectedValueOnce(new Error('Error de conexión'))
      .mockResolvedValueOnce(resumenActualizado);

    render(<Presupuestos />);
    await screen.findByText(/40.0%/);
    fireEvent.change(screen.getByLabelText('Meta de ahorro mensual'), { target: { value: '8000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar meta' }));

    expect((await screen.findByRole('alert')).textContent).toContain('Error de conexión');
    expect(toast.success).toHaveBeenCalledWith('Meta de ahorro guardada.');

    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(await screen.findByText(/25.0%/)).toBeDefined();
    expect(presupuestoService.guardarMetaAhorro).toHaveBeenCalledTimes(1);
  });

  it('confirma el borrado aunque falle la recarga del resumen', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.mocked(presupuestoService.eliminarPresupuesto).mockResolvedValue();
    vi.mocked(presupuestoService.listarPresupuestos)
      .mockResolvedValueOnce({
        ...resumen,
        presupuestos: [
          {
            id: 'presupuesto-1',
            monedaId: 'moneda-1',
            categoriaId: 'categoria-1',
            categoriaNombre: 'Comida',
            categoriaColor: '#123456',
            limiteMensual: 10000,
            gastoActual: 2000,
            disponible: 8000,
            porcentajeUsado: 20,
            mes,
            anio,
            createdAt: ahora.toISOString(),
            updatedAt: ahora.toISOString(),
          },
        ],
      })
      .mockRejectedValueOnce(new Error('Error de conexión'))
      .mockResolvedValueOnce(resumen);

    render(<Presupuestos />);
    fireEvent.click(await screen.findByRole('button', { name: 'Eliminar presupuesto de Comida' }));

    expect((await screen.findByRole('alert')).textContent).toContain('Error de conexión');
    expect(toast.success).toHaveBeenCalledWith('Presupuesto eliminado.');
    expect(toast.error).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(await screen.findByText('Todavía no hay presupuestos')).toBeDefined();
    expect(presupuestoService.eliminarPresupuesto).toHaveBeenCalledExactlyOnceWith('presupuesto-1');
  });

  it('oculta el período anterior si falla la carga del nuevo período', async () => {
    vi.mocked(presupuestoService.listarPresupuestos)
      .mockResolvedValueOnce(resumen)
      .mockRejectedValueOnce(new Error('Error de conexión'));
    render(<Presupuestos />);
    expect(await screen.findByText(/40.0%/)).toBeDefined();

    fireEvent.change(screen.getByLabelText('Mes'), { target: { value: String(mes === 12 ? 11 : mes + 1) } });
    expect((await screen.findByRole('alert')).textContent).toContain('Error de conexión');
    expect(screen.queryByText(/40.0%/)).toBeNull();
    expect((screen.getByRole('button', { name: 'Nuevo presupuesto' }) as HTMLButtonElement).disabled).toBe(true);
  });
});
