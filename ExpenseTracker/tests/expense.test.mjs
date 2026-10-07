import assert from 'node:assert/strict';
import { categories, expenses } from '../src/data/expenses.js';
import { formatAmount, validateExpense } from '../src/utils/expense.js';

const input = { name: '  Supermercado  ', amount: '25000,50', category: categories[0] };
assert.deepEqual(validateExpense(input).expense, {
  name: 'Supermercado', amount: 25000.5, category: 'Alimentos',
});
assert.equal(validateExpense({ ...input, amount: ' 25000.50 ' }).expense.amount, 25000.5);
assert.equal(validateExpense({ ...input, amount: '0,01' }).expense.amount, 0.01);
assert.equal(validateExpense({ ...input, amount: '25' }).expense.amount, 25);
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
console.log('OK: formulario, montos ARS y gastos de ejemplo.');
