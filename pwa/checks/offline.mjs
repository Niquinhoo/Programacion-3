import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); }
catch { playwright = require(process.env.PLAYWRIGHT_MODULE || resolve(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); }
const url = process.env.PWA_URL || 'http://127.0.0.1:4173';
const browser = await playwright.chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
const page = await context.newPage();
page.setDefaultTimeout(10000);
try {
  await page.goto(url);
  await page.getByRole('link', { name: /Ver detalle de Supermercado/ }).waitFor();
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await page.getByRole('link', { name: /Ver detalle de Supermercado/ }).waitFor();
  await page.getByRole('status').filter({ hasText: 'Sin conexión' }).waitFor();
  await page.goto(`${url}/expenses/2`);
  await page.getByRole('heading', { name: 'Combustible', exact: true }).waitFor();
  await page.reload();
  await page.getByRole('heading', { name: 'Combustible', exact: true }).waitFor();
  await page.goto(`${url}/expenses/999999`);
  await page.getByText('No se encontró el gasto en la copia sin conexión.', { exact: true }).waitFor();
  await page.goto(`${url}/expenses`);
  await page.getByRole('button', { name: 'Nuevo gasto', exact: true }).click();
  await page.getByPlaceholder('Ej.: Supermercado').fill('Alta sin conexión');
  await page.getByPlaceholder('Ej.: 25000,50').fill('123,45');
  await page.getByRole('button', { name: 'Guardar', exact: true }).click();
  await page.getByRole('alert').filter({ hasText: 'Sin conexión' }).waitFor();
  assert.equal(await page.getByPlaceholder('Ej.: Supermercado').inputValue(), 'Alta sin conexión');
  assert.equal(await page.getByPlaceholder('Ej.: 25000,50').inputValue(), '123,45');
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'detached' });
  await page.getByRole('link', { name: 'Ajustes', exact: true }).click();
  await page.reload();
  await page.getByRole('heading', { name: 'Configuración', exact: true }).waitFor();
  await page.getByRole('link', { name: 'Inicio', exact: true }).click();
  await page.getByRole('link', { name: /Ver detalle de Supermercado/ }).waitFor();
  await page.screenshot({ path: resolve(import.meta.dirname, '../../docs/evidence/stp2/offline-chromium.png') });
  console.log('OK: recarga offline de Inicio, Gastos, Ajustes y detalle nunca visitado; ID ausente y formulario conservado.');

  await context.setOffline(false);
  await page.evaluate(() => window.dispatchEvent(new Event('online')));
  await page.getByRole('status').filter({ hasText: 'Sin conexión' }).waitFor({ state: 'detached' });
  console.log('OK: al recibir online se consulta D1 y desaparece el aviso offline.');

  await page.goto(`${url}/expenses`);
  await page.route('**/api/expenses', async (route) => {
    if (route.request().method() !== 'POST') return route.continue();
    await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ ...route.request().postDataJSON(), id: 'offline-check', date: '2026-11-08' }) });
  });
  await page.getByRole('button', { name: 'Nuevo gasto', exact: true }).click();
  await page.getByPlaceholder('Ej.: Supermercado').fill('Alta confirmada de prueba');
  await page.getByPlaceholder('Ej.: 25000,50').fill('10');
  await page.getByRole('button', { name: 'Guardar', exact: true }).click();
  await page.getByRole('dialog').waitFor({ state: 'detached' });
  await page.getByRole('link', { name: /Ver detalle de Alta confirmada de prueba/ }).waitFor();
  await context.setOffline(true);
  await page.reload();
  await page.getByRole('link', { name: /Ver detalle de Alta confirmada de prueba/ }).click();
  await page.getByRole('heading', { name: 'Alta confirmada de prueba', exact: true }).waitFor();
  console.log('OK: un alta confirmada actualiza la copia offline de listado y detalle (POST simulado, sin escribir en D1).');
  await context.setOffline(false);
  await page.unroute('**/api/expenses');

  await page.route('**/api/expenses', (route) => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Servidor temporalmente no disponible' }) }));
  await page.goto(url);
  await page.getByRole('alert').filter({ hasText: 'Servidor temporalmente no disponible' }).waitFor();
  assert.equal(await page.getByRole('link', { name: /Ver detalle de Supermercado/ }).count(), 0);
  await page.unroute('**/api/expenses');
  console.log('OK: un HTTP 503 online se muestra como error y no se oculta con la caché.');

  await page.route('**/api/expenses', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await page.goto(`${url}/expenses`);
  await page.getByRole('heading', { name: 'Sin movimientos', exact: true }).waitFor();
  await page.unroute('**/api/expenses');
  await context.setOffline(true);
  await page.reload();
  await page.getByRole('heading', { name: 'Sin movimientos', exact: true }).waitFor();
  await page.getByRole('status').filter({ hasText: 'Sin conexión' }).waitFor();
  await context.setOffline(false);
  await page.goto(url);
  await page.getByRole('link', { name: /Ver detalle de Supermercado/ }).waitFor();
  console.log('OK: una lista vacía es una copia offline válida y se actualiza al recargar online.');

  await page.route('**/api/expenses', (route) => route.fulfill({ status: 302, headers: { location: '/login-check' } }));
  await page.goto(url);
  await page.getByRole('alert').filter({ hasText: 'No se pudo verificar el acceso' }).waitFor();
  await page.unroute('**/api/expenses');
  await context.setOffline(true);
  await page.reload();
  await page.getByRole('alert').filter({ hasText: 'No hay una copia' }).waitFor();
  console.log('OK: una redirección de autenticación invalida la copia y no permite recuperarla offline.');

  const blockedContext = await browser.newContext();
  await blockedContext.addInitScript(() => Object.defineProperty(window, 'caches', { get() { throw new DOMException('Storage blocked', 'SecurityError'); } }));
  const blockedPage = await blockedContext.newPage();
  await blockedPage.goto(url);
  await blockedPage.getByRole('link', { name: /Ver detalle de Supermercado/ }).waitFor();
  await blockedContext.close();
  console.log('OK: la consulta online sigue funcionando si el navegador bloquea Cache Storage.');
} catch (error) {
  console.error(await page.locator('body').innerText());
  console.error(await page.evaluate(async () => ({ online: navigator.onLine, worker: navigator.serviceWorker.controller?.scriptURL, caches: await caches.keys() })));
  throw error;
} finally { await browser.close(); }
