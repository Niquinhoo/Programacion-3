import assert from 'node:assert/strict';
import { categories, expenses } from '../src/data/expenses.js';
import { filterExpenses, formatAmount, formatDate, validateExpense } from '../src/utils/expense.js';

const input = { name: '  Supermercado  ', amount: '25000,50', category: categories[0] };
assert.deepEqual(validateExpense(input), {
  expense: { name: 'Supermercado', amount: 25000.5, category: 'Alimentos' },
});
assert.equal(validateExpense({ ...input, amount: ' 25000.50 ' }).expense.amount, 25000.5);
assert.equal(validateExpense({ ...input, amount: '0,01' }).expense.amount, 0.01);
assert.equal(validateExpense({ ...input, amount: '25' }).expense.amount, 25);
assert.equal(input.name, '  Supermercado  ', 'Validar no debe modificar los campos originales.');
assert.equal(validateExpense({ ...input, amount: '00025,5' }).expense.amount, 25.5);
for (const amount of ['', '0', '-1', '25.000', '1,234', '1.2.3', 'NaN', 'Infinity', '1e3', '0x10', '999999999999999999']) {
  assert.ok(validateExpense({ ...input, amount }).error, `Debe rechazar ${amount}`);
}
assert.ok(validateExpense({ ...input, name: '   ' }).error);
assert.ok(validateExpense({ ...input, category: 'Desconocida' }).error);

assert.equal(expenses.reduce((sum, expense) => sum + expense.amount, 0), 75000);
assert.equal(new Set(expenses.map((expense) => expense.id)).size, expenses.length);
assert.ok(expenses.every((expense) => categories.includes(expense.category)));

assert.match(formatAmount(25000), /25\.000/);
assert.match(formatAmount(25000.5), /25\.000,50/);
assert.match(formatDate('2026-10-10'), /^10 oct\.? 2026$/);
assert.match(formatDate('2026-01-01'), /^1 ene\.? 2026$/);
assert.match(formatDate('2026-12-31'), /^31 dic\.? 2026$/);

const movements = [
  { id: 'a', name: 'Café', category: 'Otros', date: '2026-10-11' },
  { id: 'b', name: 'Supermercado', category: 'Alimentos', date: '2026-10-08' },
  { id: 'c', name: 'Internet', category: 'Servicios', date: '2026-10-04' },
  { id: 'd', name: 'Café', category: 'Otros', date: '2026-09-30' },
  { id: 'e', name: 'Combustible', category: 'Transporte', date: '2026-10-12' },
];
const today = new Date(2026, 9, 11, 23, 30);
assert.deepEqual(filterExpenses(movements, { query: ' CAFE ' }, today).map(item => item.id), ['a', 'd']);
assert.deepEqual(filterExpenses(movements, { query: 'servicios' }, today).map(item => item.id), ['c']);
assert.deepEqual(filterExpenses(movements, { period: 'Hoy' }, today).map(item => item.id), ['a']);
assert.deepEqual(filterExpenses(movements, { period: 'Semana' }, today).map(item => item.id), ['a', 'b']);
assert.deepEqual(filterExpenses(movements, { period: 'Mes', category: 'Otros' }, today).map(item => item.id), ['a']);
assert.deepEqual(filterExpenses(movements, { query: 'inexistente' }, today), []);
assert.deepEqual(filterExpenses(movements, {}, today), movements);
assert.deepEqual(filterExpenses(movements, { period: 'Mes' }, new Date(2027, 9, 11)), []);
assert.deepEqual(filterExpenses(movements, { period: 'Semana' }, new Date(2026, 9, 12)).map(item => item.id), ['e']);
assert.deepEqual(filterExpenses(movements, { query: ' cafe ', period: 'Mes', category: 'Otros' }, today).map(item => item.id), ['a']);
assert.deepEqual(filterExpenses(movements, { period: 'Desconocido' }, today), movements);
assert.deepEqual(filterExpenses([], { query: 'cafe', period: 'Semana' }, today), []);
const yearBoundary = [
  { name: 'Diciembre', category: 'Otros', date: '2025-12-29' },
  { name: 'Año nuevo', category: 'Otros', date: '2026-01-01' },
  { name: 'Futuro', category: 'Otros', date: '2026-01-02' },
];
assert.deepEqual(filterExpenses(yearBoundary, { period: 'Semana' }, new Date(2026, 0, 1)), yearBoundary.slice(0, 2));
assert.equal(movements.length, 5, 'Filtrar no debe modificar la lista original.');
console.log('OK: formulario, montos ARS, gastos de ejemplo, búsqueda y filtros.');
