import { ErrorNoEncontrado } from '../utils/errores.js';
import { AsignarMonedaDTO, MonedaPerfilResponseDTO, MonedaResponseDTO } from '../types/moneda.types.js';
import { IMonedaRepository } from '../repositories/moneda.repository.js';

export class MonedaService {
  constructor(private readonly monedaRepository: IMonedaRepository) {}

  listarDisponibles(): Promise<MonedaResponseDTO[]> {
    return this.monedaRepository.listarDisponibles();
  }

  async listarPorPerfil(perfilId: string): Promise<MonedaPerfilResponseDTO[]> {
    if (!(await this.monedaRepository.existePerfil(perfilId))) {
      throw new ErrorNoEncontrado('No se encontró el perfil del usuario');
    }
    return this.monedaRepository.listarPorPerfil(perfilId);
  }

  async asignar(perfilId: string, datos: AsignarMonedaDTO): Promise<MonedaPerfilResponseDTO> {
    if (!(await this.monedaRepository.existePerfil(perfilId))) {
      throw new ErrorNoEncontrado('No se encontró el perfil del usuario');
    }
    if (!(await this.monedaRepository.obtenerDisponible(datos.monedaId))) {
      throw new ErrorNoEncontrado('No se encontró la moneda solicitada');
    }
    return this.monedaRepository.asignar(perfilId, datos.monedaId, datos.esPrincipal);
  }

  async eliminar(perfilId: string, monedaId: string): Promise<void> {
    if (!(await this.monedaRepository.existePerfil(perfilId))) {
      throw new ErrorNoEncontrado('No se encontró el perfil del usuario');
    }
    if (!(await this.monedaRepository.eliminarAsignacion(perfilId, monedaId))) {
      throw new ErrorNoEncontrado('La moneda no está asignada al perfil');
    }
  }
}
