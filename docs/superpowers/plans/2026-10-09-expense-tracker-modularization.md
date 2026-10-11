# ExpenseTracker Modularization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split ExpenseTracker's data, utilities, and reusable UI into focused modules while preserving its current behavior.

**Architecture:** Keep the existing folder-by-role structure. React files that contain JSX use `.jsx`; data, styles, and pure logic stay `.js`. Separate categories from demo data, separate formatting from validation, and extract repeated expense and category UI into components. Screens retain state and navigation decisions.

**Tech Stack:** Expo, React Native, React Navigation, JavaScript and JSX, Node's built-in `assert` tests.

**Spec:** `docs/superpowers/specs/2026-10-09-expense-tracker-modular-architecture-design.md`

## Global Constraints

- Los módulos React que contienen JSX usan extensión `.jsx`: `App`, componentes, navegación y pantallas. Datos, estilos y lógica sin JSX usan `.js`.
- Sin cambios en persistencia, navegación, validaciones, datos de demostración ni comportamiento visual.
- Sin Context, API remota ni almacenamiento local en este sprint.
- No se crea `database/`: la consigna de Sprint 1 excluye persistencia. Se agregará una capa de datos persistentes cuando esa funcionalidad tenga alcance y tecnología definidos.
- La atomización se limita a responsabilidades reutilizables o con lógica propia; el JSX trivial permanece en su pantalla o componente propietario.
- `styles.js` conserva los colores y estilos compartidos. Los estilos que solo usa un componente permanecen junto a ese componente.
- Los comandos de verificación requeridos por `AGENTS.md` se ejecutan antes de completar la implementación.
- `index.js` conserva `.js` e importa `./App.jsx`; `tsconfig.json` incluye `App.jsx` y `src/**/*.jsx`.
- Metro y la configuración Expo ESLint instalados reconocen `.jsx`; no requieren cambios de configuración.

## Review Focus

- Valid inputs with comma or dot decimals keep their current cent values — existing assertions in `tests/expense.test.mjs` cover these.
- Invalid amount formats, zero, and values outside the safe range keep returning the current errors — existing assertions cover these.
- Valid and invalid categories keep their current validation behavior — existing assertions cover both.
- Demo expense ids, values, category membership, and totals remain unchanged — existing assertions cover these.
- The extracted category selector keeps the radio group, selected state, and accessible labels; expense cards keep the current accessible label and route parameter — inspect these props and handlers during integration, then exercise both flows in Expo Go.
- TypeScript's JavaScript checker must include all `.jsx` files after the renames — `npm run typecheck` covers the configured include set.

---

### Task 1: Split demo data and expense utilities

**Files:**
- Create: `ExpenseTracker/src/data/categories.js`
- Create: `ExpenseTracker/src/data/mockExpenses.js`
- Create: `ExpenseTracker/src/utils/formatAmount.js`
- Create: `ExpenseTracker/src/utils/validateExpense.js`
- Modify: `ExpenseTracker/src/screens/ExpensesScreen.js`
- Modify: `ExpenseTracker/src/screens/ExpenseDetailScreen.js`
- Modify: `ExpenseTracker/src/screens/NewExpenseModal.js`
- Modify: `ExpenseTracker/tests/expense.test.mjs`
- Delete: `ExpenseTracker/src/data/expenses.js`
- Delete: `ExpenseTracker/src/utils/expense.js`

**Interfaces:**
- `categories.js` produces the existing `categories` array.
- `mockExpenses.js` produces the existing three-item array as `mockExpenses`.
- `formatAmount.js` exports `formatAmount(amount)` with the same ARS output.
- `validateExpense.js` exports `validateExpense({ name, amount, category })` with the same result shape, rules, and error messages; it imports `categories` from `../data/categories.js`.
- Screens and `tests/expense.test.mjs` import each value from its new direct module path; the test's `expenses` binding becomes `mockExpenses` and its assertions stay unchanged.

- [ ] **Step 1: Create the four focused modules**

Move the existing constants and function bodies without changing values, messages, or calculations. Data and utility imports keep `.js` extensions.

- [ ] **Step 2: Update every consumer and remove the old modules**

Update the three screens and `tests/expense.test.mjs`. Search the repository for imports of `data/expenses` and `utils/expense`; remove the two old files only when no references remain.

- [ ] **Step 3: Check the existing behavior assertions**

Run: `npm test` from `ExpenseTracker/`.
Expected: the existing expense assertions pass with the new imports and no assertion changes.

- [ ] **Step 4: Commit the data and utility split**

```bash
git add ExpenseTracker/src/data ExpenseTracker/src/utils ExpenseTracker/src/screens ExpenseTracker/tests/expense.test.mjs
git commit -m "refactor: split expense data and utilities"
```

### Task 2: Extract reusable expense and category UI

