import { categories } from '../src/data/categories.js';

const json = (data, status = 200) => Response.json(data, { status });

export function dateInBuenosAires(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function validateExpense(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'Datos inválidos.' };
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  if (!name || name.length > 100) return { error: 'Ingresá un nombre de hasta 100 caracteres.' };
  if (typeof input.amount !== 'string' && typeof input.amount !== 'number') return { error: 'Ingresá un monto válido.' };
  const amountText = String(input.amount).trim();
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(amountText)) return { error: 'Ingresá un monto válido, sin separador de miles y con hasta dos decimales.' };
  const [whole, fraction = ''] = amountText.split(/[.,]/);
  const cents = Number(whole + fraction.padEnd(2, '0'));
  if (!Number.isSafeInteger(cents) || cents <= 0) return { error: 'El monto debe ser mayor que cero y estar dentro del rango permitido.' };
  const amount = cents / 100;
  if (!categories.includes(input.category)) return { error: 'Seleccioná una categoría válida.' };
  const notes = input.notes == null ? null : typeof input.notes === 'string' ? input.notes.trim() : undefined;
  if (notes === undefined || notes?.length > 1000) return { error: 'Las notas deben tener hasta 1000 caracteres.' };
  return { expense: { name, amount, category: input.category, notes } };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/expenses' && request.method === 'GET') {
      const { results } = await env.DB.prepare('SELECT id, name, amount, category, date, notes FROM expenses ORDER BY date DESC, id DESC').all();
      return json(results);
    }
    const detail = url.pathname.match(/^\/api\/expenses\/(\d+)$/);
    if (detail && request.method === 'GET') {
      const expense = await env.DB.prepare('SELECT id, name, amount, category, date, notes FROM expenses WHERE id = ?').bind(detail[1]).first();
      return expense ? json(expense) : json({ error: 'No se encontró el gasto.' }, 404);
    }
    if (url.pathname === '/api/expenses' && request.method === 'POST') {
      let input;
      try { input = await request.json(); } catch { return json({ error: 'El cuerpo debe ser JSON válido.' }, 400); }
      const { error, expense } = validateExpense(input);
      if (error) return json({ error }, 400);
      const result = await env.DB.prepare('INSERT INTO expenses (name, amount, category, date, notes) VALUES (?, ?, ?, ?, ?)')
        .bind(expense.name, expense.amount, expense.category, dateInBuenosAires(), expense.notes).run();
      const created = await env.DB.prepare('SELECT id, name, amount, category, date, notes FROM expenses WHERE id = ?').bind(result.meta.last_row_id).first();
      return json(created, 201);
    }
    if (url.pathname.startsWith('/api/')) return json({ error: 'No encontrado.' }, 404);
    return env.ASSETS.fetch(request);
  },
};
