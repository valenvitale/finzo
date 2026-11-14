import type { IMedioPagoRepository } from '../repositories/medio-pago.repository.js';
import type { MedioPagoResponseDTO, IMedioPagoService, CrearMedioPagoDTO, ActualizarMedioPagoDTO } from '../types/medio-pago.types.js';
import { ErrorNoEncontrado, ErrorProhibido } from '../errors/errores.js';
import { error } from 'node:console';
import { prisma } from '../config/prisma.js';

export class MedioPagoService implements IMedioPagoService{
  constructor(private readonly medioPagoRepository: IMedioPagoRepository) {}

  private async validarPertenenciaUsuario(id: string, idPerfil: string){
    const medio = await this.medioPagoRepository.obtenerPorId(id);
    
    if(!medio){
      throw new ErrorNoEncontrado('El medio de pago no existe.');
    }else if(medio.id_perfil === null){
      throw new ErrorProhibido('No se pueden modificar medios de pago del sistema.');
    }else if(medio.id_perfil !== idPerfil){
      throw new ErrorProhibido('No tienes permiso para modificar este medio de pago.');
    }

    return medio;
  }

  async listarPorPerfil(idPerfil: string): Promise<MedioPagoResponseDTO[]> {
    const medios = await this.medioPagoRepository.listarPorPerfil(idPerfil);
    return medios.map((medio) => ({
      id: medio.id,
      nombre: medio.nombre,
      icono: medio.icono,
      id_perfil: medio.id_perfil,
      created_at: medio.created_at.toISOString(),
      updated_at: medio.updated_at.toISOString(),
    }));
  }

  async crear(idPerfil: string, datos: CrearMedioPagoDTO): Promise<MedioPagoResponseDTO> {
    const medio = await this.medioPagoRepository.crear(idPerfil, datos);
    return{
      id: medio.id,
      nombre: medio.nombre,
      icono: medio.icono,
      id_perfil: medio.id_perfil,
      created_at: medio.created_at.toISOString(),
      updated_at: medio.updated_at.toISOString()
    }
  }

  async actualizar(id: string, idPerfil: string, datos: ActualizarMedioPagoDTO): Promise<MedioPagoResponseDTO> {
    await this.validarPertenenciaUsuario(id, idPerfil);
    const medio = await this.medioPagoRepository.actualizar(id, datos);
    return{
      id: medio.id,
      nombre: medio.nombre,
      icono: medio.icono,
      id_perfil: medio.id_perfil,
      created_at: medio.created_at.toISOString(),
      updated_at: medio.updated_at.toISOString()
    }
  }

  async eliminar(id: string, idPerfil: string): Promise<void>{
    await this.validarPertenenciaUsuario(id, idPerfil);
    await this.medioPagoRepository.eliminar(id);
  }
}
