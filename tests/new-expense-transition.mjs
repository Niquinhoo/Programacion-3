import assert from 'node:assert/strict';

// En cua_repl, leer la documentación de cdp y ejecutar verifyNewExpenseTransition(tab).
export async function verifyNewExpenseTransition(tab) {
  await tab.playwright.getByRole('tab', { name: 'Inicio', exact: true }).press('Return');
  const cdp = await tab.capabilities.get('cdp');
  const { root } = await cdp.send('DOM.getDocument', { depth: 0 });
  const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: '[data-testid="new-expense-button"]' });
  const collect = async () => {
    const frames = [];
    const start = Date.now();
    do {
      const { model } = await cdp.send('DOM.getBoxModel', { nodeId });
      frames.push({ width: model.width, y: model.border[1] });
    } while (Date.now() - start < 900);
    return frames;
  };
  const initial = await collect();
  const width = initial.at(-1).width;
  for (const [name, expanding] of [['Gastos', false], ['Inicio', true]]) {
    await tab.playwright.getByRole('tab', { name, exact: true }).press('Return');
    const frames = await collect();
    assert.ok(frames.some(frame => frame.width > 58 && frame.width < width - 2), 'El botón debe pasar por anchos intermedios.');
    const final = frames.at(-1);
    assert.ok(Math.abs(final.width - (expanding ? width : 56)) < 1);
    const settledWidth = frames.filter(frame => Math.abs(frame.width - final.width) < 1);
    assert.ok(settledWidth.some(frame => frame.y < final.y - 3), 'Después de cambiar de ancho debe dar un salto y volver a su posición.');
  }
  return 'OK: contracción, despliegue y salto final en ambos sentidos.';
}
