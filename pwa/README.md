# ExpenseTracker PWA

Aplicación React + Vite servida por un Cloudflare Worker. El Worker entrega la SPA y expone una API same-origin; los gastos viven en D1 (SQLite). **No habilites una URL pública antes de configurar Cloudflare Access y verificar que la política protege el Worker completo, incluida la API.**

## Desarrollo local

Requisitos: Node.js 22.16 o posterior y npm.

`compatibility_date` usa `2026-10-26`, la fecha más reciente que admite el runtime `workerd` incluido con las dependencias locales instaladas.

```sh
npm install
npm run dev
```

El plugin Cloudflare ejecuta el Worker local y Wrangler simula D1 localmente. Para datos iniciales y altas locales, aplicá las migraciones a la base local:

```sh
npx wrangler d1 migrations apply expense-tracker-pwa --local
npm run test
npm run build
npm run preview
```

El `database_id` de `expense-tracker-pwa` ya está configurado en `wrangler.jsonc`. Para crear/aplicar el esquema inicial en una D1 nueva:

```sh
npx wrangler d1 create expense-tracker-pwa
npx wrangler d1 migrations apply expense-tracker-pwa --remote
```

La semilla usa `INSERT OR IGNORE`, así que se puede volver a aplicar sin duplicar los gastos 1/2/3. El alta de la interfaz se confirma únicamente tras una respuesta exitosa del Worker y D1. Las migraciones versionadas se guardan en `migrations/`.

## API

- `GET /api/expenses`: lista gastos.
- `GET /api/expenses/:id`: detalle por ID (404 si falta).
- `POST /api/expenses`: crea un gasto `{ "name", "amount", "category", "notes?" }`.

El servidor valida los campos y ejecuta SQL parametrizado. Las rutas de API no usan CORS. No hay credenciales en el cliente. Configurá Cloudflare Access para restringir el Worker a las personas autorizadas.

## Publicación con Cloudflare Access

El Worker está publicado en [expense-tracker-pwa.nicotrib699.workers.dev](https://expense-tracker-pwa.nicotrib699.workers.dev) y protegido por Cloudflare Access para miembros de la cuenta. `workers.dev` está habilitado y las URLs de preview permanecen desactivadas. El historial de configuración y el procedimiento de despliegue están en [el runbook](../docs/despliegue-cloudflare-sprint-2.md).

## Instalación y conexión

El manifest, el Service Worker y los assets estáticos permiten instalar y abrir la interfaz después de la primera carga. **Los gastos en D1 y las operaciones de consulta/alta requieren conexión a internet.** El Service Worker no almacena respuestas de la API.

En Android/Chrome se ofrece «Instalar App» cuando el navegador emite `beforeinstallprompt`. En iOS/Safari, usá Compartir → Agregar a pantalla de inicio.

## Continuidad visual con STP1

La PWA usa las mismas fuentes locales (Plus Jakarta Sans y JetBrains Mono), Ionicons, colores, medidas, tarjetas, filtros y barra inferior del proyecto Expo. El encabezado responde al scroll de Inicio; al cambiar entre Inicio y Gastos, el botón de alta se transforma en botón flotante y conserva su salto final.

- Paneles de alta y detalle: apertura de **340 ms**, cierre de **220 ms**, curvas cúbicas y fondo `#101D38A6`.
- Encabezado y botón: transformación de **360 ms**, salto de **110 ms**, resorte con rigidez 220, amortiguación 14 y masa 0,5. El encabezado permanece estable **3500 ms** después de cada transición.
- Escape, fondo, flecha y atrás del navegador esperan el cierre antes de desmontar. Los filtros, el scroll y las pantallas de fondo se conservan; el detalle mantiene `/expenses/:id` y admite enlaces directos.
- El formulario inicial conserva la altura de STP1. Su ícono de nota permite desplegar las notas opcionales de STP2; el detalle muestra notas cuando existen. El guardado sigue utilizando la API/D1 y conserva el formulario ante un error.
- Se respeta la preferencia de movimiento reducido. Las fuentes e íconos se incluyen en el precache para conservar el diseño sin conexión; los datos de la API siguen requiriendo internet.

Con el servidor local activo, `npm run test:ui` ejecuta la comprobación de navegador. Requiere Playwright con Chromium disponible; se puede indicar su módulo mediante `PLAYWRIGHT_MODULE` y otro servidor mediante `PWA_URL`. No realiza altas reales: las respuestas de guardado y error se simulan dentro del navegador.

El 29/10/2026 se compararon STP1 web y STP2 con Chromium a 320, 390, 600 y 1024 px: coinciden las medidas del encabezado, botón, tarjetas, barra y formulario inicial. Se comprobaron historial, foco, filtros, apertura/cierre, scroll del encabezado, movimiento reducido, errores/confirmación de guardado y fuentes offline en producción local. La versión `2680fe12-8e4b-44e4-8830-2c55d7d2ce83` se publicó ese día en [expense-tracker-pwa.nicotrib699.workers.dev](https://expense-tracker-pwa.nicotrib699.workers.dev). Tras el despliegue, las pantallas y rutas de API probadas devolvieron `302` al inicio de sesión de Cloudflare Access. No se hicieron altas reales en D1 ni se probó desde un teléfono físico o Expo Go.
