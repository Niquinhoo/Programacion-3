import assert from 'node:assert/strict';

// En cua_repl, ejecutar verifyReducedMotion(tab) con la capacidad cdp disponible.
export async function verifyReducedMotion(tab) {
  const cdp = await tab.capabilities.get('cdp');
  await cdp.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
  });

  try {
    await tab.playwright.getByRole('tab', { name: 'Inicio', exact: true }).click();
    const hero = tab.playwright.getByTestId('expense-hero');
    const button = tab.playwright.getByTestId('new-expense-button');
    const expandedHeight = await hero.evaluate(el => el.getBoundingClientRect().height);
    await tab.playwright.getByRole('tab', { name: 'Gastos', exact: true }).click();

    const frames = [];
    const start = Date.now();
    do {
      frames.push({
        height: await hero.evaluate(el => el.getBoundingClientRect().height),
        width: await button.evaluate(el => el.getBoundingClientRect().width),
      });
    } while (Date.now() - start < 500);

    const collapsedHeight = frames.at(-1).height;
    assert.ok(collapsedHeight < expandedHeight - 100);
    assert.ok(frames.every(frame => Math.abs(frame.height - collapsedHeight) < 1), 'El hero debe contraerse sin animación.');
    assert.ok(frames.every(frame => Math.abs(frame.width - 56) < 1), 'El botón debe contraerse sin animación.');

    await tab.playwright.getByRole('button', { name: 'Nuevo gasto', exact: true }).click();
    const sheet = tab.playwright.getByTestId('expense-sheet');
    await sheet.waitFor({ state: 'visible' });
    assert.match(await sheet.evaluate(el => el.style.transform), /translateY\(0(?:px)?\)/);
    await tab.playwright.getByRole('button', { name: 'Volver', exact: true }).click();
    await sheet.waitFor({ state: 'detached' });
    return 'OK: movimiento reducido en hero, botón y panel.';
  } finally {
    await cdp.send('Emulation.setEmulatedMedia', { features: [] });
  }
}
