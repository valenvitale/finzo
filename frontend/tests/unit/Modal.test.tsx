import { useState } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { Modal } from '../../src/components/common/Modal';

const showModalOriginal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal');
const closeOriginal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close');

beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.open = true;
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.open = false;
    },
  });
});

afterEach(cleanup);

afterAll(() => {
  if (showModalOriginal) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', showModalOriginal);
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
  if (closeOriginal) Object.defineProperty(HTMLDialogElement.prototype, 'close', closeOriginal);
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'close');
});

function ModalControlado({ onCerrar }: { onCerrar: () => void }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setAbierto(true)}>
        Abrir
      </button>
      <Modal
        abierto={abierto}
        titulo="Editar perfil"
        onCerrar={() => {
          onCerrar();
          setAbierto(false);
        }}
      >
        <p>Contenido del modal</p>
      </Modal>
    </>
  );
}

describe('Modal', () => {
  it('abre y cierra con el botón de cerrar', () => {
    const onCerrar = vi.fn();
    render(<ModalControlado onCerrar={onCerrar} />);
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    expect(screen.getByRole('dialog', { name: 'Editar perfil' })).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onCerrar).toHaveBeenCalledOnce();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('cierra ante el evento cancel que genera Escape', () => {
    const onCerrar = vi.fn();
    render(<ModalControlado onCerrar={onCerrar} />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { bubbles: false, cancelable: true }));
    expect(onCerrar).toHaveBeenCalledOnce();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('cierra con el backdrop pero no al hacer click en el contenido', () => {
    const onCerrar = vi.fn();
    render(<ModalControlado onCerrar={onCerrar} />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    fireEvent.click(screen.getByText('Contenido del modal'));
    expect(onCerrar).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('dialog'));
    expect(onCerrar).toHaveBeenCalledOnce();
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
