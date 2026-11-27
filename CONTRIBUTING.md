# Metodología de trabajo y convenciones

En Finzo usamos Git Flow para que los cuatro integrantes podamos trabajar en paralelo. Organizamos las tareas en Jira, desarrollamos cada cambio en su propia rama y lo revisamos en GitHub mediante una pull request (PR).

## Estrategia de ramas

- **`main`** conserva el código de las versiones estables. Cada entrega se identifica con una etiqueta de versión en esta rama.
- **`develop`** reúne los cambios revisados y sirve como punto de partida para el trabajo habitual.
- **`feature/nombre-de-la-funcionalidad`** se crea desde `develop` para implementar una funcionalidad. Para otros cambios usamos un prefijo que describa el trabajo, como `fix/` para una corrección. Cuando la PR se integra en `develop`, eliminamos la rama de trabajo.
- **`release/x.y`** se crea desde `develop` cuando hay suficientes cambios para una entrega. En esa rama solo corregimos errores menores, ajustamos la versión y actualizamos la documentación. Cuando queda lista, la integramos en `main` y `develop` para que los ajustes de la entrega también queden en la rama de integración. La etiqueta de versión se crea en `main`.
- **`hotfix/nombre-de-la-corrección`** se crea desde `main` para resolver un error urgente de la versión estable. Una vez revisada la corrección, la integramos en `main` y `develop` y etiquetamos el parche en `main`.

## De Jira a la pull request

1. **Registrá el trabajo en Jira.** Cada funcionalidad, error o tarea técnica tiene un ticket con un responsable y criterios de aceptación. Actualizá su estado a medida que avanza y dejá por escrito cualquier bloqueo o decisión importante.
2. **Creá la rama de trabajo.** Para una tarea habitual, partí de `develop` actualizado y elegí un nombre que identifique el cambio. Hacé los commits en esa rama siguiendo las [convenciones del equipo](#mensajes-de-commit).
3. **Verificá el cambio en local.** Usá siempre `pnpm`. Ejecutá las comprobaciones que correspondan, como `pnpm test`, `pnpm lint`, `pnpm build` o `pnpm format:check`, y actualizá la documentación afectada. [Scripts disponibles](README.md#scripts-disponibles)
4. **Abrí la PR.** Para el trabajo habitual, la rama de destino es `develop`. Enlazá el ticket de Jira y explicá qué cambió, por qué y cómo se puede comprobar. Incluí los comandos que ejecutaste y sus resultados.
5. **Pedí una revisión.** Al menos un compañero debe revisar la PR antes de integrarla. Resolvé las observaciones, repetí las comprobaciones afectadas y actualizá el ticket cuando se integre el cambio.

En el Sprint 3 seguimos este flujo para los [ajustes de calidad del Taller III](https://github.com/valenvitale/finzo/pull/34), los [presupuestos y metas de ahorro](https://github.com/valenvitale/finzo/pull/35) y las [pruebas de componentes comunes](https://github.com/valenvitale/finzo/pull/36). Para el Taller III documentamos las verificaciones locales. CI/CD queda fuera del alcance de esa entrega.

## Mensajes de commit

Usamos Conventional Commits con el formato `tipo: descripción` o `tipo(alcance): descripción` cuando ayuda a identificar el módulo. Los tipos admitidos son `feat`, `fix`, `docs`, `style`, `refactor`, `test` y `chore`.

Escribí la descripción en español, en minúsculas y con un verbo en tercera persona del presente, como «agrega», «corrige» o «actualiza». Debe tener menos de 72 caracteres y escribirse sin comillas ni punto final.

```text
feat(movimientos): agrega paginación al listado
fix: corrige importes de presupuestos
test: añade pruebas para el cálculo de balance
docs: actualiza la guía de instalación
```

## Etiquetas de versión

Etiquetamos las entregas estables en `main` con el formato `vMAJOR.MINOR.PATCH` de versionado semántico (SemVer).

- **`MAJOR`** aumenta cuando hay cambios incompatibles con la versión anterior. Por ejemplo, de `v1.4.2` a `v2.0.0`.
- **`MINOR`** aumenta cuando se agregan funcionalidades compatibles. Por ejemplo, de `v1.4.2` a `v1.5.0`.
- **`PATCH`** aumenta cuando se publican correcciones compatibles. Por ejemplo, de `v1.4.2` a `v1.4.3`.

Una vez integrado el cambio en `main`, actualizá esa rama y creá una etiqueta anotada sobre el commit de la entrega. Por ejemplo, para publicar `v1.0.0`:

```bash
git switch main
git pull --ff-only
git tag -a v1.0.0 -m "primera versión estable de Finzo"
git push origin v1.0.0
```

Podés consultar las etiquetas locales con `git tag -l`.
