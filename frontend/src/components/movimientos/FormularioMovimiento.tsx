import { Boton, InputTexto, Modal, Selector, MensajeError } from '../common';
import { useState, type SubmitEvent } from 'react';
import type { CategoriaResponseDTO } from '../../types/categoria.types';
import type { MedioPagoResponseDTO } from '../../types/medio-pago.types';
import type { CrearMovimientoDTO, TipoMovimiento } from '../../types/movimiento.types';

interface FormularioMovimientoProps {
    abierto: boolean;
    onCerrar: () => void;
    categorias: CategoriaResponseDTO[];
    mediosPago: MedioPagoResponseDTO[];
    onGuardar: (datos: Omit<CrearMovimientoDTO, 'monedaId'>) => Promise<void>;
}

export function FormularioMovimiento({abierto, categorias, mediosPago, onCerrar, onGuardar}: FormularioMovimientoProps) {
    const [descripcion, setDescripcion] = useState('');
    const [monto, setMonto] = useState('');
    const [fecha, setFecha] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [medioPagoId, setMedioPagoId] = useState('');
    const [tipo, setTipo] = useState<TipoMovimiento>('GASTO');
    const [error, setError] = useState('');
    const categoriasDisponibles = categorias.filter((categoria) => categoria.tipo === tipo);

    async function manejarSubmit(evento: SubmitEvent<HTMLFormElement>){
        evento.preventDefault();
        setError('');

        const montoNumerico = Number(monto);

        if (!Number.isFinite(montoNumerico) || montoNumerico <= 0) {
            setError('El monto debe ser un número mayor a cero');
            return;
        }
        if (!fecha || !categoriaId) {
            setError('Seleccioná una fecha y una categoría');
            return;
        }

        if (tipo === 'GASTO' && !medioPagoId) {
            setError('Seleccioná un medio de pago');
            return;
        }

        const datosMovimiento = {
            fecha,
            monto: montoNumerico,
            descripcion: descripcion.trim() || null,
            categoriaId,
            medioPagoId: tipo === 'GASTO' ? medioPagoId : null,
        };

        await onGuardar(datosMovimiento);
    }
    
    return (
        <Modal abierto={abierto} onCerrar={onCerrar} titulo="Nuevo movimiento">
            <form className="space-y-4" onSubmit={manejarSubmit}>
                <InputTexto
                    label="Descripción"
                    type="text"
                    value={descripcion}
                    maxLength={100}
                    onChange={(evento) => setDescripcion(evento.target.value)}
                />
                <InputTexto
                    label="Monto"
                    type="number"
                    value={monto}
                    step="0.01"
                    onChange={(evento) => setMonto(evento.target.value)}
                    required
                />
                <InputTexto
                    label="Fecha"
                    type="date"
                    value={fecha}
                    onChange={(evento) => setFecha(evento.target.value)}
                    required
                />
                <Selector 
                    label="Tipo" 
                    value={tipo} 
                    onChange={ (evento) => { 
                        const valor = evento.target.value;
                        if (valor==="GASTO" || valor==="INGRESO") {
                            setTipo(valor);
                            setCategoriaId(''); // Reiniciar la categoría al cambiar el tipo
                            setMedioPagoId('');
                        }
                     }
                    } 
                    required
                >
                    <option value="GASTO">Gasto</option>
                    <option value="INGRESO">Ingreso</option>
                </Selector>
                <Selector label="Categoría" value={categoriaId} onChange={(evento) => setCategoriaId(evento.target.value)} required>
                    <option value="" disabled hidden>Seleccionar categoría</option>
                    {categoriasDisponibles.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                            {categoria.nombre}
                        </option>
                    ))}
                </Selector>
                {tipo === 'GASTO' && (
                    <Selector
                        label="Medio de pago"
                        value={medioPagoId}
                        onChange={(evento) => setMedioPagoId(evento.target.value)}
                        required
                    >
                        <option value="" disabled hidden>Seleccionar medio de pago</option>
                        {mediosPago.map((medio) => (
                            <option key={medio.id} value={medio.id}>{medio.nombre}</option>
                        ))}
                    </Selector>
                )}
                {error && <MensajeError mensaje={error} />}
                <div className="flex justify-end gap-3 pt-2">
                    <Boton type="button" variante="secondary" onClick={onCerrar}>
                        Cancelar
                    </Boton>
                    <Boton type="submit">
                        Guardar
                    </Boton>
                </div>
            </form>
        </Modal>
    )
}
