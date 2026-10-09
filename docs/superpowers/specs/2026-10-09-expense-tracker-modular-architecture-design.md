# ExpenseTracker: modularización de responsabilidades

## Objetivo

Organizar ExpenseTracker en módulos pequeños con una responsabilidad clara, siguiendo la estructura por carpetas de la referencia. Esto debe ayudar a localizar errores y modificar una parte sin tener que entender pantallas completas.

## Estado actual

- `src/components/` contiene los componentes compartidos `ActionButton` y `Screen`.
- `src/data/expenses.js` define tanto las categorías como los gastos de ejemplo.
- `src/utils/expense.js` contiene el formato de moneda y la validación del formulario.
- `ExpensesScreen` representa cada gasto dentro de la pantalla.
- `NewExpenseModal` contiene la selección de categoría junto con el estado y el envío del formulario.
- `ExpenseDetailScreen` muestra el gasto y su categoría.

## Estructura objetivo

```text
src/
├── components/
│   ├── ActionButton.js
│   ├── CategoryBadge.js
│   ├── CategorySelector.js
│   ├── ExpenseCard.js
│   └── Screen.js
├── data/
│   ├── categories.js
│   └── mockExpenses.js
├── navigation/
│   ├── StackNavigator.js
│   └── TabNavigator.js
├── screens/
│   ├── ExpenseDetailScreen.js
│   ├── ExpensesScreen.js
│   ├── HomeScreen.js
│   ├── NewExpenseModal.js
│   └── SettingsScreen.js
├── utils/
│   ├── formatAmount.js
│   └── validateExpense.js
└── styles.js
```

## Responsabilidades e interfaces

- `data/categories.js` exporta `categories`, la lista existente de categorías.
- `data/mockExpenses.js` exporta `mockExpenses`, los tres gastos existentes de demostración.
- `utils/formatAmount.js` exporta `formatAmount(amount)` y conserva el formato actual de pesos argentinos.
- `utils/validateExpense.js` exporta `validateExpense(input)`, conserva las reglas y mensajes actuales y consulta `categories.js`.
- `components/CategoryBadge.js` presenta una categoría en la lista y el detalle.
- `components/ExpenseCard.js` presenta un gasto y recibe una acción `onPress`; no decide rutas de navegación.
- `components/CategorySelector.js` presenta las categorías y comunica la selección mediante una callback. El estado del formulario permanece en `NewExpenseModal`.
- Las pantallas componen estos módulos y siguen siendo responsables de coordinar sus datos y navegación.
- `styles.js` conserva los colores y estilos compartidos. Los estilos que solo usa un componente permanecen junto a ese componente.

No se agregan archivos índice o reexportaciones: los consumidores importan cada módulo directamente para que el origen de cada función o componente siga siendo visible.

## Flujo y compatibilidad

`ExpensesScreen` obtiene `mockExpenses`, calcula el total y conecta `ExpenseCard.onPress` con la ruta `DetalleGasto`. `ExpenseDetailScreen` busca el mismo gasto por id y presenta su categoría con `CategoryBadge`. `NewExpenseModal` mantiene el estado del formulario, entrega las categorías a `CategorySelector` y conserva el flujo actual de validación y respuesta al guardar.

Se mantienen `App.js`, `StackNavigator`, `TabNavigator`, los nombres de rutas, las pantallas y el comportamiento visible de la aplicación. Los consumidores de datos y utilidades, incluida `tests/expense.test.mjs`, actualizan sus imports a los nuevos módulos. Se eliminan `data/expenses.js` y `utils/expense.js` una vez migradas todas sus referencias.

## Alcance

- Sin cambios en persistencia, navegación, validaciones, datos de demostración ni comportamiento visual.
- Sin Context, API remota ni almacenamiento local en este sprint.
- No se crea `database/`: la consigna de Sprint 1 excluye persistencia. Se agregará una capa de datos persistentes cuando esa funcionalidad tenga alcance y tecnología definidos.
- La atomización se limita a responsabilidades reutilizables o con lógica propia; el JSX trivial permanece en su pantalla o componente propietario.

## Criterios de aceptación

1. La estructura objetivo existe y cada módulo cumple la responsabilidad descrita.
2. No quedan referencias a los dos módulos antiguos ni imports rotos.
3. La lista, el detalle, el formulario, la navegación y los mensajes conservan el comportamiento actual.
4. Las aserciones existentes siguen cubriendo el formato, la validación y los datos de ejemplo mediante sus imports nuevos.
5. Los comandos de verificación requeridos por `AGENTS.md` se ejecutan antes de completar la implementación.
