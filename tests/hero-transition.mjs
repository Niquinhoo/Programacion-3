import assert from 'node:assert/strict';

// En cua_repl, leer la documentación de la capacidad cdp y ejecutar verifyHeroTransition(tab).
export async function verifyHeroTransition(tab) {
  const hero = tab.playwright.getByTestId('expense-hero');
  assert.equal(await hero.count(), 1, 'Inicio y Gastos deben compartir un único hero.');
  await tab.playwright.getByRole('tab', { name: 'Inicio', exact: true }).click();
  const cdp = await tab.capabilities.get('cdp');
  const { root } = await cdp.send('DOM.getDocument', { depth: 0 });
  const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: '[data-testid="expense-hero"]' });
  const height = async () => (await cdp.send('DOM.getBoxModel', { nodeId })).model.height;

  let previousHeight;
  let stableSince = Date.now();
  const deadline = Date.now() + 1500;
  do {
    const currentHeight = await height();
    if (currentHeight !== previousHeight) stableSince = Date.now();
    previousHeight = currentHeight;
  } while (Date.now() - stableSince < 150 && Date.now() < deadline);
  assert.ok(Date.now() - stableSince >= 150, 'Inicio debe estabilizarse antes de medir la transición.');
  assert.doesNotMatch(await hero.innerText(), /DEMO/, 'El hero de Inicio no debe mostrar DEMO.');

  async function waitForHeight(matches, timeout = 1500) {
    const deadline = Date.now() + timeout;
    let value;
    do {
      // Consultar el mismo nodo también detecta si el hero fue desmontado.
      value = await height();
      if (matches(value)) return value;
      await new Promise(resolve => setTimeout(resolve, 20));
    } while (Date.now() < deadline);
    assert.fail(`El hero no alcanzó la altura esperada: ${value}`);
  }

  async function assertHeld(expected) {
    const start = Date.now();
    do {
      const actual = await height();
      assert.ok(Math.abs(actual - expected) <= 1, `El hero debe conservar su posición durante la permanencia: esperado ${expected}, actual ${actual}, transcurridos ${Date.now() - start} ms.`);
      await new Promise(resolve => setTimeout(resolve, 40));
    } while (Date.now() - start < 3200);
  }

  await new Promise(resolve => setTimeout(resolve, 4000));
  const expandedHeight = await height();
  await tab.playwright.getByRole('tab', { name: 'Gastos', exact: true }).click();
  await waitForHeight(value => value < expandedHeight - 20);
  await tab.playwright.getByRole('tab', { name: 'Inicio', exact: true }).click();
  await waitForHeight(value => value < expandedHeight - 200);
  // Dar margen a los últimos píxeles de easing antes de medir la permanencia.
  await new Promise(resolve => setTimeout(resolve, 150));
  const collapsed = await height();
  assert.ok(collapsed < expandedHeight - 200, 'Una orden opuesta no debe interrumpir la contracción.');
  await assertHeld(collapsed);

  await waitForHeight(value => value > collapsed + 20);
  await tab.playwright.getByRole('tab', { name: 'Gastos', exact: true }).click();
  await waitForHeight(value => Math.abs(value - expandedHeight) <= 1);
  await new Promise(resolve => setTimeout(resolve, 100));
  await assertHeld(expandedHeight);
  await waitForHeight(value => Math.abs(value - collapsed) <= 1);
  assert.doesNotMatch(await hero.innerText(), /DEMO/, 'El hero de Gastos no debe mostrar DEMO.');
  assert.equal(await hero.count(), 1, 'Las solicitudes pendientes deben reutilizar el mismo hero.');
  return { expandedHeight, collapsedHeight: collapsed };
}
