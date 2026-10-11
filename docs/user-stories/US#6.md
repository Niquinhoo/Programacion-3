# US#6 — Integrar las vistas del sprint

**Código de consigna:** `#rn-s1-us6` · **Trabajo sugerido:** colaborativo · **Fuente:** [consigna local del sprint](../../expense-tracker-sprint-1.md#L87).

## Consigna

Reunir bienvenida, formulario y listado con navegación funcional. Se pide al menos un `TabNavigator` y un `StackNavigator`, sin errores de navegación, y mantener el proyecto organizado y ejecutable.

## Qué quedó implementado

`TabNavigator` integra Inicio, Gastos y Ajustes. `StackNavigator` contiene las pestañas y agrega las rutas `DetalleGasto` y `NuevoGasto` como paneles modales. Desde Inicio se llega a Gastos y al formulario; al tocar una fila se abre su detalle ([tabs](../../ExpenseTracker/src/navigation/TabNavigator.js#L20), [stack](../../ExpenseTracker/src/navigation/StackNavigator.js#L8), [acciones de Inicio](../../ExpenseTracker/src/screens/HomeScreen.js#L60)).

El README registra pruebas de navegación e interacción en la vista web. En esta revisión pasaron `npm test`, `npm run lint`, `npm run typecheck` y `npx expo-doctor` (21/21). La apertura y el recorrido en Expo Go permanecen pendientes.

## Contraste de validación

| Criterio | Evidencia | Estado |
| --- | --- | --- |
| Reunir bienvenida y listado | Pestañas Inicio y Gastos. | Cumple |
| Acceder al formulario | Ruta `NuevoGasto`, presentada como panel. | Cumple |
| Acceder al detalle | Las filas navegan a `DetalleGasto` con el id del gasto. | Cumple |
| Usar `TabNavigator` y `StackNavigator` | Ambos están declarados y conectados. | Cumple |
| Navegación sin errores | Interacciones web están documentadas; checks actuales pasan. | Cumple en web/código; nativo pendiente |

## Resultado

**Cumple en código y en las verificaciones web registradas.** Para cerrar la validación literal de Expo Go falta probar navegación y formulario en un teléfono.
