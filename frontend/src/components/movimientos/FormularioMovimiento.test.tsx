import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { FormularioMovimiento } from './FormularioMovimiento';
import type { CategoriaResponseDTO } from '../../types/categoria.types';

afterEach(cleanup);

describe('FormularioMovimiento', () => {
  it('exige medio para gastos, lo oculta para ingresos y limpia la selección al cambiar de tipo', () => {
    const onGuardar = vi.fn().mockResolvedValue(undefined);
    const categorias: CategoriaResponseDTO[] = [
      { id: 'categoria-gasto', nombre: 'Alimentos', tipo: 'GASTO', color: '#000000', icono: 'tag', perfilId: null, createdAt: '', updatedAt: '' },
      { id: 'categoria-ingreso', nombre: 'Sueldo', tipo: 'INGRESO', color: '#000000', icono: 'tag', perfilId: null, createdAt: '', updatedAt: '' },
    ];
    render(
      <FormularioMovimiento
        abierto={false}
        onCerrar={() => {}}
        onGuardar={onGuardar}
        categorias={categorias}
        mediosPago={[{ id: 'efectivo', nombre: 'Efectivo', icono: 'cash', id_perfil: null, created_at: '', updated_at: '' }]}
      />
    );

    const medio = screen.getByLabelText<HTMLSelectElement>('Medio de pago');
    expect(medio.required).toBe(true);
    fireEvent.change(medio, { target: { value: 'efectivo' } });
    fireEvent.change(screen.getByLabelText('Categoría'), { target: { value: 'categoria-gasto' } });

    fireEvent.change(screen.getByLabelText('Tipo'), { target: { value: 'INGRESO' } });
    expect(screen.queryByLabelText('Medio de pago')).toBeNull();
    expect(screen.getByLabelText<HTMLSelectElement>('Categoría').value).toBe('');
    expect(screen.queryByText('Alimentos')).toBeNull();
    expect(screen.getByText('Sueldo')).toBeDefined();

    fireEvent.change(screen.getByLabelText('Monto'), { target: { value: '125.50' } });
    fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: '2026-11-22' } });
    fireEvent.change(screen.getByLabelText('Categoría'), { target: { value: 'categoria-ingreso' } });
    fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: '  Sueldo mensual  ' } });
    fireEvent.submit(screen.getByLabelText('Monto').closest('form')!);
    expect(onGuardar).toHaveBeenCalledExactlyOnceWith({
      fecha: '2026-11-22', monto: 125.5, descripcion: 'Sueldo mensual',
      categoriaId: 'categoria-ingreso', medioPagoId: null,
    });

    fireEvent.change(screen.getByLabelText('Tipo'), { target: { value: 'GASTO' } });
    expect(screen.getByLabelText<HTMLSelectElement>('Medio de pago').value).toBe('');
  });
});
