import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as monedaService from '../../src/services/moneda.service';
import * as perfilService from '../../src/services/perfil.service';
import Perfil from '../../src/pages/Perfil';

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

  it('actualiza los datos personales enviando solo los campos modificados', async () => {
    render(<Perfil />);
    const campoNombre = await screen.findByLabelText('Nombre');
    fireEvent.change(campoNombre, { target: { value: 'Max' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    await waitFor(() => {
      expect(perfilService.actualizarPerfil).toHaveBeenCalledWith({
        nombre: 'Max',
      });
    });
    expect(perfilService.actualizarPerfil).toHaveBeenCalledTimes(1);
  });

  it('envía la contraseña actual al cambiar correo y contraseña', async () => {
    render(<Perfil />);
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
    render(<Perfil />);
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

  it('permite definir como principal una moneda ya asignada', async () => {
    vi.mocked(monedaService.listarMonedasPerfil).mockResolvedValue([
      monedasAsignadas[0],
      { ...monedasDisponibles[1], esPrincipal: false },
    ]);
    render(<Perfil />);
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
