import { categories } from '../data/categories.js';

const currency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 });
const dateFormatter = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export const formatAmount = (amount) => currency.format(amount).replace(/,00$/, '');
export const formatDate = (date) => dateFormatter.format(new Date(`${date}T12:00:00`)).replace(/ de /g, ' ');

export function filterExpenses(items, { query = '', period = 'Todos', category = '' }, today = new Date()) {
  const search = normalize(query.trim());
  const day = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const monday = new Date(day);
  monday.setDate(day.getDate() - ((day.getDay() + 6) % 7));
  return items.filter((expense) => {
    if (category && expense.category !== category) return false;
    if (search && !normalize(`${expense.name} ${expense.category}`).includes(search)) return false;
    if (period === 'Todos') return true;
    const date = new Date(`${expense.date}T00:00:00`);
    if (period === 'Hoy') return date.getTime() === day.getTime();
    if (period === 'Semana') return date >= monday && date <= day;
    if (period === 'Mes') return date.getMonth() === day.getMonth() && date.getFullYear() === day.getFullYear();
    return true;
  });
}

export function validateExpense({ name, amount, category, notes }) {
  const trimmedName = name.trim();
  if (!trimmedName) return { error: 'Ingresá el nombre del gasto.' };
  if (trimmedName.length > 100) return { error: 'El nombre no puede superar los 100 caracteres.' };
  const value = amount.trim();
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(value)) return { error: 'Ingresá un monto válido, sin separador de miles y con hasta dos decimales.' };
  const [whole, fraction = ''] = value.split(/[.,]/);
  const cents = Number(whole + fraction.padEnd(2, '0'));
  if (!Number.isSafeInteger(cents) || cents <= 0) return { error: 'El monto debe ser mayor que cero y estar dentro del rango permitido.' };
  if (!categories.includes(category)) return { error: 'Seleccioná una categoría válida.' };
  if (notes && notes.length > 1000) return { error: 'Las notas no pueden superar los 1000 caracteres.' };
  return { expense: { name: trimmedName, amount: cents / 100, category, notes: notes?.trim() || null } };
}
