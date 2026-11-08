# Despliegue de ExpenseTracker PWA en Cloudflare

## Objetivo

Servir la PWA desde Cloudflare Workers, guardar gastos en D1 y exigir Cloudflare Access para la interfaz y la API. La URL pública no se habilita hasta asociar al Worker una política de acceso que solo admita miembros autorizados de la cuenta.

## Recursos

| Recurso | Valor |
| --- | --- |
| Rama | `STP2` |
| Proyecto | `pwa/` |
| Worker | `expense-tracker-pwa` |
| URL prevista | `https://expense-tracker-pwa.nicotrib699.workers.dev` |
| D1 | `expense-tracker-pwa` |
| Binding del Worker | `DB` |
| ID D1 | `8401b18e-0854-4dfb-95e3-d7345e185146` |
| Cuenta Cloudflare | `6d93a005ece548efa7de48c051ace6fb` |
| Aplicación Access | `ExpenseTracker PWA` |

La API del Worker sirve `GET /api/expenses`, `GET /api/expenses/:id` y `POST /api/expenses`. Los archivos estáticos de Vite y la API comparten origen. Las tablas y los tres gastos de ejemplo se cargaron en D1 mediante `0001_create_expenses.sql` y `0002_seed_sample_expenses.sql`; la segunda migración es idempotente.

## Publicación del 8 de noviembre de 2026

