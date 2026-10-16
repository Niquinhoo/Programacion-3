import assert from 'node:assert/strict';

// En cua_repl, ejecutar verifyHeroScroll(tab) con la capacidad cdp disponible.
export async function verifyHeroScroll(tab) {
  const cdp = await tab.capabilities.get('cdp');
  await tab.playwright.getByRole('tab', { name: 'Inicio', exact: true }).click();
  const heading = tab.playwright.getByText('Movimientos recientes', { exact: true });
  const snapshot = () => heading.evaluate(el => {
    let scroll = el.parentElement;
    while (scroll && !['auto', 'scroll'].includes(getComputedStyle(scroll).overflowY)) scroll = scroll.parentElement;
    const rect = scroll.getBoundingClientRect();
    const hero = document.querySelector('[data-testid="expense-hero"]').getBoundingClientRect();
    const rows = [...scroll.querySelectorAll('[role="button"]')].filter(row => row.getAttribute('aria-label')?.startsWith('Ver detalle'));
    const tabs = document.querySelector('[role="tablist"]');
    const bar = tabs.getBoundingClientRect();
    return { height: hero.height, bottom: hero.bottom, y: scroll.scrollTop, x: rect.x + rect.width / 2, wheelY: rect.y + Math.min(80, rect.height / 2), viewportHeight: rect.height, top: rect.top, rows: rows.map(row => { const r = row.getBoundingClientRect(); return { top: r.top, bottom: r.bottom }; }), viewportBottom: rect.bottom, bar: { top: bar.top, height: bar.height }, tabs: [...tabs.querySelectorAll('[role="tab"]')].map(el => { const r = el.getBoundingClientRect(); return { x: r.x, width: r.width, direction: getComputedStyle(el).flexDirection }; }) };
  });
  async function scrollBy(deltaY) {
    const state = await snapshot();
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: state.x, y: state.wheelY });
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: state.x, y: state.wheelY, deltaX: 0, deltaY });
    const frames = [];
    const start = Date.now();
    do { frames.push(await snapshot()); } while (Date.now() - start < 900);
    return frames;
  }

  await scrollBy(-1000);
  const expanded = await snapshot();
  const frames = await scrollBy(40);
  const collapsed = frames.at(-1);
  assert.ok(collapsed.height < expanded.height - 100, `El scroll de Inicio debe contraer el hero: ${JSON.stringify({ expanded, collapsed })}`);
  assert.ok(frames.some(frame => frame.height > collapsed.height + 2 && frame.height < expanded.height - 2), 'Debe reutilizar la animación con alturas intermedias.');
  assert.ok(collapsed.viewportHeight > expanded.viewportHeight + 100, 'La contracción debe liberar espacio real para los movimientos.');
  assert.ok(collapsed.top >= collapsed.bottom - 1, 'Los movimientos no deben quedar detrás del hero.');
  assert.ok(collapsed.rows.length === 3 && collapsed.rows.every(row => row.top >= collapsed.top && row.bottom <= collapsed.viewportBottom), 'Los tres movimientos deben quedar visibles.');
  assert.deepEqual(collapsed.bar, expanded.bar, 'La barra inferior debe conservar su altura y posición.');
  assert.deepEqual(collapsed.tabs, expanded.tabs, 'Los tabs deben conservar distribución y orientación al contraer el hero.');
  assert.ok(collapsed.tabs.every(item => item.direction === 'column'), 'Las etiquetas deben permanecer debajo de los iconos.');
  assert.match(await tab.playwright.getByTestId('expense-hero').innerText(), /TOTAL DE GASTOS/);
  assert.equal(await tab.playwright.getByRole('button', { name: 'Ver visión general de los gastos', exact: true }).count(), 0, 'La acción oculta no debe quedar accesible.');

  await scrollBy(1000);
  assert.ok(Math.abs((await snapshot()).height - collapsed.height) < 1, 'Llegar al final no debe reexpandir el hero por el cambio de altura.');
  await scrollBy(-1000);
  assert.ok(Math.abs((await snapshot()).height - collapsed.height) < 1, 'El hero debe ignorar el gesto opuesto durante los 3,5 segundos de permanencia.');
  await new Promise(resolve => setTimeout(resolve, 3600));
  const restored = (await scrollBy(-1000)).at(-1);
  assert.ok(Math.abs(restored.height - expanded.height) < 1, 'Volver arriba debe expandir el hero.');
  await scrollBy(40);
  assert.ok(Math.abs((await snapshot()).height - expanded.height) < 1, 'El hero también debe permanecer expandido durante el bloqueo.');
  return { expandedHeight: expanded.height, collapsedHeight: collapsed.height };
}
