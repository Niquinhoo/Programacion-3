const cacheName = 'expense-tracker-expenses-v1';
const listPath = '/api/expenses';

async function cachedExpenses() {
  try {
    const cache = await globalThis.caches?.open(cacheName);
    const response = await cache?.match(listPath);
    return response ? await response.json() : null;
  } catch { return null; }
}

async function saveSnapshot(expenses) {
  try {
    const cache = await globalThis.caches?.open(cacheName);
    await cache?.put(listPath, Response.json(expenses));
  } catch { /* La falta de espacio o permisos no invalida una operación online exitosa. */ }
}

async function request(path, options) {
  if (!navigator.onLine) throw new TypeError('Sin conexión. Reconectate para guardar el gasto.');
  let response;
  try { response = await fetch(path, { redirect: 'manual', ...options }); }
  catch { throw new TypeError('Sin conexión. Revisá tu conexión e intentá de nuevo.'); }
  if (response.type === 'opaqueredirect' || response.redirected || response.status === 401 || response.status === 403 || response.headers.get('content-type')?.includes('text/html')) {
    try { await globalThis.caches?.delete(cacheName); } catch { /* La sesión debe fallar aunque el almacenamiento esté bloqueado. */ }
    throw new Error('No se pudo verificar el acceso. Iniciá sesión de nuevo con conexión.');
  }
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'No se pudo completar la solicitud.');
  return data;
}

export async function getExpenses() {
  try {
    const expenses = await request(listPath);
    if (!Array.isArray(expenses)) throw new Error('El servidor no devolvió una lista de gastos válida.');
    await saveSnapshot(expenses);
    return { expenses, offline: false };
  } catch (error) {
    if (!(error instanceof TypeError)) throw error;
    const expenses = await cachedExpenses();
    if (!expenses) throw new Error('No hay una copia de los gastos sin conexión. Abrí la app con internet primero.');
    return { expenses, offline: true };
  }
}

export async function getExpense(id) {
  try { return await request(`${listPath}/${encodeURIComponent(id)}`); }
  catch (error) {
    if (!(error instanceof TypeError)) throw error;
    const expenses = await cachedExpenses();
    if (!expenses) throw new Error('No hay una copia de los gastos sin conexión. Abrí la app con internet primero.');
    const expense = expenses.find((item) => String(item.id) === String(id));
    if (!expense) throw new Error('No se encontró el gasto en la copia sin conexión.');
    return expense;
  }
}

export async function createExpense(expense) {
  const created = await request(listPath, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(expense),
  });
  const previous = await cachedExpenses() || [];
  await saveSnapshot([created, ...previous.filter((item) => String(item.id) !== String(created.id))]);
  return created;
}