| Dato | Resultado |
| --- | --- |
| Código publicado | Commit `7abdbcf`, enviado a `origin/STP2` |
| Worker | `expense-tracker-pwa` |
| URL | [expense-tracker-pwa.nicotrib699.workers.dev](https://expense-tracker-pwa.nicotrib699.workers.dev) |
| Fecha | 8/11/2026, 19:31 de Buenos Aires (22:31 UTC) |
| Versión | `2dbc13a9-ad01-4bc0-ab24-93e478d51a32` |
| Deployment ID | `3e8ef96a-d0c1-4100-8483-5a7e3dc0e365` |
| Tráfico | 100%, confirmado por la API de Cloudflare |
| Assets actualizados | `index.html`, `sw.js`, `assets/index-B4JG2_N9.js`, `assets/index-Ct2Zy5-r.css` |
| Base de datos | Binding `DB` a la D1 existente; sin migraciones ni altas reales |

Se usó Wrangler local **4.154.0**, con la identidad OAuth habitual y permisos de
Workers Scripts Write. Se verificaron configuración y binding remotos antes y
después; se conservaron `compatibility_date: 2026-10-26`, Access y logs/trazas
con muestreo del 10%. Las previews siguen desactivadas.

Comandos de publicación ejecutados desde `pwa/`, después de las validaciones:

```sh
node node_modules/wrangler/bin/wrangler.js deploy --dry-run --config dist/expense_tracker_pwa/wrangler.json
node node_modules/wrangler/bin/wrangler.js deploy --config dist/expense_tracker_pwa/wrangler.json --keep-vars --message 'STP2 7abdbcf: lectura offline, Lighthouse y Expo 57.0.32'
```

La API confirmó la versión al 100%. Sin autenticar, se comprobó HTTP 302 hacia
`tiny-mud-73e8.cloudflareaccess.com` para Inicio, Gastos, detalle, Ajustes, los dos
GET de API, manifest, Service Worker y los nuevos assets JS/CSS. No se hizo una
comprobación autenticada ni una escritura en producción durante esta publicación.
Lighthouse y las pruebas automatizadas de navegación/offline corresponden al
build local. La verificación manual posterior de producción se detalla a continuación.

## Verificación autenticada posterior a la publicación

El 8/11/2026 se verificaron en Chrome de escritorio la sesión de Access,
Inicio/listado/detalle de D1, búsqueda, recarga, navegación, validación y cancelación.
También se comprobó la lectura offline en producción y la conservación del
formulario cuando falla un alta sin conexión; la conexión normal quedó restaurada.

A las 19:47 de Buenos Aires se creó, por pedido explícito del usuario, un gasto
identificado como prueba: `Prueba STP2 - guardado online 2026-11-08`, ARS 1,00,
categoría Otros, ID `4`. El POST respondió 201; al recargar listado y detalle,
los GET respondieron 200 desde la red y conservaron todos sus campos y notas.
El registro queda en D1: cuatro gastos y total $75.001, con los tres iniciales
conservados. El [informe](informe-sprint-2.md#verificación-autenticada-en-producción)
contiene la captura y el detalle de esta comprobación. No se modificaron código,
configuración, migraciones ni políticas de Access para realizarla.

## Estado comprobado el 29 de octubre de 2026

- La D1 remota se creó para esta PWA y se aplicaron las dos migraciones. No se reutilizó ni modificó `calma-db`.
- Wrangler 4.154.0 autenticado como `nicotrib699@gmail.com` tiene `Workers Scripts Write` y `D1 Write`.
- La conexión de Cloudflare usada por la API no tiene `Access: Apps and Policies Write` (respondió HTTP 403); por eso la aplicación Access se creó desde el dashboard.
- La aplicación Access `ExpenseTracker PWA` (ID `06d870ee-bf50-4495-bbc1-923d83405d9c`) protege el Worker completo, producción y previews. La política `ExpenseTracker - Miembros de la cuenta.` (ID `ea9e26f1-28b8-46b6-b051-95300fd5b088`) permite miembros de la cuenta `6d93a005ece548efa7de48c051ace6fb`.
- Access usa un único proveedor de identidad Cloudflare, redirige a él automáticamente y tiene sesión de 24 horas.
- El Worker tiene `workers_dev: true` y `preview_urls: false` en `pwa/wrangler.jsonc`. Logs y trazas están habilitados con muestreo del 10% (`head_sampling_rate: 0.1` en ambos); Cloudflare los retiene hasta siete días. El 29/10/2026 se publicó la versión `2680fe12-8e4b-44e4-8830-2c55d7d2ce83` al 100% del tráfico de producción, en la URL prevista. La versión anterior era `b17785bd-a58f-45e0-9189-322653090478`.
- El despliegue STP2 cargó 14 archivos estáticos nuevos o modificados y conservó el binding `DB` a la D1 existente. No se aplicaron migraciones ni se escribieron gastos de prueba.
- Sin autenticar, `GET /` y `GET /api/expenses` responden `302` hacia el inicio de sesión de Cloudflare Access.
- Después del despliegue STP2, se confirmó `302` hacia Access en `/`, `/expenses`, `/expenses/1`, `/settings`, `/api/expenses` y `/api/expenses/1`; ninguna de estas rutas quedó pública.
- Desde la sesión autenticada del miembro de Cloudflare, la PWA cargó y mostró los tres gastos de ejemplo en D1.
- No se envió un `POST` de prueba a producción para evitar agregar un gasto innecesario a D1.

## Configuración aplicada en Cloudflare Access

1. Nombre: `ExpenseTracker PWA`.
2. En **Destinations → Workers**, se seleccionó `expense-tracker-pwa` con el tipo que cubre producción y previews (`worker`).
3. En **Authentication**, se desactivó **Accept all available identity providers** y se eligió únicamente el proveedor Cloudflare de esta cuenta. Se habilitó la redirección instantánea al único proveedor.
4. Se adjuntó la política **Allow** `ExpenseTracker - Miembros de la cuenta.` mediante el selector **Cloudflare Account Member**, restringido a la cuenta actual. No se agregaron reglas `Bypass` ni `Everyone`.
5. La duración quedó en 24 horas y **Browser rendering** permaneció desactivado.
6. La aplicación se guardó y se verificó antes de habilitar `workers.dev`.

Cloudflare aplica denegación por defecto. La regla a nivel Worker cubre la interfaz y `/api/*`, además de los dominios y rutas asociados a ese Worker.

## Configuración de la URL pública

La URL principal se habilitó después de crear y verificar Access. La fuente de verdad es `pwa/wrangler.jsonc`:

```jsonc
{
  "workers_dev": true,
  "preview_urls": false,
  "observability": {
    "enabled": true,
    "logs": { "enabled": true, "head_sampling_rate": 0.1 },
    "traces": { "enabled": true, "head_sampling_rate": 0.1 }
  }
}
```

La ruta principal de producción queda publicada; las previews permanecen desactivadas. La aplicación Access cubre ambas por si las previews se habilitan más adelante.

Desde `pwa/`, compilar y desplegar con la configuración generada por el plugin Vite de Cloudflare:

```sh
npm run build
npx wrangler deploy --config dist/expense_tracker_pwa/wrangler.json
```

La URL publicada es `https://expense-tracker-pwa.nicotrib699.workers.dev`.

## Verificación de acceso

Con la ruta habilitada:

1. En una sesión sin autenticar, solicitar `/` y `/api/expenses`; ambos deben mostrar el flujo de inicio de sesión o rechazo de Cloudflare Access.
2. Iniciar sesión con un miembro permitido de la cuenta y confirmar que carga la PWA y que `/api/expenses` devuelve los gastos de D1.
3. Crear un gasto de prueba desde la interfaz y confirmar que aparece luego en la lista. No incluir datos personales o financieros reales durante una prueba.

Si Access no está aplicado o la verificación falla, volver a `workers_dev: false`, desplegar esa configuración y dejar las previews desactivadas. Cloudflare documenta que `workers_dev: false` deshabilita la ruta `workers.dev`; con Wrangler 4.154.0, `preview_urls: false` mantiene deshabilitadas las URLs de preview.

## Comandos remotos ejecutados

Desde `pwa/`:

```sh
npx wrangler whoami
npm run build
npx wrangler deploy --dry-run --config dist/expense_tracker_pwa/wrangler.json
npx wrangler deploy --config dist/expense_tracker_pwa/wrangler.json
```

El `whoami` confirmó la cuenta de Wrangler y los permisos para Workers y D1. El dry run detectó los assets y el binding D1. El despliegue STP2 completó el 29/10/2026 con Wrangler 4.154.0; `wrangler deployments status` confirmó la versión `2680fe12-8e4b-44e4-8830-2c55d7d2ce83` al 100%. Las rutas de la interfaz y la API respondieron con `302` a Access. Logs y trazas continúan habilitados con muestreo del 10%. No se hicieron altas reales en la D1 de producción.

## Referencias oficiales

- [Cloudflare Access para Workers](https://developers.cloudflare.com/workers/configuration/cloudflare-access/)
- [Configurar rutas `workers.dev`](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/)
- [Logs y trazas de Workers](https://developers.cloudflare.com/workers/observability/)
- [Proveedor de identidad Cloudflare y selector de miembros](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/cloudflare/)
