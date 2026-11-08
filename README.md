# ExpenseTracker — Programación III

Repositorio con las dos implementaciones de ExpenseTracker:

| Sprint | Proyecto | Ejecución |
| --- | --- | --- |
| STP1 | Expo / React Native en la raíz | `npm install` y `npm start`, abrir con Expo Go compatible con SDK 57 |
| STP2 | React / Vite PWA en `pwa/` | Seguir [el README de la PWA](pwa/README.md) |

PWA publicada: [expense-tracker-pwa.nicotrib699.workers.dev](https://expense-tracker-pwa.nicotrib699.workers.dev), con acceso restringido por Cloudflare Access.

El [informe de STP2](docs/informe-sprint-2.md) reúne la comparación Expo/PWA,
las comprobaciones, el informe Lighthouse y los pendientes de entrega.
Las mejoras del 8 de noviembre de 2026 están verificadas localmente en la rama
`STP2`; todavía no están desplegadas ni incluidas en un commit.

## Estado de la entrega

La PWA conserva la última lista de D1 para consultar gastos y detalles sin
conexión, después de una primera carga correcta. Las altas requieren internet.
Expo está actualizado a `57.0.32`, dentro del SDK 57.

Falta verificar la PWA instalada en un teléfono y la aplicación nativa en Expo Go,
y adjuntar sus capturas equivalentes. Las capturas de Chromium son evidencia web.
También queda publicar estos cambios y verificar la versión publicada con una
sesión autorizada de Access, incluido el acceso del docente.

## Validación de Expo

```sh
npm test
npm run lint
npm run typecheck
npx expo-doctor
```

Resultados y límites: [informe de STP2](docs/informe-sprint-2.md).
