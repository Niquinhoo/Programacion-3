import assert from 'node:assert/strict';

// En cua_repl, leer la documentación de cdp y ejecutar verifyExpenseSheets(tab).
export async function verifyExpenseSheets(tab) {
  const sheet = tab.playwright.getByTestId('expense-sheet');
  const cdp = await tab.capabilities.get('cdp');
  await tab.playwright.getByRole('tab', { name: 'Gastos', exact: true }).click();
  let previousHeight;
  let stableSince = Date.now();
  const deadline = Date.now() + 1000;
  do {
    const height = await tab.playwright.getByTestId('expense-hero').evaluate(el => el.getBoundingClientRect().height);
    if (height !== previousHeight) stableSince = Date.now();
    previousHeight = height;
  } while (Date.now() - stableSince < 100 && Date.now() < deadline);
  assert.ok(Date.now() - stableSince >= 100, 'Esperar a que termine la transición de pestañas antes de tocar el formulario.');
  const search = tab.playwright.getByPlaceholder('Buscar gastos, comercios o categorías...');
  await search.fill('Supermercado');
  await tab.playwright.getByRole('button', { name: 'Ver detalle de Combustible, $ 18.000', exact: true }).waitFor({ state: 'hidden' });

  async function open(button, title) {
    await tab.playwright.getByRole('button', { name: button, exact: true }).click();
    await sheet.waitFor({ state: 'attached' });
    const offsets = [];
    const start = Date.now();
    do {
      const transform = await sheet.evaluate(el => el.style.transform);
      offsets.push(Number.parseFloat(transform.slice('translateY('.length)));
    } while (Date.now() - start < 600);
    assert.equal(await sheet.count(), 1);
    assert.equal(await tab.playwright.getByRole('dialog', { name: title }).count(), 1);
    assert.ok(offsets.some(offset => offset > 2), 'El panel debe pasar por posiciones intermedias al subir.');
    assert.equal(offsets.at(-1), 0);
    assert.equal(await tab.playwright.evaluate(() => document.documentElement.scrollTop + document.body.scrollTop), 0, 'Dar foco al panel no debe desplazar la página.');
    const { root } = await cdp.send('DOM.getDocument', { depth: 0 });
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: '[data-testid="expense-sheet"]' });
    const box = (await cdp.send('DOM.getBoxModel', { nodeId })).model;
    assert.ok(box.border[1] >= 64, 'Debe quedar una zona superior para cerrar.');
    return box.height;
  }

  const formHeight = await open('Nuevo gasto', 'Nuevo gasto');
  assert.doesNotMatch(await sheet.innerText(), /NUEVO MOVIMIENTO|demostración|Demo:/, 'La vista inicial debe conservar los textos limpios.');
  await tab.playwright.getByRole('button', { name: 'Guardar', exact: true }).click();
  assert.match(await tab.playwright.getByRole('alert').innerText(), /nombre/i);
  await tab.playwright.getByPlaceholder('Ej.: Supermercado').fill('Prueba');
  await tab.playwright.getByPlaceholder('Ej.: 25000,50').fill('25.000');
  await tab.playwright.getByRole('button', { name: 'Guardar', exact: true }).click();
  assert.doesNotMatch(await tab.playwright.getByRole('alert').innerText(), /Formulario enviado/);
  await tab.playwright.getByPlaceholder('Ej.: 25000,50').fill('25000,50');
  await tab.playwright.getByRole('radio', { name: 'Otros', exact: true }).click();
  await tab.playwright.getByRole('button', { name: 'Guardar', exact: true }).click();
  assert.match(await tab.playwright.getByRole('alert').innerText(), /25\.000,50.*Otros.*no guarda/);
  await tab.playwright.getByRole('button', { name: 'Volver', exact: true }).click();
  await sheet.waitFor({ state: 'detached' });
  assert.equal(await search.evaluate(el => el.value), 'Supermercado');

  const detailHeight = await open('Ver detalle de Supermercado, $ 25.000', 'Detalle del gasto');
  assert.ok(detailHeight < formHeight, 'El detalle debe ser más compacto que el formulario.');
  assert.match(await sheet.innerText(), /Supermercado.*25\.000.*Alimentos.*10 oct 2026/s);
  await tab.playwright.getByTestId('sheet-backdrop').click();
  await sheet.waitFor({ state: 'detached' });
  assert.equal(await search.evaluate(el => el.value), 'Supermercado');

  await open('Nuevo gasto', 'Nuevo gasto');
  const back = tab.playwright.getByRole('button', { name: 'Volver', exact: true });
  await back.press('Shift+Tab');
  assert.equal(await tab.playwright.evaluate(() => document.activeElement.getAttribute('aria-label')), 'Guardar', 'Tab debe permanecer dentro del panel.');
  await tab.playwright.getByRole('button', { name: 'Guardar', exact: true }).press('Escape');
  await sheet.waitFor({ state: 'detached' });
  await search.fill('');
  return { formHeight, detailHeight };
}
