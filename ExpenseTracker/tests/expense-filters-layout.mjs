import assert from 'node:assert/strict';

// En cua_repl, ejecutar verifyExpenseFiltersLayout(tab) en los anchos móviles de la demo.
export async function verifyExpenseFiltersLayout(tab) {
  await tab.playwright.getByRole('tab', { name: 'Gastos', exact: true }).click();
  const hero = tab.playwright.getByTestId('expense-hero');
  let previousHeight;
  let stableSince = Date.now();
  const deadline = Date.now() + 1500;
  do {
    const height = await hero.evaluate(el => el.getBoundingClientRect().height);
    if (height !== previousHeight) stableSince = Date.now();
    previousHeight = height;
  } while (Date.now() - stableSince < 150 && Date.now() < deadline);
  assert.ok(Date.now() - stableSince >= 150, 'Esperar a que los filtros terminen de moverse con el hero.');
  const periods = [];
  for (const name of ['Todos', 'Hoy', 'Semana', 'Mes']) {
    periods.push(await tab.playwright.getByRole('button', { name, exact: true }).evaluate(el => {
      const rect = el.getBoundingClientRect();
      return { x: rect.x, y: rect.y, right: rect.right, width: rect.width, height: rect.height };
    }));
  }
  assert.ok(periods.every(rect => Math.abs(rect.width - periods[0].width) < 1), 'Los filtros de período deben tener el mismo ancho.');
  assert.ok(periods.every(rect => rect.width >= 44 && rect.height >= 44 && Math.abs(rect.y - periods[0].y) < 1), 'Los filtros deben mantener una fila y un área táctil de al menos 44 px.');
  assert.doesNotMatch(await hero.innerText(), /DEMO/);

  const categories = tab.playwright.getByRole('button', { name: 'Filtrar por categoría', exact: true });
  const bounds = () => categories.evaluate(el => {
    const rect = el.getBoundingClientRect();
    return { x: rect.x, y: rect.y, right: rect.right, width: rect.width, height: rect.height };
  });
  const initial = await bounds();
  const right = await tab.playwright.getByPlaceholder('Buscar gastos, comercios o categorías...')
    .evaluate(el => el.parentElement.getBoundingClientRect().right);
  assert.ok(initial.x >= periods.at(-1).right, 'Categorías debe quedar después de los períodos.');
  assert.ok(Math.abs(initial.right - right) < 1, 'Categorías debe quedar alineada con el borde derecho.');
  assert.ok(Math.abs(initial.y - periods[0].y) < 1 && initial.height >= 44);

  for (const name of ['Todos', 'Hoy', 'Semana', 'Mes']) {
    const filter = tab.playwright.getByRole('button', { name, exact: true });
    await filter.click();
    const width = await filter.evaluate(el => el.getBoundingClientRect().width);
    assert.ok(Math.abs(width - periods[0].width) < 1, 'Seleccionar un período no debe cambiar su ancho.');
    assert.deepEqual(await bounds(), initial, 'Seleccionar un período no debe mover Categorías.');
  }
  await tab.playwright.getByRole('button', { name: 'Todos', exact: true }).click();

  await categories.click();
  await tab.playwright.getByRole('button', { name: 'Otros', exact: true }).click();
  assert.deepEqual(await bounds(), initial, 'Seleccionar una categoría no debe mover su botón.');
  await tab.playwright.getByRole('button', { name: 'Todas', exact: true }).click();
  await categories.click();
  return { periodWidth: periods[0].width, categoryRight: initial.right };
}
