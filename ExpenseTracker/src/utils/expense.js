import { categories } from '../data/expenses.js';

const currency = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatAmount(amount) {
  return currency.format(amount).replace(/,00$/, '');
}

export function validateExpense({ name, amount, category }) {
  if (!name.trim()) return { error: 'Ingresá el nombre del gasto.' };

  const value = amount.trim();
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(value)) {
    return { error: 'Ingresá un monto válido, sin separador de miles y con hasta dos decimales.' };
  }

  const [whole, fraction = ''] = value.split(/[.,]/);
  const cents = Number(whole + fraction.padEnd(2, '0'));
  if (!Number.isSafeInteger(cents) || cents <= 0) {
    return { error: 'El monto debe ser mayor que cero y estar dentro del rango permitido.' };
  }
  if (!categories.includes(category)) return { error: 'Seleccioná una categoría válida.' };

  return { expense: { name: name.trim(), amount: cents / 100, category } };
}
