# US#5 — Construir el listado de gastos

**Código de consigna:** `#main-s1-us5` · **Trabajo sugerido:** individual · **Fuente:** [consigna local del sprint](../../expense-tracker-sprint-1.md#L75).

## Consigna

Mostrar como datos definidos manualmente estos ejemplos: Supermercado — $25.000, Combustible — $18.000 e Internet — $32.000. Cada fila debe presentar una descripción y un monto.

## Qué quedó implementado

Los tres gastos están definidos en `src/data/expenses.js` con sus importes, categorías y fechas. `ExpenseRow` presenta el nombre, la categoría, el monto formateado en pesos argentinos y la fecha. Inicio muestra los tres movimientos recientes; Gastos permite consultar la lista, buscar por nombre o categoría y filtrar por período o categoría ([datos](../../ExpenseTracker/src/data/expenses.js#L1), [fila](../../ExpenseTracker/src/components/ExpenseRow.js#L13), [lista](../../ExpenseTracker/src/screens/ExpensesScreen.js#L12)).

## Contraste de validación

| Criterio | Evidencia | Estado |
| --- | --- | --- |
| Supermercado — $25.000 | Registro estático y monto mostrado en la fila. | Cumple |
| Combustible — $18.000 | Registro estático y monto mostrado en la fila. | Cumple |
| Internet — $32.000 | Registro estático y monto mostrado en la fila. | Cumple |
| Presentación como lista | Inicio y pestaña Gastos usan `ExpenseRow`. | Cumple |
| Descripción y monto legibles | Cada fila muestra el nombre y el monto ARS. | Cumple |

## Resultado

**Cumple.** Los valores coinciden con la consigna. Las pruebas verifican los registros y su suma, $75.000; la historia no requiere que el listado sea editable ni persistente.
