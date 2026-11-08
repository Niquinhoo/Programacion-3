# ExpenseTracker — Programación III

Repositorio con las dos implementaciones de ExpenseTracker:

| Sprint | Proyecto | Ejecución |
| --- | --- | --- |
| STP1 | Expo / React Native en la raíz | `npm install` y `npm start`, abrir con Expo Go compatible con SDK 57 |
| STP2 | React / Vite PWA en `pwa/` | Seguir [el README de la PWA](pwa/README.md) |

PWA publicada: [expense-tracker-pwa.nicotrib699.workers.dev](https://expense-tracker-pwa.nicotrib699.workers.dev), con acceso restringido por Cloudflare Access.

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
La versión publicada ya se verificó con sesión autorizada de Access, incluidos
lectura offline y guardado online con persistencia tras recargar. Se conserva un
registro de prueba de ARS 1,00, ID `4`; el total actual de producción es $75.001.
Falta confirmar el acceso del docente. Sin sesión se comprobó la redirección a Access.

## Validación de Expo

```sh
npm test
npm run lint
npm run typecheck
npx expo-doctor
```

Resultados y límites: [informe de STP2](docs/informe-sprint-2.md).
