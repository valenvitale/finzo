import type { ICategoriaRepository, CrearCategoriaDatos, ActualizarCategoriaDatos } from '../repositories/categoria.repository.ts';

import { ErrorDeConflicto, ErrorProhibido, ErrorNoEncontrado } from '../errors/errores.js';

export class CategoriaService {
    constructor(
        private categoriaRepository: ICategoriaRepository,
    ) {}

    async listar(idPerfil: string) {
        return this.categoriaRepository.listar(idPerfil);
    }

    async crear(idPerfil: string, datos: CrearCategoriaDatos) {
        const cantidad = await this.categoriaRepository.contarPersonalizadasPorUsuario(idPerfil);

        if (cantidad >= 8) {
            throw new ErrorDeConflicto(
                'Podés tener hasta 8 categorías personalizadas',
            );
        }

        return this.categoriaRepository.crear(idPerfil, datos);
    }

    async actualizar(idPerfil: string, id: string, datos: ActualizarCategoriaDatos){
        const categoria = await this.buscarCategoriaEditable(idPerfil, id);

        if (datos.tipo !== undefined && datos.tipo !== categoria.tipo){
            const cantidadMovimientos = await this.categoriaRepository.contarMovimientosAsociados(id);

            if (cantidadMovimientos > 0) {
                throw new ErrorDeConflicto(
                    'No podés cambiar el tipo de una categoría con movimientos asociados',
                );
            }
        }

        return this.categoriaRepository.actualizar(id, datos);
    }

    async eliminar(idPerfil: string, id: string): Promise<void> {
        await this.buscarCategoriaEditable(idPerfil, id);

        const cantidadMovimientos = await this.categoriaRepository.contarMovimientosAsociados(id);

        if (cantidadMovimientos > 0) {
            throw new ErrorDeConflicto(
                'No podés eliminar una categoría con movimientos asociados',
            );
        }

        await this.categoriaRepository.eliminar(id);
    }

    private async buscarCategoriaEditable(idPerfil: string, id: string){
        const categoria = await this.categoriaRepository.buscarPorId(id);

        if (!categoria) {
            throw new ErrorNoEncontrado('La categoría no existe');
        }

        if (categoria.id_perfil === null) {
            throw new ErrorProhibido(
                'No podés modificar ni eliminar categorías predeterminadas',
            );
        }

        if (categoria.id_perfil !== idPerfil) {
            throw new ErrorProhibido(
                'No podés modificar ni eliminar categorías de otro perfil',
            );
        }

        return categoria;
    }
}