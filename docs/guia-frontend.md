# Guía de Desarrollo Frontend — Finzo

Esta guía define las reglas y estándares para que todos los integrantes del equipo desarrollemos pantallas y componentes con la misma coherencia visual, técnica y de código.

---

## 1. Identidad Visual y Colores (Tailwind v4)

Los estilos globales y tokens de diseño están definidos en [`frontend/src/styles/globals.css`](../frontend/src/styles/globals.css).

### Colores de Marca y Estados Financieros
- **Naranja Finzo (Acento / Acción principal):** `bg-naranja`, `text-naranja`, `hover:bg-naranja-hover`, `bg-naranja-claro`.
- **Oliva Finzo (Identidad secundaria / Navbar / Marca):** `bg-oliva`, `bg-oliva-oscuro`, `bg-oliva-claro`.
- **Ingresos (Dinero que entra):** `text-ingreso`, `bg-ingreso-fondo`, `border-ingreso-borde`.
- **Gastos (Dinero que sale):** `text-gasto`, `bg-gasto-fondo`, `border-gasto-borde`.
- **Alertas / Advertencias (Límites de presupuesto, avisos):** `text-alerta`, `bg-alerta-fondo`, `border-alerta-borde`.

### Escala de Neutros Oficial
Para fondos, bordes y textos secundarios usamos **exclusivamente la escala `slate`** de Tailwind:
- Fondo de pantalla general: `bg-slate-50` (`#f8fafc`).
- Superficies y tarjetas: `bg-white` con `border-slate-200`.
- Textos principales: `text-slate-900`.
- Textos secundarios / placeholders: `text-slate-500` o `text-slate-400`.
- Bordes de inputs / divisores: `border-slate-200` o `border-slate-300`.

> **Regla:** No usar clases de `gray-`, `zinc-` ni `neutral-` para evitar mezclar tonalidades grises.

---

## 2. Componentes Comunes Obligatorios (`src/components/common`)

Antes de crear un botón, modal o campo de texto con HTML nativo, revisá los componentes ya creados en [`frontend/src/components/common/`](../frontend/src/components/common/):

| Componente | Para qué sirve | Ejemplo de uso |
| :--- | :--- | :--- |
| **`Boton`** | Botones con variantes (`primary`, `secondary`, `danger`) y estado `cargando`. | `<Boton variante="primary" cargando={guardando}>Guardar</Boton>` |
| **`Tarjeta`** | Tarjeta contenedora con borde y sombra unificada. | `<Tarjeta className="p-6">Contenido</Tarjeta>` |
| **`InputTexto`** | Input con etiqueta, texto de ayuda y mensaje de error accesible. | `<InputTexto label="Monto" error={errores.monto} />` |
| **`Selector`** | Select desplegable accesible con opciones y validación. | `<Selector label="Categoría" opciones={[...]} />` |
| **`Modal`** | Ventana modal centrada con backdrop, cierre y accesibilidad. | `<Modal abierto={abierto} alCerrar={cerrar}>...</Modal>` |
| **`Cargando`** | Spinner con texto accesible para estados de carga. | `<Cargando mensaje="Cargando movimientos..." />` |
| **`MensajeError`** | Cartel de error con botón de reintentar opcional. | `<MensajeError mensaje="Error al cargar" alReintentar={cargar} />` |
| **`EstadoVacio`** | Mensaje con icono para cuando una lista o filtro no tiene datos. | `<EstadoVacio titulo="Sin movimientos" descripcion="..." />` |

Se importan directamente desde el índice:
```tsx
import { Boton, Tarjeta, InputTexto, Cargando } from '../components/common';
```

---

## 3. Estructura de Pantalla (`PageContainer`)

Para que todas las páginas tengan el mismo ancho máximo, centrado y espaciado en desktop y mobile, usamos [`PageContainer`](../frontend/src/components/layout/PageContainer.tsx):

```tsx
import { PageContainer } from '../components/layout/PageContainer';
import { Boton } from '../components/common';

export function Categorias() {
  return (
    <PageContainer
      titulo="Categorías"
      descripcion="Administrá las categorías de tus ingresos y gastos"
      acciones={<Boton onClick={abrirModal}>+ Nueva Categoría</Boton>}
    >
      {/* Contenido principal de la página */}
    </PageContainer>
  );
}
```

---

## 4. Formato de Montos y Fechas (`src/utils/formateadores.ts`)

Nunca formatees montos monetarios o fechas a mano con strings inventados. Usá siempre las funciones de [`frontend/src/utils/formateadores.ts`](../frontend/src/utils/formateadores.ts):

- **Montos:** `formatearMonto(15000)` $\rightarrow$ `$ 15.000,00`
- **Fechas:** `formatearFecha('2026-10-27T10:00:00Z')` $\rightarrow$ `27 oct. 2026`
- **Números tabulares en tablas:** Al mostrar valores de dinero en tablas o resúmenes, agregá la clase `tabular-nums` de Tailwind para que los dígitos ocupen el mismo ancho y queden alineados verticalmente:
  ```tsx
  <span className="font-semibold tabular-nums text-ingreso">
    + {formatearMonto(movimiento.monto)}
  </span>
  ```

---

## 5. Arquitectura: Páginas Inteligentes vs Componentes Presentacionales

Siguiendo la decisión de diseño del Caso 4:
1. **La Página / Hook maneja la lógica:** Realiza las llamadas a los servicios con Axios, maneja los estados `cargando` y `error`, y abre los modales.
2. **El Componente visual solo pinta datos:** Recibe la información por `props` y emite eventos (`onEditar`, `onEliminar`). No realiza peticiones directas a la API ni controla el spinner global.

Esto permite reutilizar el mismo componente visual (como una lista de movimientos) en el Dashboard y en la pantalla de Movimientos sin duplicar código.

---

## 6. Iconos y Nombres

- **Iconos:** Usar únicamente `lucide-react`. No instalar otras librerías de iconos.
- **Idioma del código:** Componentes, funciones, variables y comentarios en **español** (`TablaMovimientos`, `formatearMonto`, `saldoTotal`).
- **Nombres de archivos:**
  - Componentes React: `PascalCase.tsx` (ej: `Tarjeta.tsx`, `PageContainer.tsx`).
  - Hooks: `useCamelCase.ts` (ej: `useMovimientos.ts`).
  - Servicios y tipos: `kebab-case.service.ts` y `kebab-case.types.ts`.

---

## 7. Paquetes

- **Gestor de paquetes:** Usar **siempre `pnpm`** (`pnpm add`, `pnpm run dev`, `pnpm test`). Nunca usar `npm`.


