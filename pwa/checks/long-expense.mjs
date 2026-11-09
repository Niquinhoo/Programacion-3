import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); }
catch { playwright = require(process.env.PLAYWRIGHT_MODULE || resolve(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); }
const browser = await playwright.chromium.launch({ headless: true, channel: 'chrome' });
try {
  const page = await browser.newPage();
  await page.route('**/api/expenses', route => route.fulfill({ json: [{ id: '1', name: 'Un nombre de gasto muy largo que debe terminar en puntos suspensivos', amount: 90071992547409.91, category: 'Otros', date: '2026-11-09' }] }));
  for (const width of [320, 390, 600]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('http://127.0.0.1:5173/expenses');
    const card = page.locator('.listing-page .expense-card');
    await card.waitFor();
    const bounds = await card.evaluate(el => {
      const name = el.querySelector('.expense-info strong');
      const amount = el.querySelector('.expense-amount strong');
      return { card: el.getBoundingClientRect().right, parent: el.parentElement.getBoundingClientRect().right, truncated: name.scrollWidth > name.clientWidth && getComputedStyle(name).textOverflow === 'ellipsis', amountWidth: amount.scrollWidth, amountClient: amount.clientWidth };
    });
    assert.ok(bounds.card <= bounds.parent + 1, `Tarjeta fuera del contenedor a ${width}px`);
    assert.ok(bounds.truncated, `Nombre sin truncar a ${width}px`);
    assert.ok(bounds.amountWidth <= bounds.amountClient + 1, `Monto recortado a ${width}px`);
  }
  console.log('OK: tarjeta, nombre y monto en 320, 390 y 600 px.');
} finally { await browser.close(); }
