import { Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import {
  Boton,
  Cargando,
  EstadoVacio,
  InputTexto,
  MensajeError,
  Modal,
  Selector,
  Tarjeta,
  toast,
} from '../components/common';
import { TablaMovimientos } from '../components/movimientos/TablaMovimientos';
import type { MovimientoResponseDTO } from '../types/movimiento.types';

const movimientosSimulados: MovimientoResponseDTO[] = [
  {
    id: '1',
    monto: 15500,
    tipo: 'GASTO',
    fecha: '2026-10-24T18:00:00.000Z',
    descripcion: 'Supermercado Coto',
    perfilId: 'perfil-1',
    monedaId: 'ARS',
    categoriaId: 'cat-comida',
    medioPagoId: 'mp-debito',
    createdAt: '2026-10-24T18:00:00.000Z',
    updatedAt: '2026-10-24T18:00:00.000Z',
  },
  {
    id: '2',
    monto: 250000,
    tipo: 'INGRESO',
    fecha: '2026-10-25T10:00:00.000Z',
    descripcion: 'Sueldo Desarrollo Software',
    perfilId: 'perfil-1',
    monedaId: 'ARS',
    categoriaId: 'cat-sueldo',
    medioPagoId: 'mp-transferencia',
    createdAt: '2026-10-25T10:00:00.000Z',
    updatedAt: '2026-10-25T10:00:00.000Z',
  },
];

export default function TestPage() {
  // Estados para probar Boton
  const [botonSimulandoCarga, setBotonSimulandoCarga] = useState(false);
  const [contadorClicks, setContadorClicks] = useState(0);

  // Estados para probar InputTexto
  const [inputValor, setInputValor] = useState('');
  const [inputConError, setInputConError] = useState('');

  // Estados para probar Selector
  const [monedaSeleccionada, setMonedaSeleccionada] = useState('ARS');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

  // Estados para probar Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalNombre, setModalNombre] = useState('');
  const [modalGuardando, setModalGuardando] = useState(false);

  // Manejador de simulación de carga para Boton
  const manejarClickSimulado = () => {
    setContadorClicks((prev) => prev + 1);
    setBotonSimulandoCarga(true);
    setTimeout(() => {
      setBotonSimulandoCarga(false);
      toast.success('¡Operación completada tras 2 segundos!');
    }, 2000);
  };

  // Manejador para guardar dentro del Modal
  const manejarGuardarModal = () => {
    if (!modalNombre.trim()) {
      toast.error('El nombre no puede estar vacío');
      return;
    }
    setModalGuardando(true);
    setTimeout(() => {
      setModalGuardando(false);
      setModalAbierto(false);
      toast.success(`Elemento "${modalNombre}" guardado exitosamente`);
      setModalNombre('');
    }, 1000);
  };

  // Simulación de toast promise
  const dispararToastPromise = () => {
    const promesa = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.3) {
          resolve({ datos: 'Sincronizado' });
        } else {
          reject(new Error('Fallo en el servidor'));
        }
      }, 1800);
    });

    toast.promise(promesa, {
      loading: 'Sincronizando con Supabase...',
      success: 'Datos sincronizados correctamente.',
      error: 'Error al sincronizar datos.',
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Cabecera Principal */}
        <header className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-oliva/10 px-3 py-1 text-xs font-semibold text-oliva mb-2">
                Catálogo de UI / Common Components
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Showcase de Componentes Visuales
              </h1>
              <p className="mt-1 text-slate-600 text-sm md:text-base">
                Vista previa e interactividad de los componentes base creados en{' '}
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-oliva">
                  src/components/common
                </code>
                .
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-lg bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700 border border-emerald-200">
                8 Componentes
              </span>
              <span className="rounded-lg bg-naranja-claro px-3 py-1.5 font-medium text-naranja border border-orange-200">
                + Toasts (Sonner)
              </span>
            </div>
          </div>

          {/* Menú de acceso rápido */}
          <nav className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4 text-xs font-medium">
            <span className="text-slate-400 py-1">Saltar a:</span>
            {[
              { href: '#botones', label: 'Boton' },
              { href: '#inputs', label: 'InputTexto' },
              { href: '#selectores', label: 'Selector' },
              { href: '#tarjetas', label: 'Tarjeta' },
              { href: '#modales', label: 'Modal' },
              { href: '#estados-vacios', label: 'EstadoVacio' },
              { href: '#mensajes-error', label: 'MensajeError' },
              { href: '#cargando', label: 'Cargando' },
              { href: '#notificaciones', label: 'Toasts' },
              { href: '#movimientos', label: 'TablaMovimientos' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700 transition hover:bg-naranja-claro hover:text-naranja"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </header>

        {/* 1. SECCIÓN: BOTONES */}
        <section id="botones" className="scroll-mt-6 space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-oliva text-xs text-white">
                1
              </span>
              Boton (<code className="text-sm font-mono text-oliva">Boton.tsx</code>)
            </h2>
            <p className="text-sm text-slate-500">
              Soporta variantes (<code className="font-mono">primary</code>, <code className="font-mono">secondary</code>, <code className="font-mono">danger</code>, <code className="font-mono">ghost</code>), tamaños (<code className="font-mono">sm</code>, <code className="font-mono">md</code>, <code className="font-mono">lg</code>, <code className="font-mono">icon</code>), estados <code className="font-mono">cargando</code> con spinner integrado y <code className="font-mono">disabled</code>.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Tarjeta>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
                Variantes Estándar
              </h3>
              <div className="flex flex-wrap gap-3">
                <Boton variante="primary" onClick={() => toast('Click en variante Primary')}>
                  Primary
                </Boton>
                <Boton variante="secondary" onClick={() => toast('Click en variante Secondary')}>
                  Secondary
                </Boton>
                <Boton variante="danger" onClick={() => toast('Click en variante Danger')}>
                  Danger
                </Boton>
                <Boton variante="ghost" onClick={() => toast('Click en variante Ghost')}>
                  Ghost
                </Boton>
              </div>
            </Tarjeta>

            <Tarjeta>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
                Estados: Deshabilitado & Cargando
              </h3>
              <div className="flex flex-wrap gap-3">
                <Boton variante="primary" disabled>
                  Deshabilitado
                </Boton>
                <Boton variante="secondary" cargando>
                  Cargando
                </Boton>
                <Boton variante="danger" cargando>
                  Eliminando
                </Boton>
              </div>
            </Tarjeta>

            <Tarjeta className="md:col-span-2">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
                Tamaños Disponibles
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Boton tamanio="sm" onClick={() => toast('Tamaño pequeño (sm)')}>
                  Pequeño (sm)
                </Boton>
                <Boton tamanio="md" onClick={() => toast('Tamaño mediano (md)')}>
                  Mediano (md - default)
                </Boton>
                <Boton tamanio="lg" onClick={() => toast('Tamaño grande (lg)')}>
                  Grande (lg)
                </Boton>
                <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                  <Boton
                    variante="secondary"
                    tamanio="icon"
                    onClick={() => toast('Tamaño icon con secondary')}
                    title="Editar"
                    aria-label="Editar"
                  >
                    <Pencil className="size-4" />
                  </Boton>
                  <Boton
                    variante="ghost"
                    tamanio="icon"
                    onClick={() => toast('Tamaño icon con ghost')}
                    title="Agregar"
                    aria-label="Agregar"
                  >
                    <Plus className="size-4" />
                  </Boton>
                </div>
              </div>
            </Tarjeta>

            <Tarjeta className="md:col-span-2">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
                Demostración Interactiva
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Boton
                  variante="primary"
                  cargando={botonSimulandoCarga}
                  onClick={manejarClickSimulado}
                >
                  {botonSimulandoCarga ? 'Procesando...' : 'Hacer click para simular carga (2s)'}
                </Boton>
                <span className="text-sm text-slate-600">
                  Clicks registrados: <strong className="text-naranja">{contadorClicks}</strong>
                </span>
              </div>
            </Tarjeta>
          </div>
        </section>

        {/* 2. SECCIÓN: INPUTS DE TEXTO */}
        <section id="inputs" className="scroll-mt-6 space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-oliva text-xs text-white">
                2
              </span>
              InputTexto (<code className="text-sm font-mono text-oliva">InputTexto.tsx</code>)
            </h2>
            <p className="text-sm text-slate-500">
              Entrada de texto accesible con <code className="font-mono">label</code> obligatorio, <code className="font-mono">textoAyuda</code> opcional y estado <code className="font-mono">error</code> descriptivo.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Tarjeta className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Casos de Uso
              </h3>
              <InputTexto
                label="Nombre completo"
                placeholder="Ej. Lionel Messi"
                defaultValue="Lionel Messi"
              />
              <InputTexto
                label="Correo electrónico"
                placeholder="ejemplo@finzo.com"
                textoAyuda="Nunca compartiremos tu correo con terceros."
              />
              <InputTexto
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                error="La contraseña debe tener al menos 8 caracteres."
              />
              <InputTexto
                label="Campo deshabilitado"
                value="No editable"
                disabled
              />
            </Tarjeta>

            <Tarjeta className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Prueba Interactiva en Vivo
              </h3>
              <InputTexto
                label="Escribe algo aquí:"
                placeholder="Escribe para ver la reactividad..."
                value={inputValor}
                onChange={(e) => setInputValor(e.target.value)}
                textoAyuda={inputValor ? `Caracteres ingresados: ${inputValor.length}` : 'Empieza a escribir para calcular la longitud.'}
              />
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 text-xs">
                <span className="text-slate-500 font-medium">Valor actual: </span>
                <span className="font-mono text-oliva">
                  {inputValor ? `"${inputValor}"` : '(vacío)'}
                </span>
              </div>

              <div className="pt-2">
                <InputTexto
                  label="Prueba de Validación en Tiempo Real"
                  placeholder="Escribe 'finzo' para quitar el error"
                  value={inputConError}
                  onChange={(e) => setInputConError(e.target.value)}
                  error={
                    inputConError.toLowerCase() === 'finzo'
                      ? undefined
                      : 'Debes escribir la palabra exacta "finzo"'
                  }
                  textoAyuda="Escribe exactamente 'finzo' para que el error desaparezca."
                />
              </div>
            </Tarjeta>
          </div>
        </section>

        {/* 3. SECCIÓN: SELECTOR */}
        <section id="selectores" className="scroll-mt-6 space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-oliva text-xs text-white">
                3
              </span>
              Selector (<code className="text-sm font-mono text-oliva">Selector.tsx</code>)
            </h2>
            <p className="text-sm text-slate-500">
              Elemento <code className="font-mono">&lt;select&gt;</code> estilizado con soporte para <code className="font-mono">label</code>, <code className="font-mono">textoAyuda</code> y <code className="font-mono">error</code>.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Tarjeta className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Variantes y Estados
              </h3>
              <Selector
                label="Moneda principal"
                value={monedaSeleccionada}
                onChange={(e) => setMonedaSeleccionada(e.target.value)}
                textoAyuda="Moneda por defecto para tus balances y transacciones."
              >
                <option value="ARS">ARS - Peso Argentino</option>
                <option value="USD">USD - Dólar Estadounidense</option>
                <option value="EUR">EUR - Euro</option>
              </Selector>

              <Selector
                label="Selector con Error"
                error="Debes seleccionar una cuenta activa."
                defaultValue=""
              >
                <option value="" disabled>Seleccionar una cuenta...</option>
                <option value="1">Cuenta Sueldo</option>
                <option value="2">Caja de Ahorro USD</option>
              </Selector>

              <Selector label="Selector Deshabilitado" disabled defaultValue="1">
                <option value="1">Opción fija deshabilitada</option>
              </Selector>
            </Tarjeta>

            <Tarjeta className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Selector Interactivo
              </h3>
              <Selector
                label="Categoría del movimiento"
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                textoAyuda="Selecciona la categoría correspondiente."
              >
                <option value="">-- Elige una categoría --</option>
                <option value="comida">🍽️ Comida y Restaurantes</option>
                <option value="transporte">🚗 Transporte y Combustible</option>
                <option value="servicios">💡 Servicios e Impuestos</option>
                <option value="salud">💊 Salud y Medicina</option>
                <option value="entretenimiento">🎮 Ocio y Entretenimiento</option>
              </Selector>

              <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                <p className="text-xs text-slate-500">Estado seleccionado:</p>
                <p className="mt-1 font-medium text-slate-800">
                  {categoriaSeleccionada ? (
                    <span className="text-emerald-600 font-semibold">
                      Seleccionaste: {categoriaSeleccionada}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">Ninguna categoría seleccionada</span>
                  )}
                </p>
              </div>
            </Tarjeta>
          </div>
        </section>

        {/* 4. SECCIÓN: TARJETA */}
        <section id="tarjetas" className="scroll-mt-6 space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-oliva text-xs text-white">
                4
              </span>
              Tarjeta (<code className="text-sm font-mono text-oliva">Tarjeta.tsx</code>)
            </h2>
            <p className="text-sm text-slate-500">
              Contenedor elevado con borde suave y relleno interno (<code className="font-mono">p-5</code>) para agrupar información.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Tarjeta>
              <h3 className="font-semibold text-slate-800">Tarjeta Simple</h3>
              <p className="mt-2 text-sm text-slate-600">
                Diseñada con bordes redondeados (<code className="font-mono text-xs">rounded-xl</code>), borde gris sutil y sombra suave.
              </p>
            </Tarjeta>

            <Tarjeta className="border-l-4 border-l-oliva">
              <div className="text-xs font-semibold text-oliva uppercase tracking-wider">
                Balance Total
              </div>
              <div className="mt-1 text-2xl font-bold text-slate-900">$ 450.280,00</div>
              <p className="mt-2 text-xs text-emerald-600 font-medium">
                +12.5% respecto al mes anterior
              </p>
            </Tarjeta>

            <Tarjeta className="flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-slate-800">Tarjeta con Acciones</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Ideal para paneles de control o widgets modulares.
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <Boton
                  variante="secondary"
                  className="w-full text-xs py-1.5"
                  onClick={() => toast('Ver detalles')}
                >
                  Ver más
                </Boton>
              </div>
            </Tarjeta>
          </div>
        </section>

        {/* 5. SECCIÓN: MODAL */}
        <section id="modales" className="scroll-mt-6 space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-oliva text-xs text-white">
                5
              </span>
              Modal (<code className="text-sm font-mono text-oliva">Modal.tsx</code>)
            </h2>
            <p className="text-sm text-slate-500">
              Diálogo nativo con <code className="font-mono">&lt;dialog&gt;</code>, soporte para cerrar con botón de cruz, tecla Escape o clic en el backdrop oscuro.
            </p>
          </div>

          <Tarjeta className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-slate-800">Modal Interactivo de Prueba</h3>
              <p className="text-sm text-slate-500">
                Haz clic en el botón para abrir un modal con formulario integrado.
              </p>
            </div>
            <Boton variante="primary" onClick={() => setModalAbierto(true)}>
              Abrir Modal de Ejemplo
            </Boton>
          </Tarjeta>

          {/* Componente Modal */}
          <Modal
            abierto={modalAbierto}
            titulo="Crear Nueva Categoría"
            onCerrar={() => setModalAbierto(false)}
            etiquetaCerrar="Cerrar modal de prueba"
          >
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Este diálogo utiliza el componente <code className="font-mono text-xs text-oliva">Modal</code> creado por Máximo con accesibilidad nativa.
              </p>

              <InputTexto
                label="Nombre de la categoría"
                placeholder="Ej. Gimnasio y Deportes"
                value={modalNombre}
                onChange={(e) => setModalNombre(e.target.value)}
                autoFocus
              />

              <Selector label="Icono sugerido" defaultValue="dumbbell">
                <option value="dumbbell">🏋️ Gimnasio</option>
                <option value="cart">🛒 Supermercado</option>
                <option value="home">🏠 Hogar</option>
                <option value="plane">✈️ Viajes</option>
              </Selector>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-100">
                <Boton
                  variante="secondary"
                  onClick={() => setModalAbierto(false)}
                  disabled={modalGuardando}
                >
                  Cancelar
                </Boton>
                <Boton
                  variante="primary"
                  cargando={modalGuardando}
                  onClick={manejarGuardarModal}
                >
                  Guardar Categoría
                </Boton>
              </div>
            </div>
          </Modal>
        </section>

        {/* 6. SECCIÓN: ESTADO VACÍO */}
        <section id="estados-vacios" className="scroll-mt-6 space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-oliva text-xs text-white">
                6
              </span>
              EstadoVacio (<code className="text-sm font-mono text-oliva">EstadoVacio.tsx</code>)
            </h2>
            <p className="text-sm text-slate-500">
              Placeholder para cuando una lista o sección no contiene datos, con borde punteado y botón de acción opcional.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Tarjeta>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
                Solo Título y Descripción
              </h3>
              <EstadoVacio
                titulo="Sin movimientos registrados"
                descripcion="Aún no has registrado ningún ingreso o gasto durante este período."
              />
            </Tarjeta>

            <Tarjeta>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
                Con Acción Principal
              </h3>
              <EstadoVacio
                titulo="No hay presupuestos activos"
                descripcion="Crea tu primer presupuesto para empezar a tener el control total de tus gastos."
                accion={
                  <Boton
                    variante="primary"
                    onClick={() => toast.info('Acción disparada desde EstadoVacio')}
                  >
                    + Nuevo Presupuesto
                  </Boton>
                }
              />
            </Tarjeta>
          </div>
        </section>

        {/* 7. SECCIÓN: MENSAJE DE ERROR */}
        <section id="mensajes-error" className="scroll-mt-6 space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-oliva text-xs text-white">
                7
              </span>
              MensajeError (<code className="text-sm font-mono text-oliva">MensajeError.tsx</code>)
            </h2>
            <p className="text-sm text-slate-500">
              Alerta de error con rol accesible <code className="font-mono">role="alert"</code>, fondo suave y texto destacado.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Tarjeta className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Con Título por Defecto ("Ocurrió un error")
              </h3>
              <MensajeError mensaje="No se pudo conectar con el servidor de Finzo. Por favor intente más tarde." />
            </Tarjeta>

            <Tarjeta className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Con Título Personalizado
              </h3>
              <MensajeError
                titulo="Credenciales Inválidas"
                mensaje="El correo o la contraseña ingresados son incorrectos. Verifique sus datos e intente nuevamente."
              />
            </Tarjeta>
          </div>
        </section>

        {/* 8. SECCIÓN: CARGANDO */}
        <section id="cargando" className="scroll-mt-6 space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-oliva text-xs text-white">
                8
              </span>
              Cargando (<code className="text-sm font-mono text-oliva">Cargando.tsx</code>)
            </h2>
            <p className="text-sm text-slate-500">
              Spinner SVG con etiqueta accesible y rol <code className="font-mono">role="status"</code>.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Tarjeta>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
                Etiqueta por Defecto
              </h3>
              <Cargando />
            </Tarjeta>

            <Tarjeta>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
                Etiqueta Personalizada
              </h3>
              <Cargando etiqueta="Cargando balances y movimientos..." />
            </Tarjeta>
          </div>
        </section>

        {/* 9. SECCIÓN: NOTIFICACIONES (TOAST - SONNER) */}
        <section id="notificaciones" className="scroll-mt-6 space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-oliva text-xs text-white">
                9
              </span>
              Notificaciones / Toasts (<code className="text-sm font-mono text-oliva">toast</code> desde <code className="text-sm font-mono">common</code>)
            </h2>
            <p className="text-sm text-slate-500">
              Sistema de alertas toast provisto por Sonner, configurado en <code className="font-mono">main.tsx</code> y re-exportado desde <code className="font-mono">components/common</code>.
            </p>
          </div>

          <Tarjeta>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Disparadores de Notificación
            </h3>
            <div className="flex flex-wrap gap-3">
              <Boton
                variante="primary"
                onClick={() => toast.success('¡Transacción guardada correctamente!')}
              >
                Toast Success
              </Boton>
              <Boton
                variante="danger"
                onClick={() => toast.error('Error al intentar eliminar la cuenta.')}
              >
                Toast Error
              </Boton>
              <Boton
                variante="secondary"
                onClick={() => toast.info('Hay una nueva actualización disponible.')}
              >
                Toast Info
              </Boton>
              <Boton
                variante="secondary"
                onClick={() => toast.warning('Tu presupuesto para Alimentación superó el 85%.')}
              >
                Toast Warning
              </Boton>
              <Boton
                variante="primary"
                onClick={dispararToastPromise}
              >
                Toast Asíncrono (Promise)
              </Boton>
            </div>
          </Tarjeta>
        </section>
                {/* Sección Tabla de Movimientos */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Tabla de Movimientos
            </h2>
            <p className="text-sm text-slate-500">
              Visualización de la lista de movimientos con montos, fechas y acciones.
            </p>
          </div>

          <TablaMovimientos
            movimientos={movimientosSimulados}
            onEliminar={(id) => toast.error(`Clic en eliminar movimiento con ID: ${id}`)}
            onEditar={(id) => toast.info(`Clic en editar movimiento con ID: ${id}`)}
          />
        </section>

        {/* Pie de página */}
        <footer className="text-center text-xs text-slate-400 py-6 border-t border-slate-200">
          Finzo Design System - Visualizador de componentes creados en common.
        </footer>
      </div>
    </div>
  );
}

