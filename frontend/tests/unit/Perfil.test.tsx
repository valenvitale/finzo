import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as monedaService from '../../src/services/moneda.service';
import * as perfilService from '../../src/services/perfil.service';
import Perfil from '../../src/pages/Perfil';
import { toast } from '../../src/components/common';
import { PageContainer } from '../../src/components/layout/PageContainer';

vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'perfil-1', user_metadata: { nombre: 'Nombre de registro' } },
    logout: vi.fn(),
  }),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock('../../src/services/perfil.service', () => ({
  actualizarPerfil: vi.fn(),
  obtenerPerfil: vi.fn(),
}));

vi.mock('../../src/services/moneda.service', () => ({
  asignarMonedaPerfil: vi.fn(),
  eliminarMonedaPerfil: vi.fn(),
  listarMonedasDisponibles: vi.fn(),
  listarMonedasPerfil: vi.fn(),
}));

vi.mock('../../src/components/medios-pago/GestionMediosPago', () => ({
  default: () => <div>Gestión de medios de pago</div>,
}));

const perfilInicial = {
  id: 'perfil-1',
  nombre: 'Máximo',
  apellido: 'Messina',
  foto_perfil: null,
  email: 'maximo@example.com',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

const monedasDisponibles = [
  { id: 'ars-id', nombre: 'Peso Argentino', codigo: 'ARS', simbolo: '$' },
  { id: 'eur-id', nombre: 'Euro', codigo: 'EUR', simbolo: '€' },
];

const monedasAsignadas = [
  { ...monedasDisponibles[0], esPrincipal: true },
];

function renderizarPerfil() {
  render(
    <MemoryRouter initialEntries={['/perfil']}>
      <Routes>
        <Route element={<PageContainer />}>
          <Route path="/perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('Perfil', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(perfilService.obtenerPerfil).mockResolvedValue(perfilInicial);
    vi.mocked(perfilService.actualizarPerfil).mockResolvedValue({
      ...perfilInicial,
      nombre: 'Max',
    });
    vi.mocked(monedaService.listarMonedasDisponibles).mockResolvedValue(
      monedasDisponibles
    );
    vi.mocked(monedaService.listarMonedasPerfil).mockResolvedValue(
      monedasAsignadas
    );
    vi.mocked(monedaService.asignarMonedaPerfil).mockResolvedValue({
      ...monedasDisponibles[1],
      esPrincipal: false,
    });
    vi.mocked(monedaService.eliminarMonedaPerfil).mockResolvedValue();
  });

  it('actualiza el encabezado al guardar el nombre y envía solo los campos modificados', async () => {
    renderizarPerfil();
    expect(await screen.findByRole('button', { name: 'Cuenta de Máximo' })).toBeDefined();

    const campoNombre = await screen.findByLabelText('Nombre');
    fireEvent.change(campoNombre, { target: { value: 'Max' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    await waitFor(() => {
      expect(perfilService.actualizarPerfil).toHaveBeenCalledWith({
        nombre: 'Max',
      });
    });
    expect(perfilService.actualizarPerfil).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole('button', { name: 'Cuenta de Max' })).toBeDefined();
    expect(perfilService.obtenerPerfil).toHaveBeenCalledTimes(1);
  });

  it('envía la contraseña actual al cambiar correo y contraseña', async () => {
    renderizarPerfil();
    fireEvent.change(await screen.findByLabelText('Correo electrónico'), {
      target: { value: 'nuevo@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña actual'), {
      target: { value: 'clave-anterior' },
    });
    fireEvent.change(screen.getByLabelText('Nueva contraseña'), {
      target: { value: 'clave-nueva-segura' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    await waitFor(() => {
      expect(perfilService.actualizarPerfil).toHaveBeenCalledWith({
        email: 'nuevo@example.com',
        currentPassword: 'clave-anterior',
        newPassword: 'clave-nueva-segura',
      });
    });
  });

  it('agrega una moneda seleccionada al perfil', async () => {
    renderizarPerfil();
    const selector = await screen.findByLabelText('Agregar moneda');
    fireEvent.change(selector, { target: { value: 'eur-id' } });
    fireEvent.click(screen.getByRole('button', { name: 'Agregar moneda' }));

    await waitFor(() => {
      expect(monedaService.asignarMonedaPerfil).toHaveBeenCalledWith({
        monedaId: 'eur-id',
      });
    });
    expect(monedaService.listarMonedasPerfil).toHaveBeenCalledTimes(2);
  });

  it('confirma el guardado y permite reintentar solo la carga si falló la recarga de monedas', async () => {
    vi.mocked(monedaService.listarMonedasPerfil)
      .mockResolvedValueOnce(monedasAsignadas)
      .mockRejectedValueOnce(new Error('Error de conexión'))
      .mockResolvedValueOnce([...monedasAsignadas, { ...monedasDisponibles[1], esPrincipal: false }]);

    renderizarPerfil();
    fireEvent.change(await screen.findByLabelText('Agregar moneda'), {
      target: { value: 'eur-id' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Agregar moneda' }));

    const reintentar = await screen.findByRole('button', { name: 'Reintentar carga de monedas' });
    expect(toast.success).toHaveBeenCalledWith('Moneda agregada a tu perfil.');
    expect(toast.error).not.toHaveBeenCalled();

    fireEvent.click(reintentar);

    expect(await screen.findByText('Euro')).toBeDefined();
    expect(monedaService.asignarMonedaPerfil).toHaveBeenCalledTimes(1);
  });

  it('permite definir como principal una moneda ya asignada', async () => {
    vi.mocked(monedaService.listarMonedasPerfil).mockResolvedValue([
      monedasAsignadas[0],
      { ...monedasDisponibles[1], esPrincipal: false },
    ]);
    renderizarPerfil();
    fireEvent.click(
      await screen.findByRole('button', { name: 'Definir como principal' })
    );

    await waitFor(() => {
      expect(monedaService.asignarMonedaPerfil).toHaveBeenCalledWith({
        monedaId: 'eur-id',
        esPrincipal: true,
      });
    });
  });
});
