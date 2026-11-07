async function request(path, options) {
  const response = await fetch(path, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'No se pudo completar la solicitud.');
  return data;
}

export const getExpenses = () => request('/api/expenses');
export const getExpense = (id) => request(`/api/expenses/${encodeURIComponent(id)}`);
export const createExpense = (expense) => request('/api/expenses', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(expense),
});