**Files:**
- Rename: `ExpenseTracker/App.js` → `ExpenseTracker/App.jsx`
- Rename: `ExpenseTracker/src/components/ActionButton.js` → `ExpenseTracker/src/components/ActionButton.jsx`
- Rename: `ExpenseTracker/src/components/Screen.js` → `ExpenseTracker/src/components/Screen.jsx`
- Rename: `ExpenseTracker/src/navigation/StackNavigator.js` → `ExpenseTracker/src/navigation/StackNavigator.jsx`
- Rename: `ExpenseTracker/src/navigation/TabNavigator.js` → `ExpenseTracker/src/navigation/TabNavigator.jsx`
- Rename: `ExpenseTracker/src/screens/ExpenseDetailScreen.js` → `ExpenseTracker/src/screens/ExpenseDetailScreen.jsx`
- Rename: `ExpenseTracker/src/screens/ExpensesScreen.js` → `ExpenseTracker/src/screens/ExpensesScreen.jsx`
- Rename: `ExpenseTracker/src/screens/HomeScreen.js` → `ExpenseTracker/src/screens/HomeScreen.jsx`
- Rename: `ExpenseTracker/src/screens/NewExpenseModal.js` → `ExpenseTracker/src/screens/NewExpenseModal.jsx`
- Rename: `ExpenseTracker/src/screens/SettingsScreen.js` → `ExpenseTracker/src/screens/SettingsScreen.jsx`
- Create: `ExpenseTracker/src/components/CategoryBadge.jsx`
- Create: `ExpenseTracker/src/components/ExpenseCard.jsx`
- Create: `ExpenseTracker/src/components/CategorySelector.jsx`
- Modify: `ExpenseTracker/index.js`
- Modify: `ExpenseTracker/tsconfig.json`

**Interfaces:**
- `CategoryBadge({ category })` in `CategoryBadge.jsx` renders the existing muted category text used by list and detail.
- `ExpenseCard({ expense, onPress })` renders the expense name, `CategoryBadge`, and `formatAmount(expense.amount)` in a `Pressable` with role `button` and the current label `Ver detalle de ${expense.name}, ${formatAmount(expense.amount)}`; it imports `formatAmount` and receives the callback from its screen.
- `CategorySelector({ categories, selectedCategory, onSelect })` in `CategorySelector.jsx` renders a group with role `radiogroup` and label `Categoría`; each option has role `radio`, `aria-checked={selectedCategory === category}`, and calls `onSelect(category)`. It owns no form state.
- `ExpensesScreen` retains the `DetalleGasto` navigation call and passes the current expense id through `ExpenseCard.onPress`.
- `NewExpenseModal` retains the category state and passes it to `CategorySelector`.
- Imports between React files use explicit `.jsx` extensions; imports of data, styles, and pure logic use `.js`.
- `index.js` imports `./App.jsx`. `tsconfig.json` includes `App.jsx`, `index.js`, `src/**/*.js`, and `src/**/*.jsx`.

- [ ] **Step 1: Extract the presentational components**

Move the existing JSX and local styles for the expense pressable and category radio options into the named `.jsx` components. Keep current accessibility roles, labels, selected-state attributes, text, and styling.

- [ ] **Step 2: Compose the screens from the components**

Rename `App`, all current components, navigators, and screens to `.jsx`; update all affected imports with explicit extensions. Use `ExpenseCard` in the list, `CategoryBadge` in list and detail, and `CategorySelector` in the form. Keep screen state, total calculation, save handling, and navigation in their current screens. Update `index.js` and `tsconfig.json` as specified.

- [ ] **Step 3: Review imports and changed behavior surface**

Search for deleted inline markup and old module paths. Confirm route names and params are unchanged, no component imports navigation, and `git diff --check` reports no whitespace errors.

- [ ] **Step 4: Commit the component extraction**

```bash
git add -A -- ExpenseTracker/App.js ExpenseTracker/App.jsx ExpenseTracker/index.js ExpenseTracker/tsconfig.json ExpenseTracker/src/components ExpenseTracker/src/navigation ExpenseTracker/src/screens
git commit -m "refactor: extract expense and category components"
```

### Task 3: Final project checks

**Files:**
- Verify: `ExpenseTracker/src/`
- Verify: `ExpenseTracker/tests/expense.test.mjs`

- [ ] **Step 1: Run required project checks**

From `ExpenseTracker/`, run `npm test`, `npm run lint`, `npm run typecheck`, and `npx expo-doctor`.
Expected: each command completes successfully. Start Expo and open the app in Expo Go; check the expense list, open a detail, select a category in the form, and confirm the save and validation messages. Do not use a web run as Expo Go evidence.

- [ ] **Step 2: Check final repository state**

Run `git status --short` and confirm only intended architecture changes remain.
