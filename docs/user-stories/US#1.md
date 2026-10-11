# US#1 — Crear el proyecto Expo

**Código de consigna:** `#rn-s1-us1` · **Trabajo sugerido:** colaborativo · **Fuente:** [consigna local del sprint](../../expense-tracker-sprint-1.md#L22).

## Consigna

Crear `ExpenseTracker` con la plantilla `blank`, comprobar que abra en Expo Go y versionar el proyecto en Git. La validación pide que exista, arranque con `npx expo start`, se vea en Expo Go y esté versionado.

## Qué quedó implementado

El proyecto Expo está en `ExpenseTracker/`, con `App.js` como entrada de la aplicación y scripts de inicio para Expo, web, Android e iOS en `package.json` ([entrada](../../ExpenseTracker/App.js#L21), [scripts](../../ExpenseTracker/package.json#L22)). El README identifica la plantilla `blank`. El repositorio está en la rama `STP1`, publicada en `origin`, y el código está versionado.

## Contraste de validación

| Criterio | Evidencia | Estado |
| --- | --- | --- |
| Existe el proyecto Expo | `ExpenseTracker/app.json`, `App.js` y dependencias Expo en `package.json`. | Cumple |
| Tiene comando de inicio Expo | El script `start` ejecuta `expo start`. | Configurado; no se volvió a iniciar durante esta revisión |
| Abre en Expo Go | El README indica que falta probarlo en un teléfono. | Pendiente |
| Está versionado | Rama `STP1` en el repositorio remoto. | Cumple |

## Resultado

**Cumple la base del proyecto y el versionado.** La historia queda pendiente de cerrar hasta comprobar el arranque en Expo Go. Las pruebas web y los chequeos estáticos no reemplazan esa validación nativa.
