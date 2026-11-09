# ExpenseTracker — Programación III

Repositorio con las dos implementaciones de ExpenseTracker:

| Sprint | Proyecto | Ejecución |
| --- | --- | --- |
| STP1 | Expo / React Native en la raíz | `npm install` y `npm start`, abrir con Expo Go compatible con SDK 57 |
| STP2 | React / Vite PWA en `pwa/` | Seguir [el README de la PWA](pwa/README.md) |

PWA publicada: [expense-tracker-pwa.nicotrib699.workers.dev](https://expense-tracker-pwa.nicotrib699.workers.dev), con acceso público para que la cátedra pueda revisarla sin iniciar sesión.

El [informe de STP2](docs/informe-sprint-2.md) reúne la comparación Expo/PWA,
las comprobaciones, el informe Lighthouse y los pendientes de entrega.
Las mejoras del 8 de noviembre de 2026 están verificadas en la rama `STP2`,
incluidas en el [commit 7abdbcf](https://github.com/Niquinhoo/Programacion-3/commit/7abdbcfa3e14ba41be4f007dc0aa3fc105a05043)
y desplegadas en Cloudflare al 100% del tráfico. El [registro de publicación](docs/despliegue-cloudflare-sprint-2.md#publicación-del-8-de-noviembre-de-2026)
identifica la versión y sus comprobaciones.

## Estado de la entrega

La PWA conserva la última lista de D1 para consultar gastos y detalles sin
conexión, después de una primera carga correcta. Las altas requieren internet.
Expo está actualizado a `57.0.32`, dentro del SDK 57.

Falta verificar la PWA instalada en un teléfono y la aplicación nativa en Expo Go,
y adjuntar sus capturas equivalentes. Las capturas de Chromium son evidencia web.
La versión publicada se verificó, incluidos lectura offline y guardado online con
persistencia tras recargar. El 9 de noviembre de 2026 se corrigió el diseño
responsive con nombres y montos largos y se quitó Cloudflare Access para que la
cátedra pueda entrar sin cuenta. El [hotfix del 9 de noviembre](docs/despliegue-cloudflare-sprint-2.md#hotfix-del-9-de-noviembre-de-2026-acceso-público-y-responsive)
detalla los pasos de publicación y verificación.

## Validación de Expo

```sh
npm test
npm run lint
npm run typecheck
npx expo-doctor
```

Resultados y límites: [informe de STP2](docs/informe-sprint-2.md).
