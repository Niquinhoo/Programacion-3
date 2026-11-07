import test from 'node:test';
import assert from 'node:assert/strict';
import { mockExpenses } from '../src/data/mockExpenses.js';
import { formatAmount, filterExpenses, validateExpense } from '../src/utils/expense.js';
import { dateInBuenosAires, validateExpense as validateApiExpense } from '../worker/index.js';

test('seed and display rules match Sprint 1', () => {
  assert.deepEqual(new Set(mockExpenses.map((item) => item.id)), new Set(['1', '2', '3']));
  assert.equal(mockExpenses.reduce((sum, item) => sum + item.amount, 0), 75000);
  assert.equal(formatAmount(25000), '$ 25.000');
  assert.equal(filterExpenses(mockExpenses, { query: 'supermercado' }).length, 1);
});

test('client and Worker reject invalid amounts and accept decimal input', () => {
  assert.match(validateExpense({ name: 'Test', amount: '0', category: 'Otros' }).error, /mayor que cero/);
  assert.equal(validateExpense({ name: 'Test', amount: '250,50', category: 'Otros' }).expense.amount, 250.5);
  assert.match(validateApiExpense(null).error, /inválidos/);
  assert.match(validateApiExpense({ name: 'Test', amount: '0', category: 'Otros' }).error, /mayor que cero/);
  assert.deepEqual(validateApiExpense({ name: ' Test ', amount: '25,50', category: 'Otros' }).expense, { name: 'Test', amount: 25.5, category: 'Otros', notes: null });
});

test('Worker expense dates use the civil day in Buenos Aires across UTC midnight', () => {
  assert.equal(dateInBuenosAires(new Date('2026-10-28T02:30:00.000Z')), '2026-10-27');
});
