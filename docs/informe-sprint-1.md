# ExpenseTracker — índice del informe del Sprint 1

**Fecha de corte:** 11 de octubre de 2026 · **Rama revisada:** `STP1` · **commit:** `f64c416`
**Fuente de contraste:** [consigna completa del sprint](../expense-tracker-sprint-1.md), consultada el 7 de octubre de 2026.

Cada User Story tiene ahora su propio archivo con la consigna, la implementación observada, el contraste frente a los criterios y un resultado individual.

| Historia | Archivo | Estado |
| --- | --- | --- |
| US#1 — Crear el proyecto Expo | [US#1](user-stories/US%231.md) | Proyecto y Git listos; falta comprobar Expo Go. |
| US#2 — Definir la estructura | [US#2](user-stories/US%232.md) | Cumple. |
| US#3 — Pantalla de bienvenida | [US#3](user-stories/US%233.md) | Cumple; capturas disponibles de la vista web. |
| US#4 — Formulario de gastos | [US#4](user-stories/US%234.md) | Cumple, con validación y confirmación sin persistencia. |
| US#5 — Listado de gastos | [US#5](user-stories/US%235.md) | Cumple con los tres gastos requeridos. |
| US#6 — Integrar las vistas | [US#6](user-stories/US%236.md) | Cumple en código y pruebas web; Expo Go pendiente. |
| US#7 — Bonus opcional | [US#7](user-stories/US%237.md) | Cumple el bonus con iconos y colores por categoría; otras mejoras sugeridas quedan disponibles. |

## Condiciones generales de entrega

| Condición | Estado | Evidencia o pendiente |
| --- | --- | --- |
| Mostrar progreso y participación individual | **Condicional** | El historial de Git permite revisar autores y archivos. El historial inspeccionado registra una identidad (`Niquinhoo`); si el equipo fue grupal, cada integrante debe registrar sus aportes con su identidad. |
| Organizar el proyecto y usar componentes React Native | **Cumple** | Separación en componentes, pantallas, navegación, recursos, datos y utilidades. |
| Verificar la aplicación en Expo Go | **Pendiente** | Falta abrirla en un teléfono y probar navegación y teclado nativos. |
| Entregar el código fuente en Git y usar ramas | **Cumple** | Código publicado en `STP1` en `origin`. |
| Incluir capturas de la aplicación y evidencia de participación | **Parcial** | README contiene capturas web en viewport de teléfono, animación del hero e instrucciones para consultar el historial. Faltan capturas nativas si se exigen para Expo Go. |
| Mantener alcance sin persistencia | **Cumple** | No hay SQLite, Context ni API remota; el formulario informa que la demo no guarda datos. |

La consigna no exige persistencia. La estructura modular adicional de `data/` y `utils/`, las pantallas de Ajustes, búsqueda y filtros, y los paneles de detalle y formulario forman parte de la implementación de demostración.

## Trabajo adicional de experiencia

- **Hero contraíble en Inicio:** cualquier desplazamiento positivo contrae el hero; volver al inicio expande. Se reutiliza una animación de 360 ms con transición reversible ([HomeScreen.js](../ExpenseTracker/src/screens/HomeScreen.js#L12), [ExpenseHero.js](../ExpenseTracker/src/components/ExpenseHero.js#L23)).
- **Contenido despejado al contraer:** durante la transición el área de scroll reserva recorrido para evitar que las filas queden debajo del hero o que el cambio de altura genere desplazamiento sobrante. [hero-scroll.mjs](../ExpenseTracker/tests/hero-scroll.mjs#L1) contiene aserciones para visibilidad y estabilidad; no se ejecutó de nuevo durante esta revisión.
- **Paneles para formulario y detalle:** comparten animación, cierre y contenido desplazable que se adapta al teclado ([ExpenseSheet.js](../ExpenseTracker/src/components/ExpenseSheet.js#L1)).

## Verificaciones

Ejecutadas al preparar este informe desde `ExpenseTracker/`:

| Comando | Resultado |
| --- | --- |
| `npm test` | **Pasó** — validación, moneda ARS, datos, búsqueda y filtros. |
| `npm run lint` | **Pasó**. |
| `npm run typecheck` | **Pasó**. |
| `npx expo-doctor` | **Pasó** — 21/21 comprobaciones. |

El [README](../README.md#L100) registra una exportación previa para Android, iOS y web, y verificaciones de interacción en navegador. La vista web y estas pruebas no reemplazan la verificación nativa en Expo Go.

## Documentos de arquitectura

El repositorio también incluye una [especificación](superpowers/specs/2026-10-09-expense-tracker-modular-architecture-design.md) y un [plan de modularización](superpowers/plans/2026-10-09-expense-tracker-modularization.md). Son documentación de trabajo pendiente, no una refactorización terminada; ese plan no forma parte de los criterios de aceptación del Sprint 1.

**Pendientes para cerrar la entrega:** probar en Expo Go y tomar capturas nativas; si la entrega es grupal, comprobar que el historial refleje la participación de cada integrante.
