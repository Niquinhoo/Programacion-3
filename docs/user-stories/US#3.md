# US#3 — Construir la pantalla de bienvenida

**Código de consigna:** `#main-s1-us3` · **Trabajo sugerido:** individual · **Fuente:** [consigna local del sprint](../../expense-tracker-sprint-1.md#L59).

## Consigna

Al abrir la aplicación, mostrar el nombre **ExpenseTracker**, un mensaje de bienvenida y una descripción breve que explique que sirve para registrar gastos. La información debe ser legible y usar `Text`, al menos un `View` y `StyleSheet`.

## Qué quedó implementado

La pestaña inicial es Inicio. Su hero presenta `EXPENSETRACKER`, el título “Tus gastos, más claros.” y el texto “Bienvenido. Registrá tus gastos y conocé en qué usás tu dinero.” Se construye con `View`, `Text` y estilos de React Native ([hero](../../ExpenseTracker/src/components/ExpenseHero.js#L37), [pestañas](../../ExpenseTracker/src/navigation/TabNavigator.js#L57)).

## Contraste de validación

| Criterio | Evidencia | Estado |
| --- | --- | --- |
| Nombre de la aplicación | Texto `EXPENSETRACKER` en el hero. | Cumple |
| Saludo y propósito | “Bienvenido” y explicación del registro de gastos. | Cumple |
| Componentes y estilos solicitados | `View`, `Text` y `StyleSheet` en el hero. | Cumple |
| Lectura en una pantalla móvil | Hay capturas web a viewport de teléfono; no son capturas de Expo Go. | Cumple en vista web; nativo pendiente |

## Resultado

**Cumple en la implementación.** El README incluye capturas de la vista web para observar la composición; falta evidencia fotográfica o captura nativa si se requiere demostrarla en Expo Go.
