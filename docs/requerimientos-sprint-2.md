# ExpenseTracker — requerimientos del Sprint 2

**Fuente:** [ExpenseTracker Sprint 2](https://programacion3.notion.site/expensetracker-sprint-2), consultada el 27 de octubre de 2026.  
**Rama de trabajo:** `STP2`, creada desde `STP1`.  
**Estado:** consignas relevadas; implementación de `pwa/` en curso. Validaciones físicas, URL HTTPS protegida y evidencia de Lighthouse pendientes.

## Objetivo y alcance

Reconstruir ExpenseTracker del Sprint 1 con **React y Vite** como Progressive Web App (PWA), manteniendo pantallas, datos, navegación y una experiencia visual y funcional comparable a la app React Native. Debe funcionar en navegadores modernos, instalarse con nombre e ícono propios, abrirse en modo standalone y funcionar sin conexión después de la primera carga. El objetivo es comparar tecnologías, no determinar una ganadora.

Se presupone terminado el Sprint 1 y estudiado el módulo «Aplicaciones Web de Primera Clase»: mejora progresiva, manifest, instalación, diseño mobile-first, viewport, `dvh`, áreas seguras, interacción táctil, React Router, navegación inferior, `<dialog>`, Service Workers y caché offline. Se necesita una computadora, un teléfono Android con Chrome o iOS con Safari, internet y hosting HTTPS.

Los datos siguen definidos manualmente. La consigna indica que **no se evaluarán** IndexedDB, `localStorage`, Context ni APIs remotas; no se busca agregar funcionalidades nuevas. Las capacidades de futuros sprints mencionadas en la fuente (estado, persistencia, cámara y notificaciones) no integran este alcance.

### Ampliación solicitada para esta implementación

El 27 de octubre de 2026, el usuario pidió desplegar la rama `STP2` en Cloudflare Workers y guardar los gastos de la PWA en Cloudflare D1 (SQLite). Para `pwa/`, esta decisión amplía la consigna original: la web obtiene gastos y los crea mediante una API del Worker enlazada a D1. El usuario eligió Cloudflare Access para proteger la aplicación completa, incluida su API. La app Expo de Sprint 1 conserva su alcance y datos actuales.

La base remota `expense-tracker-pwa` ya se creó en la cuenta de Cloudflare (región ENAM) y recibió las dos migraciones con los registros de ejemplo. No se reutiliza `calma-db`, que pertenece a otro proyecto. `wrangler.jsonc` ya tiene el UUID. Resta activar y verificar Access antes de desplegar el Worker.

## Flujo de la aplicación

1. La persona abre `/` y ve bienvenida, resumen y accesos para registrar un gasto o consultar el listado.
2. Desde Inicio o Gastos abre el formulario como panel modal inferior; puede completar nombre, monto y categoría, guardar para obtener una respuesta simple o cancelar. No se guarda información.
3. La barra inferior fija permite navegar entre Inicio (`/`), Gastos (`/expenses`) y Ajustes (`/settings`); destaca la pestaña activa.
4. En Gastos selecciona un registro y abre `/expenses/:id`. El detalle se recupera por ID desde los datos de prueba; debe sobrevivir a una recarga y mostrar un mensaje si el ID no existe. La vuelta funciona con el control de la app y con el navegador/sistema.
5. En un origen HTTPS, la persona instala la PWA desde Android/Chrome o mediante las instrucciones de iOS. Tras la primera carga y activación del Service Worker, puede abrirla y navegar sin conexión, incluso al recargar una ruta profunda.

## Historias de usuario y criterios

### US #1 — Crear proyecto React con Vite (`#pwa-s2-us1`)

Preparar una base común. La fuente recomienda trabajo colaborativo.

- Crear `expense-tracker-pwa` con la plantilla React: `npm create vite@latest expense-tracker-pwa -- --template react`.
- Instalar dependencias y React Router (`npm install react-router-dom`), comprobar el funcionamiento en navegador y versionar el código.
- Validar que `npm run dev` ejecuta el proyecto y que se visualiza en computadora y teléfono.
- Para desarrollo en la misma red se sugiere `npm run dev -- --host`; la dirección IP de la computadora no es un origen seguro, por lo que allí no se valida instalación ni Service Worker. Eso se comprueba mediante HTTPS en la US #8.

### US #2 — Definir estructura del proyecto (`#pwa-s2-us2`)

La estructura propuesta es evaluable y debe existir físicamente. Separar páginas, componentes, rutas y layouts; otras carpetas pueden añadirse justificando su existencia. El formulario es un componente modal, no una pantalla de la pila. Mantener los mismos datos de prueba del Sprint 1 y comprobar que el proyecto siga funcionando.

```text
expense-tracker-pwa/
├── index.html
├── vite.config.js
├── public/
│   ├── manifest.json
│   └── icons/
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── components/   (ExpenseCard, CategoryBadge, NewExpenseModal, InstallBanner)
    ├── pages/        (HomeScreen, ExpensesScreen, ExpenseDetailScreen, SettingsScreen)
    ├── router/       (AppRouter)
    ├── layouts/      (MainLayout)
    ├── hooks/        (usePWAInstall)
    ├── data/         (mockExpenses.js)
    └── styles/
```

**Mapa de migración indicado por la consigna:**

| Sprint 1: React Native | Sprint 2: React web |
| --- | --- |
| `App.js` y `NavigationContainer` | `main.jsx` y `BrowserRouter` |
| `StackNavigator.js` | `router/AppRouter.jsx` con `<Routes>` |
| `TabNavigator.js` | `layouts/MainLayout.jsx` con `<Outlet>` y `<NavLink>` |
| Modal de alta en navegación | `components/NewExpenseModal.jsx`, `<dialog>` y `createPortal` |
| `navigate('ExpenseDetail', { expense })` | `<Link to="/expenses/1">` o `useNavigate()` |
| `route.params` / `navigation.goBack()` | `useParams()` / `navigate(-1)` |
| `StyleSheet.create()` | CSS |
| `SafeAreaView` | `env(safe-area-inset-*)` |
| `TouchableOpacity` | `<button>` y `:active` |
| `keyboardType="numeric"` | `inputmode="decimal"` |
| `Switch` | `<input type="checkbox" role="switch">` |
| `app.json` | `public/manifest.json` |
| Expo Go | Navegador y URL HTTPS |

### US #3 — Identidad e instalabilidad (`#pwa-s2-us3`)

- Crear `public/manifest.json` con `name`, `short_name`, `description`, `start_url`, `display: standalone`, `orientation`, `background_color`, `theme_color` e `icons`.
- Agregar íconos de 192×192 y 512×512 y al menos uno con `purpose: "maskable"`; se puede reutilizar el ícono del Sprint 1.
- Vincular el manifest en el `<head>`; incluir viewport con `viewport-fit=cover`, metadatos iOS `apple-mobile-web-app-capable`, `apple-mobile-web-app-title`, `apple-mobile-web-app-status-bar-style` y `apple-touch-icon`.
- Implementar `usePWAInstall` para capturar `beforeinstallprompt` e `InstallBanner` con botón «Instalar App» para Android/Chrome e instrucciones manuales en iOS cuando no esté instalada.
- Validar el manifest y los íconos en Application → Manifest de DevTools, las etiquetas y la existencia del hook y componente. El banner de iOS no debe mostrarse al abrir desde pantalla de inicio (`navigator.standalone`). La consigna advierte que la aparición del banner Android se verifica en US #8, con Service Worker activo y HTTPS.

### US #4 — Migrar bienvenida (`#main-s2-us4`)

- Mostrar nombre ExpenseTracker, mensaje de bienvenida, descripción del registro de gastos, total registrado, cantidad de movimientos y accesos «Registrar Nuevo Gasto» y «Ver Listado Completo».
- Usar elementos semánticos (`header`, `main`, `section`, `h1`, `p`), CSS y Flexbox. El contenedor usa `min-height: 100dvh` con respaldo `100vh`; el encabezado respeta `env(safe-area-inset-top)`.
- Los accesos son botones o enlaces, no `div` con `onClick`; la pantalla debe ser visualmente equivalente a Sprint 1.

### US #5 — Migrar formulario de gastos (`#main-s2-us5`)

- Formulario con nombre, monto, categoría, Guardar y Cancelar; responde a `onSubmit`, sin persistencia.
- `NewExpenseModal` utiliza `<dialog>`, `showModal()` y `createPortal`; emerge desde abajo con animación de bottom sheet y fondo oscurecido con `::backdrop`.
- Nombre con `<input type="text">` y `<label>` asociado; monto con `inputmode="decimal"` para teclado numérico; categoría mediante chips, `<select>` o radio buttons.
- Guardar es `submit` y realiza una acción simple, como mensaje temporal o `console.log`. Debe abrir desde Inicio y Gastos, tener controles táctiles de al menos 44 px y ser usable con el teclado virtual abierto.

### US #6 — Migrar listado y detalle (`#main-s2-us6`)

- Mostrar al menos Supermercado ($25.000), Combustible ($18.000) e Internet ($32.000), definidos manualmente. Presentar múltiples elementos como lista semántica (`ul`/`li` o `article`) usando `ExpenseCard` reutilizable; cada gasto muestra descripción y monto.
- Al seleccionar un gasto abrir `/expenses/:id` y mostrar descripción, monto, categoría, fecha y notas. Obtener el ID con `useParams()` y buscar el registro: la URL es la fuente de verdad.
- Al recargar el detalle debe seguir apareciendo; un ID inexistente muestra un mensaje adecuado. El botón de volver usa `navigate(-1)` y también funciona atrás en el navegador.

### US #7 — Integrar vistas y navegación (`#pwa-s2-us7`)

- Integrar bienvenida, formulario, listado, detalle y ajustes; la navegación debe funcionar sin errores.
- Crear `AppRouter` con React Router y `MainLayout` persistente con barra inferior fija para Inicio, Gastos y Ajustes. Usar `NavLink` para destacar la pestaña activa.
- Implementar como mínimo `/`, `/expenses`, `/expenses/:id` y `/settings`, con cambios reales de URL. Los botones atrás del navegador y sistema operativo deben funcionar.
- Respetar `env(safe-area-inset-bottom)` y evitar que la barra tape contenido. Usar retroalimentación táctil con `:active`, sin depender solo de `:hover`; organizar en componentes reutilizables.

### US #8 — Service Worker, offline y publicación (`#pwa-s2-us8`)

- Instalar `vite-plugin-pwa` como dependencia de desarrollo y configurar `VitePWA` para generar y registrar un Service Worker que precachee HTML, CSS, JS e íconos.
- Mantener **un único manifest**: por ejemplo, conservar `public/manifest.json` con `manifest: false` en el plugin, o mover su contenido a la configuración del plugin.
- Generar producción con `npm run build` y probar con `npm run preview`. La fuente indica que el Service Worker se genera para producción, no en `npm run dev`.
- Comprobar worker activo en Application → Service Workers y recursos en Cache Storage; simular Offline y recargar.
- Publicar por HTTPS y configurar fallback de SPA para que las rutas profundas respondan con `index.html` (la fuente da como ejemplos `_redirects` en Netlify o `rewrites` en Vercel).
- Instalar en teléfono: botón propio en Android/Chrome; Compartir → Agregar a la pantalla de inicio en iOS. Verificar nombre, ícono, modo standalone y navegación offline por todas las pantallas; recargar rutas `/expenses/:id` tanto online como offline.
- Ejecutar Lighthouse en modo Mobile y adjuntar captura del informe al README.

### US #9 — Bonus opcional (`#pwa-s2-us9`)

- Íconos equivalentes a Expo Vector Icons, por ejemplo Ionicons de `react-icons/io5` o SVG.
- Colores por categoría y total de gastos al final del listado.
- Comparar TanStack Virtual con un listado mediante `map()`.
- Transiciones CSS entre pantallas; evaluar `touch-action: manipulation` en teléfono.
- Mejorar Lighthouse en Performance, Accessibility y Best Practices.
- Consultar [whatwebcando.today](https://whatwebcando.today/) en Android y iPhone y documentar en el README las capacidades disponibles para ExpenseTracker en cada plataforma.

## Entrega y evaluación

- Entregar un repositorio Git con código fuente completo; puede ser un repositorio nuevo o una carpeta `pwa/` dentro del repositorio de Sprint 1. Se valoran las ramas.
- El README o equivalente debe contener URL pública HTTPS, capturas de la app instalada en el teléfono junto a las capturas equivalentes de Expo Go, captura de Lighthouse y una tabla breve comparando las dos implementaciones.
- Debe existir evidencia de progreso y participación individual y, si es grupal, trabajo colaborativo. Se valoran la organización, el HTML semántico, los controles nativos y la equivalencia visual y funcional. El producto debe estar publicado por HTTPS y poder instalarse en un teléfono.
- La fuente recomienda trabajo colaborativo en US 1, 2, 3, 7 y 8; las US 4, 5 y 6 pueden asignarse individualmente. La US 9 es bonus.

## Orden de trabajo sugerido

1. Preparar el proyecto y su estructura (US 1–2).
2. Migrar datos, pantallas y formulario (US 4–6); integrar rutas y layout (US 7). La identidad e instalación (US 3) puede prepararse durante esta etapa.
3. Configurar producción, Service Worker, fallback de rutas y HTTPS (US 8); comprobar instalación y modo offline en dispositivo.
4. Reunir capturas, Lighthouse, comparación y evidencia de participación. Considerar bonus solo después de cumplir lo obligatorio.

## Punto de partida y decisiones pendientes

- El repositorio actual es la aplicación Expo de Sprint 1; sus tres gastos están en `src/data/expenses.js` y coinciden en nombre y monto con la consigna. Los registros observados tienen ID, nombre, monto, categoría y fecha, pero **no incluyen notas**: hay que definir cómo presentar ese campo sin inventar contenido.
- La navegación actual usa `StackNavigator` y `TabNavigator`; el detalle y el alta se presentan como modales. Sprint 2 exige una ruta de detalle por ID y un modal de alta con `<dialog>`. Esto requiere una implementación web específica; este documento no decide un refactor del código existente.
- La consigna permite un repositorio nuevo o `pwa/`; la ubicación definitiva, el servicio de hosting y los dispositivos concretos para la demostración quedan por decidir.
- La evidencia existente del Sprint 1 identifica Expo Go como pendiente. Las capturas web no sustituyen las capturas de la app en Expo Go exigidas para la comparación.
- La consigna exige equivalencia funcional y visual, pero no detalla qué hacer con cada interacción adicional del prototipo actual. Contrastarlas durante la migración antes de decidir su alcance.
