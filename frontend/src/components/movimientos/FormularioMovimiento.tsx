import { Boton, InputTexto, Modal, Selector, MensajeError } from '../common';
import { useState, type SubmitEvent } from 'react';
import type { CategoriaResponseDTO } from '../../types/categoria.types';
import type { MedioPagoResponseDTO } from '../../types/medio-pago.types';
import type { CrearMovimientoDTO, TipoMovimiento, MovimientoResponseDTO } from '../../types/movimiento.types';
import type { MonedaResponseDTO } from '../../types/moneda.types';

interface FormularioMovimientoProps {
    abierto: boolean;
    movimiento?: MovimientoResponseDTO;
    onCerrar: () => void;
    categorias: CategoriaResponseDTO[];
    mediosPago: MedioPagoResponseDTO[];
    monedas: MonedaResponseDTO[];
    onGuardar: (datos: CrearMovimientoDTO) => Promise<void>;
}

export function FormularioMovimiento({
    abierto, movimiento, categorias, mediosPago, monedas, onCerrar, onGuardar,
}: FormularioMovimientoProps) {
    const [descripcion, setDescripcion] = useState(movimiento?.descripcion ?? '');
    const [monto, setMonto] = useState(movimiento ? String(movimiento.monto) : '');
    const [fecha, setFecha] = useState(movimiento?.fecha.slice(0, 10) ?? '');
    const [categoriaId, setCategoriaId] = useState(movimiento?.categoriaId ?? '');
    const [medioPagoId, setMedioPagoId] = useState(movimiento?.medioPagoId ?? '');
    const [monedaId, setMonedaId] = useState(movimiento?.monedaId ?? '');
    const [tipo, setTipo] = useState<TipoMovimiento>(movimiento?.tipo ?? 'GASTO');
    const [error, setError] = useState('');
    const [guardando, setGuardando] = useState(false);
    const categoriasDisponibles = categorias.filter((categoria) => categoria.tipo === tipo);

    function cerrarFormulario() {
        if (!guardando) onCerrar();
    }

    async function manejarSubmit(evento: SubmitEvent<HTMLFormElement>) {
        evento.preventDefault();
        if (guardando) return;
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

        if (!monedaId) {
            setError('Seleccioná una moneda');
            return;
        }

        const datosMovimiento: CrearMovimientoDTO = {
            fecha,
            monto: montoNumerico,
            descripcion: descripcion.trim() || null,
            categoriaId,
            medioPagoId: tipo === 'GASTO' ? medioPagoId : null,
            monedaId,
        };

        setGuardando(true);
        try {
            await onGuardar(datosMovimiento);
        } catch {
            setError('No se pudo guardar el movimiento. Intentá de nuevo.');
        } finally {
            setGuardando(false);
        }
    }
    
    return (
        <Modal abierto={abierto} onCerrar={cerrarFormulario} titulo={movimiento ? 'Editar Movimiento' : 'Nuevo Movimiento'}>
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
                <Selector
                    label="Moneda"
                    value={monedaId}
                    onChange={(evento) => setMonedaId(evento.target.value)}
                    required
                >
                    <option value="" disabled>Seleccionar moneda</option>

                    {movimiento && !monedas.some((moneda) => moneda.id === movimiento.monedaId) && (
                        <option value={movimiento.monedaId}>Moneda actual</option>
                    )}

                    {monedas.map((moneda) => (
                        <option key={moneda.id} value={moneda.id}>
                            {moneda.codigo} — {moneda.nombre}
                        </option>
                    ))}
                </Selector>
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
                    <Boton type="button" variante="secondary" onClick={cerrarFormulario} disabled={guardando}>
                        Cancelar
                    </Boton>
                    <Boton type="submit" cargando={guardando}>
                        Guardar
                    </Boton>
                </div>
            </form>
        </Modal>
    )
}
