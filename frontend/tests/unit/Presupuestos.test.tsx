import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

afterEach(cleanup);

describe('Presupuestos', () => {
  it('muestra el avance y guarda una meta para el período seleccionado', async () => {
    render(<Presupuestos />);
    expect(await screen.findByText(/40.0%/)).toBeDefined();
    fireEvent.change(screen.getByLabelText('Meta de ahorro mensual'), { target: { value: '8000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar meta' }));
    await waitFor(() => expect(presupuestoService.guardarMetaAhorro).toHaveBeenCalledWith('moneda-1', mes, anio, 8000));
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
