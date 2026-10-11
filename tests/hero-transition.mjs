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

  async function switchTo(name) {
    const frames = [await height()];
    await tab.playwright.getByRole('tab', { name, exact: true }).click();
    const start = Date.now();
    do {
      // Consultar el mismo nodo también detecta si el hero fue desmontado.
      frames.push(await height());
    } while (Date.now() - start < 700);
    const first = frames[0];
    const last = frames.at(-1);
    assert.ok(frames.some(value => value > Math.min(first, last) + 2 && value < Math.max(first, last) - 2), 'La altura debe pasar por valores intermedios.');
    return { first, last };
  }

  const collapse = await switchTo('Gastos');
  assert.ok(collapse.last < collapse.first, 'Gastos debe contraer el hero.');
  assert.doesNotMatch(await hero.innerText(), /DEMO/, 'El hero de Gastos no debe mostrar DEMO.');
  const expand = await switchTo('Inicio');
  assert.ok(expand.last > expand.first, 'Inicio debe desplegar el hero.');
  assert.ok(Math.abs(expand.last - collapse.first) < 1, 'Volver a Inicio debe recuperar la altura original.');

  await tab.playwright.getByRole('tab', { name: 'Gastos', exact: true }).click();
  const start = Date.now();
  let intermediate;
  do { intermediate = await height(); }
  while (intermediate > expand.last - 20 && Date.now() - start < 500);
  assert.ok(intermediate > collapse.last && intermediate < expand.last - 20, 'Debe poder invertirse una transición en curso.');
  await tab.playwright.getByRole('tab', { name: 'Inicio', exact: true }).click();
  assert.ok(await height() < expand.last - 2, 'Invertir la transición no debe saltar a la altura final.');
  const reverseStart = Date.now();
  let final;
  do { final = await height(); }
  while (Date.now() - reverseStart < 700);
  assert.ok(Math.abs(final - expand.last) < 1, 'La transición invertida debe terminar desplegada.');
  return { expandedHeight: expand.last, collapsedHeight: collapse.last };
}
