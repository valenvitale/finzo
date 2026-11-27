# Hoja de ruta de mejoras pendientes — FINZO

**Actualización:** 27/11/2026 · Sprint 3 (Taller III) · `develop` (`d70bb6d`).

Registramos oportunidades de mejora que siguen abiertas, diferenciándolas de las funcionalidades ya integradas. Priorizamos por impacto, riesgo y esfuerzo, no por alcanzar un puntaje perfecto.

## Prioridades

| Prioridad | Mejora | Motivo y criterio de cierre |
| --- | --- | --- |
| Alta | Verificar el aislamiento de datos y las políticas RLS de presupuestos y metas de ahorro. | Las dos migraciones revisadas no habilitan RLS ni crean políticas; comprobar la configuración efectiva de Supabase y sus permisos; probar con dos perfiles en una instancia de desarrollo que no puedan acceder a registros ajenos. No implica que exista una vulnerabilidad confirmada. |
| Media | Unificar criterios de años en filtros y consultas financieras. | Acordar rangos coherentes entre movimientos, resumen, estadísticas y presupuestos antes de modificar los esquemas; cubrir límites y errores con tests. |
| Media | Revisar la consistencia de totales y montos por moneda. | Comparar resumen, estadísticas, movimientos y presupuestos; no sumar monedas diferentes sin un criterio explícito. El resumen actual filtra por la moneda principal. |
| Media | Verificar instalación desde cero. | Reproducir README y guía Supabase en una instancia independiente, incluyendo nuevas migraciones y datos iniciales. |
| Media | Ampliar pruebas de escenarios de riesgo. | Evaluar respuestas fuera de orden y desmontaje en `useApi`, pruebas de persistencia real y recorridos críticos E2E. |
| Baja | Unificar formato con Prettier. | Repetir `pnpm format:check` (91 archivos con diferencias el 24/11); coordinar un commit independiente para reducir ruido en las PR. |
| Baja | Optimizar el tamaño del bundle. | Vite advierte sobre un chunk de 1.092,75 kB (310,95 kB gzip); analizar dependencias y división de código antes de modificarlo. El build termina correctamente. |
| Baja | Evaluar medición de cobertura. | Priorizar comportamientos y aserciones relevantes antes que porcentajes; no contamos con una medición confirmada. |

## Mejoras ya integradas

- Dashboard real, páginas privadas, hooks y avisos de sesión: incorporados durante el MVP; ya no corresponden a los pendientes originales.
- PR #34: eliminación de importación innecesaria, DIP y tipado en Categorías y Estadísticas, validación de filtros y fechas futuras, corrección de monedas en movimientos recientes y pruebas asociadas.
- PR #35: presupuestos por categoría y moneda, metas mensuales de ahorro, nuevas migraciones y pruebas del módulo.
- PR #36: estabilización de la autenticación en la prueba de App y tests de componentes comunes (`Boton`, `Modal`, `InputTexto`, `EstadoVacio`). La salida resumida de la suite no permite certificar la ausencia del warning `act()` en todos los tests; si reaparece, revisar el escenario específico.

## Evidencia de cierre del Sprint 3

| Verificación | Resultado |
| --- | --- |
| `pnpm test` | Backend: 189/189 en 29 archivos. Frontend: 35/35 en 15 archivos. Total: 224/224. |
| `pnpm lint` | Sin errores ni advertencias. |
| `pnpm build` | Correcto; advertencia por tamaño del chunk del frontend. |
| `pnpm format:check` | Pendiente de repetir en la versión actual. |

Los resultados corresponden a la ejecución local del 27/11/2026, no garantizan ausencia de defectos. Conservamos el historial de decisiones en [decisiones-diseno.md](decisiones-diseno.md).

## Evolución futura

Evaluar exportaciones, movimientos recurrentes y otras ampliaciones según las necesidades del usuario. Un pipeline de CI/CD y un despliegue productivo no forman parte de la evidencia obligatoria del Taller III.
