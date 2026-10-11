import assert from 'node:assert/strict';

// En cua_repl, leer la documentación de cdp y ejecutar verifyNewExpenseButton(tab).
export async function verifyNewExpenseButton(tab) {
  const button = tab.playwright.getByRole('button', { name: 'Nuevo gasto', exact: true });
  const cdp = await tab.capabilities.get('cdp');
  const bounds = async () => {
    const { root } = await cdp.send('DOM.getDocument', { depth: 0 });
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: '[data-testid="new-expense-button"]' });
    const { nodeId: tabsId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: '[role="tablist"]' });
    const { model: rect } = await cdp.send('DOM.getBoxModel', { nodeId });
    const { model: tabs } = await cdp.send('DOM.getBoxModel', { nodeId: tabsId });
    return { x: rect.border[0], y: rect.border[1], width: rect.width, height: rect.height, gap: tabs.border[1] - rect.border[5], right: tabs.border[2] - rect.border[2] };
  };
  for (const name of ['Gastos', 'Ajustes']) {
    await tab.playwright.getByRole('tab', { name, exact: true }).press('Return');
    await button.waitFor({ state: 'visible' });
    const { root } = await cdp.send('DOM.getDocument', { depth: 0 });
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: '[data-testid="new-expense-button"]' });
    const start = Date.now();
    do { await cdp.send('DOM.getBoxModel', { nodeId }); } while (Date.now() - start < 900);
    assert.equal(await button.count(), 1);
    const position = await bounds();
    assert.equal(position.width, 56);
    assert.equal(position.height, 56);
    assert.ok(position.gap >= 16, 'La burbuja debe quedar sobre la barra de pestañas.');
    assert.ok(position.right >= 20, 'La burbuja debe respetar el margen derecho.');
    await button.press('Return');
    await tab.playwright.getByRole('dialog', { name: 'Nuevo gasto', exact: true }).waitFor({ state: 'visible' });
    await tab.playwright.getByRole('button', { name: 'Volver', exact: true }).press('Return');
    await tab.playwright.getByTestId('expense-sheet').waitFor({ state: 'detached' });
    assert.deepEqual(await bounds(), position, 'Cerrar el formulario debe conservar la posición de la burbuja.');
  }
  await tab.playwright.getByRole('tab', { name: 'Inicio', exact: true }).press('Return');
  await button.waitFor({ state: 'detached' });
  assert.ok(await tab.playwright.getByRole('button', { name: 'Cargar un gasto', exact: true }).isVisible());
  return 'OK: burbuja en Gastos y Ajustes, formulario y botón ancho en Inicio.';
}
