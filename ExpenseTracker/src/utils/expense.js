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

export function formatDate(date) {
  return new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
    .format(new Date(`${date}T12:00:00`)).replace(/ de /g, ' ');
}

export function filterExpenses(items, { query = '', period = 'Todos', category = '' }, today = new Date()) {
  const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const search = normalize(query.trim());
  const day = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const monday = new Date(day);
  monday.setDate(day.getDate() - (day.getDay() + 6) % 7);

  return items.filter((expense) => {
    if (category && expense.category !== category) return false;
    if (!normalize(`${expense.name} ${expense.category}`).includes(search)) return false;
    const date = new Date(`${expense.date}T00:00:00`);
    if (period === 'Hoy') return date.getTime() === day.getTime();
    if (period === 'Semana') return date >= monday && date <= day;
    if (period === 'Mes') return date.getMonth() === day.getMonth() && date.getFullYear() === day.getFullYear();
    return true;
  });
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
