# US#7 — Bonus opcional

**Código de consigna:** `#rn-s1-us7` · **Fuente:** [consigna local del sprint](../../expense-tracker-sprint-1.md#L95).

## Consigna

La historia propone cuatro mejoras opcionales para explorar: iconos de Expo Vector Icons, colores para diferenciar categorías, total al final del listado e imágenes o ilustraciones desde `assets/`. No establece que haya que implementar las cuatro para cumplir el bonus.

## Qué quedó implementado

Las filas usan iconos de Expo y colores distintos para Alimentos, Transporte, Servicios y Otros. Los datos de ejemplo suman $75.000; el hero muestra el total, aunque no al final de la lista. El hero dibuja sus arcos con vistas y el proyecto incluye recursos de icono y splash, pero no una ilustración de contenido cargada desde `assets/` ([filas e iconos](../../ExpenseTracker/src/components/ExpenseRow.js#L6), [total](../../ExpenseTracker/src/components/ExpenseHero.js#L16), [arte del hero](../../ExpenseTracker/src/components/ExpenseHero.js#L37), [datos y suma](../../ExpenseTracker/tests/expense.test.mjs#L17)).

## Contraste por mejora

| Mejora opcional | Implementación | Estado |
| --- | --- | --- |
| Iconos de Expo Vector Icons | Iconos por categoría en cada fila. | Implementada |
| Colores por categoría | Fondo y color específicos por categoría. | Implementada |
| Total al final de la lista | El total de $75.000 aparece en el hero. | Mejora disponible en otra ubicación; falta ponerlo al final de la lista si se quiere seguir esta propuesta literalmente |
| Imagen o ilustración desde `assets/` | Hay icono/splash de la app; el hero está compuesto con vistas, sin ilustración de contenido. | No se agregó una ilustración de contenido |

## Resultado

**Bonus opcional cumplido con iconos y colores por categoría.** También se muestra el total, aunque en el hero. Ponerlo al final de la lista y sumar una ilustración desde `assets/` son mejoras propuestas que quedan disponibles, pero no son condiciones obligatorias de esta historia.
