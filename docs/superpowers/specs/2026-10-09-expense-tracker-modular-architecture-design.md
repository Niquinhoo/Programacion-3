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

Los módulos React que contienen JSX usan extensión `.jsx`: `App`, componentes, navegación y pantallas. Datos, estilos y lógica sin JSX usan `.js`. `index.js` conserva `.js` porque solo registra `App`; su import apunta a `App.jsx`.

```text
ExpenseTracker/
├── App.jsx
├── index.js
├── tsconfig.json
└── src/
    ├── components/
    │   ├── ActionButton.jsx
    │   ├── CategoryBadge.jsx
    │   ├── CategorySelector.jsx
    │   ├── ExpenseCard.jsx
    │   └── Screen.jsx
    ├── data/
    │   ├── categories.js
    │   └── mockExpenses.js
    ├── navigation/
    │   ├── StackNavigator.jsx
    │   └── TabNavigator.jsx
    ├── screens/
    │   ├── ExpenseDetailScreen.jsx
    │   ├── ExpensesScreen.jsx
    │   ├── HomeScreen.jsx
    │   ├── NewExpenseModal.jsx
    │   └── SettingsScreen.jsx
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
- `components/CategoryBadge.jsx` presenta una categoría en la lista y el detalle.
- `components/ExpenseCard.jsx` presenta un gasto y recibe una acción `onPress`; no decide rutas de navegación.
- `components/CategorySelector.jsx` presenta las categorías y comunica la selección mediante una callback. El estado del formulario permanece en `NewExpenseModal`.
- Las pantallas componen estos módulos y siguen siendo responsables de coordinar sus datos y navegación.
- `styles.js` conserva los colores y estilos compartidos. Los estilos que solo usa un componente permanecen junto a ese componente.
- `tsconfig.json` incluye `App.jsx` y `src/**/*.jsx` para que el typecheck también revise módulos JSX. Metro y la configuración Expo ESLint instalados ya reconocen `.jsx`.

No se agregan archivos índice o reexportaciones: los consumidores importan cada módulo directamente para que el origen de cada función o componente siga siendo visible.

## Flujo y compatibilidad

`ExpensesScreen.jsx` obtiene `mockExpenses`, calcula el total y conecta `ExpenseCard.onPress` con la ruta `DetalleGasto`. `ExpenseDetailScreen.jsx` busca el mismo gasto por id y presenta su categoría con `CategoryBadge`. `NewExpenseModal.jsx` mantiene el estado del formulario, entrega las categorías a `CategorySelector` y conserva el flujo actual de validación y respuesta al guardar. Los imports de módulos React usan rutas `.jsx`; los datos, estilos y utilidades conservan `.js`.

Se renombran `App.js`, los componentes, navegadores y pantallas actuales a `.jsx`; `index.js` importa `./App.jsx`. Se mantienen los nombres de rutas y el comportamiento visible de la aplicación. Los consumidores de datos y utilidades, incluida `tests/expense.test.mjs`, actualizan sus imports a los nuevos módulos. Se eliminan `data/expenses.js` y `utils/expense.js` una vez migradas todas sus referencias.

## Alcance

- Sin cambios en persistencia, navegación, validaciones, datos de demostración ni comportamiento visual.
- Sin Context, API remota ni almacenamiento local en este sprint.
- No se crea `database/`: la consigna de Sprint 1 excluye persistencia. Se agregará una capa de datos persistentes cuando esa funcionalidad tenga alcance y tecnología definidos.
- La atomización se limita a responsabilidades reutilizables o con lógica propia; el JSX trivial permanece en su pantalla o componente propietario.

## Criterios de aceptación

1. La estructura objetivo y extensiones existen; `tsconfig.json` incluye todos los módulos JSX y cada módulo cumple la responsabilidad descrita.
2. No quedan referencias a los dos módulos antiguos ni imports rotos.
3. La lista, el detalle, el formulario, la navegación y los mensajes conservan el comportamiento actual.
4. Las aserciones existentes siguen cubriendo el formato, la validación y los datos de ejemplo mediante sus imports nuevos.
5. Los comandos de verificación requeridos por `AGENTS.md` se ejecutan antes de completar la implementación.
