import { describe, expect, it, vi } from 'vitest';
import { Moneda } from '../../src/models/moneda.model.js';
import { Perfil } from '../../src/models/perfil.model.js';
import { IMonedaRepository } from '../../src/repositories/moneda.repository.js';
import { IPerfilRepository } from '../../src/repositories/perfil.repository.js';
import { IPerfilAuthService } from '../../src/services/perfil-auth.service.js';
import { MonedaService } from '../../src/services/moneda.service.js';
import { PerfilService } from '../../src/services/perfil.service.js';
import { ErrorNoEncontrado } from '../../src/errors/errores.js';
import { MonedaPerfilResponseDTO, MonedaResponseDTO } from '../../src/types/moneda.types.js';

const perfil = new Perfil({
  id: 'user-id',
  nombre: 'Máximo',
  apellido: 'Messina',
  fotoPerfil: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-02T00:00:00.000Z'),
});

describe('PerfilService', () => {
  it('obtiene el perfil asociado al correo autenticado', async () => {
    const repository: IPerfilRepository = {
      obtenerPorId: vi.fn().mockResolvedValue(perfil),
      actualizar: vi.fn(),
    };
    const authService: IPerfilAuthService = { actualizarCredenciales: vi.fn() };
    const service = new PerfilService(repository, authService);

    await expect(service.obtenerPerfil('user-id', 'maximo@example.com')).resolves.toEqual({
      id: 'user-id',
      nombre: 'Máximo',
      apellido: 'Messina',
      foto_perfil: null,
      email: 'maximo@example.com',
      created_at: perfil.createdAt,
      updated_at: perfil.updatedAt,
    });
  });

  it('actualiza credenciales solo después de verificar la contraseña actual', async () => {
    const actualizado = new Perfil({ ...perfil, nombre: 'Max' });
    const repository: IPerfilRepository = {
      obtenerPorId: vi.fn().mockResolvedValue(perfil),
      actualizar: vi.fn().mockResolvedValue(actualizado),
    };
    const actualizarCredenciales = vi.fn().mockResolvedValue('nuevo@example.com');
    const service = new PerfilService(repository, { actualizarCredenciales });

    await expect(
      service.actualizarPerfil('user-id', 'maximo@example.com', {
        nombre: 'Max',
        email: 'nuevo@example.com',
        currentPassword: 'actual',
      })
    ).resolves.toMatchObject({ nombre: 'Max', email: 'nuevo@example.com' });

    expect(actualizarCredenciales).toHaveBeenCalledWith('user-id', 'maximo@example.com', 'actual', {
      email: 'nuevo@example.com',
      newPassword: undefined,
    });
    expect(repository.actualizar).toHaveBeenCalledWith('user-id', {
      nombre: 'Max',
      apellido: undefined,
      foto_perfil: undefined,
    });
  });

  it('responde no encontrado cuando el perfil no existe', async () => {
    const repository: IPerfilRepository = {
      obtenerPorId: vi.fn().mockResolvedValue(null),
      actualizar: vi.fn(),
    };
    const service = new PerfilService(repository, { actualizarCredenciales: vi.fn() });

    await expect(service.obtenerPerfil('missing', 'email@example.com')).rejects.toBeInstanceOf(ErrorNoEncontrado);
  });
});

describe('MonedaService', () => {
  const catalogo: MonedaResponseDTO[] = [{ id: 'currency-id', nombre: 'Peso argentino', codigo: 'ARS', simbolo: '$' }];
  const asignada: MonedaPerfilResponseDTO = { ...catalogo[0], esPrincipal: true };

  function crearRepository(overrides: Partial<IMonedaRepository> = {}): IMonedaRepository {
    return {
      listarDisponibles: vi.fn().mockResolvedValue(catalogo),
      obtenerDisponible: vi.fn().mockResolvedValue(new Moneda(catalogo[0])),
      existePerfil: vi.fn().mockResolvedValue(true),
      listarPorPerfil: vi.fn().mockResolvedValue([asignada]),
      asignar: vi.fn().mockResolvedValue(asignada),
      eliminarAsignacion: vi.fn().mockResolvedValue(true),
      ...overrides,
    };
  }

  it('lista las monedas disponibles', async () => {
    const service = new MonedaService(crearRepository());

    await expect(service.listarDisponibles()).resolves.toEqual(catalogo);
  });

  it('valida perfil y moneda antes de asignar', async () => {
    const repository = crearRepository();
    const service = new MonedaService(repository);

    await expect(service.asignar('user-id', { monedaId: 'currency-id' })).resolves.toEqual(asignada);
    expect(repository.asignar).toHaveBeenCalledWith('user-id', 'currency-id', undefined);

    const missingCurrency = crearRepository({ obtenerDisponible: vi.fn().mockResolvedValue(null) });
    await expect(new MonedaService(missingCurrency).asignar('user-id', { monedaId: 'missing' })).rejects.toBeInstanceOf(
      ErrorNoEncontrado
    );
    expect(missingCurrency.asignar).not.toHaveBeenCalled();
  });

  it('notifica si se intenta eliminar una moneda no asignada', async () => {
    const repository = crearRepository({ eliminarAsignacion: vi.fn().mockResolvedValue(false) });
    const service = new MonedaService(repository);

    await expect(service.eliminar('user-id', 'currency-id')).rejects.toBeInstanceOf(ErrorNoEncontrado);
  });
});
