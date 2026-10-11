# US#4 — Construir el formulario de carga de gastos

**Código de consigna:** `#main-s1-us4` · **Trabajo sugerido:** individual · **Fuente:** [consigna local del sprint](../../expense-tracker-sprint-1.md#L67).

## Consigna

Representar un futuro gasto con nombre, monto y categoría, y un botón **Guardar** que responda a `onPress`. No hace falta persistir la información; una acción sencilla o un mensaje temporal alcanza.

## Qué quedó implementado

`NewExpenseModal` presenta entradas para nombre y monto, selección de categoría y botón Guardar. El handler valida el nombre, acepta montos positivos con coma o punto decimal y hasta dos decimales, y verifica que la categoría pertenezca a las disponibles. Muestra un mensaje de error o una confirmación. La confirmación aclara que esta demo no guarda el gasto ([formulario](../../ExpenseTracker/src/screens/NewExpenseModal.js#L12), [validación](../../ExpenseTracker/src/utils/expense.js#L37)).

## Contraste de validación

| Criterio | Evidencia | Estado |
| --- | --- | --- |
| Campo de nombre | `TextInput` con etiqueta y límite de caracteres. | Cumple |
| Campo de monto | `TextInput` decimal y validación de formato y rango. | Cumple |
| Selección de categoría | Opciones accesibles con selección marcada. | Cumple |
| Guardar responde a una acción | Ejecuta `handleSave` y actualiza el mensaje de resultado. | Cumple |
| No requiere persistencia | La respuesta explica que el gasto no se guarda. | Cumple el alcance |
| Casos válidos e inválidos | `expense.test.mjs` cubre decimales, ceros, formato, categoría y nombre. | Cumple; `npm test` pasó |

## Resultado

**Cumple y agrega validaciones útiles** por encima del mínimo solicitado, sin introducir persistencia fuera del alcance del sprint.
