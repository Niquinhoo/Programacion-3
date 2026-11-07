# Fidelidad visual y de movimiento STP1 → STP2

**Objetivo:** reproducir en `pwa/` el diseño y las interacciones existentes de `src/`, por pedido explícito del usuario. Implementación y revisión directas, sin subagentes.

**Decisiones:** mantener React/Vite, React Router, `<dialog>`, API/D1 e instalación PWA. Reutilizar las fuentes e Ionicons ya instalados. La referencia es el código STP1, sin rediseño ni dependencias nuevas. Conservar notas y mensajes reales de la versión web.

## Alcance

- [x] Comprobar primero que la regresión de interfaz detecta las diferencias actuales.
- [x] Trasladar fuentes, íconos, colores, medidas, tarjetas, filtros, ajustes y navegación inferior.
- [x] Encabezado persistente: transición cúbica de 360 ms y permanencia de 3500 ms después de finalizar. Botón compartido: transformación de 360 ms, salto de 110 ms y resorte con rigidez 220, amortiguación 14 y masa 0,5.
- [x] Panel compartido para alta y detalle: entrada cúbica de 340 ms, salida cúbica de 220 ms, fondo `#101D38A6`, foco y teclado. Esperar la salida antes de desmontar o navegar, también con Escape, fondo y atrás del navegador.
- [x] Mantener la URL del detalle y el estado de la pantalla de fondo; admitir recarga y enlace directo. Conservar validación, errores de red, prevención de doble envío y guardado existente.
- [x] Verificar movimiento reducido, anchos de 320/390/600 px, historial, formulario y filtros. Ejecutar las verificaciones del repositorio y el build de la PWA. Documentar límites de la verificación física.

## Archivos

`pwa/src/{App,router/AppRouter,layouts/MainLayout}.jsx`, páginas, componentes y `styles/app.css`; recursos tipográficos en `public/fonts/`; utilidades de movimiento y hook de preferencia; pruebas unitarias y comprobación de navegador en `pwa/checks/`. No se modifica Expo ni la API.

## Revisión

Atender interrupciones durante apertura/cierre, React StrictMode, foco al cerrar, cambios de tamaño/teclado virtual, navegación hacia atrás/adelante, filtros al volver desde detalle, contenido largo y datos remotos. La revisión visual de navegador no equivale a una ejecución en Expo Go ni en teléfono físico.

## Resultado de la verificación

- PWA: 5 pruebas unitarias, comprobación Chromium de interacción y build de producción correctos.
- Comparación con STP1 web: geometría de Inicio, Gastos y formulario a 320/390/600/1024 px coincidente.
- Fuentes e íconos: siete archivos disponibles desde el Service Worker sin conexión en producción local.
- ESLint explícito de pwa/src y pwa/checks correcto. npm test, npm run lint y npm run typecheck de Expo correctos.
- expo-doctor: 20/21; recomienda Expo ~57.0.31 frente a 57.0.30 instalado. No se actualizaron dependencias de Expo.
- Sin despliegue, prueba en teléfono físico ni ejecución en Expo Go.
