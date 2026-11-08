# ExpenseTracker — estado de STP2

**Fecha:** 8 de noviembre de 2026 · **Rama:** `STP2`.

La implementación web y la lectura offline están verificadas localmente. El sprint
todavía requiere la demostración y las capturas en teléfono. Los cambios de esta
fecha no están desplegados ni incluidos en un commit; la URL publicada conserva
la versión anterior.

## Contraste con la consigna

La fuente de requisitos es el [relevamiento del 27 de octubre](requerimientos-sprint-2.md).
En esta revisión no se pudo reabrir su enlace de Notion.

| Historia | Estado comprobado | Pendiente |
| --- | --- | --- |
| US1 — React + Vite | Proyecto `pwa/`, desarrollo y build de producción | Comprobar visualización en el teléfono |
| US2 — Estructura | Separación de páginas, componentes, rutas, layout, hooks y datos | Sin faltantes de estructura observados |
| US3 — Identidad e instalación | Manifest único, íconos 192/512 y maskable, metadatos iOS, hook y banner de instalación | Instalar y comprobar identidad/standalone en teléfono |
| US4 — Inicio | Bienvenida, resumen, accesos y lista reciente | Captura equivalente en teléfono |
| US5 — Formulario | `dialog`, portal, validación, cierre, guardado online y conservación ante error | Teclado virtual y controles táctiles reales |
| US6 — Listado y detalle | Tres registros iniciales, detalle por ID, enlace directo, recarga y mensaje para ID ausente | Recorrido equivalente en teléfono |
| US7 — Navegación | Rutas reales, barra inferior, filtros, historial, foco y movimiento reducido comprobados en Chromium | Atrás del sistema en teléfono |
| US8 — PWA y offline | Build, Service Worker, recarga de rutas profundas y consulta de datos offline en producción local; Lighthouse adjunto | Publicar esta revisión, verificar Access autenticado y repetir en teléfono |
| US9 — Bonus | Íconos, categorías y transiciones presentes | Opcional; no condiciona el cierre obligatorio |

El uso de D1 es una ampliación autorizada del ejercicio. La consigna original
trabajaba con datos de prueba y no evaluaba persistencia ni APIs remotas.

## Comparación de las implementaciones

| Aspecto | STP1 — Expo / React Native | STP2 — React / Vite PWA |
| --- | --- | --- |
| Ejecución | Expo Go compatible con SDK 57 | Navegador y aplicación web instalada desde HTTPS |
| Componentes | `View`, `Text`, `Pressable`, estilos React Native | HTML semántico, controles web y CSS |
| Navegación | React Navigation: StackNavigator + TabNavigator | React Router, rutas por URL y MainLayout persistente |
| Formulario | Panel modal nativo de demostración | `dialog` + `showModal()` + portal; guarda por API/D1 |
| Datos iniciales | Supermercado $25.000, Combustible $18.000 e Internet $32.000 | Mismos tres registros sembrados en D1; total inicial $75.000 |
| Lectura sin conexión | Datos definidos en la app; falta comprobar Expo Go | Interfaz precacheada y última lista válida guardada con Cache API |
| Altas y persistencia | Sin persistencia en STP1 | D1 online; no hay cola ni guardado offline |
| Identidad | `app.json` y recursos Expo | Manifest, íconos web y flujo de instalación del navegador |
| Diseño | Fuentes, colores e interacciones del prototipo | Mismas fuentes y color principal `#0057FF`; adaptación web sin gradientes |
| Evidencia actual | Comprobaciones de código; prueba física pendiente | Chromium de escritorio con viewport móvil y Lighthouse local |

## Comportamiento offline

El Service Worker guarda los recursos de la interfaz. El servicio de gastos
conserva una lista JSON separada en Cache Storage, bajo
`expense-tracker-expenses-v1`. Un fallo de red recupera esa lista y permite abrir
por ID incluso un detalle que nunca se visitó online. Se identifica la copia
offline en la interfaz. Una lista vacía es válida; una copia inexistente produce
un mensaje que pide abrir la app con internet primero.

Se consulta primero el servidor. Un HTTP 4xx/5xx no se disimula usando la copia;
las respuestas de autenticación invalidan la copia. No se guardan respuestas
de Access ni cookies. Si el navegador bloquea Cache Storage, la consulta online
continúa funcionando. La copia puede quedar desactualizada o ser eliminada por el
navegador; para quitarla manualmente, borrar los datos del sitio. El botón de
cerrar sesión de Ajustes conserva su comportamiento demostrativo.

Las altas requieren conexión. Una respuesta de creación exitosa actualiza la
copia; si falla, los campos permanecen en el formulario y no se muestra éxito.
Al recibir el evento `online` del navegador se actualizan lista y detalle; si el
navegador no detecta la recuperación, se puede recargar manualmente.

![Inicio tras recargar sin conexión en Chromium, no en teléfono](evidence/stp2/offline-chromium.png)

## Comprobaciones ejecutadas

| Comando / comprobación | Resultado |
| --- | --- |
| `npx expo install expo@~57.0.32` | Expo instalado en `57.0.32`; package.json y lock actualizados |
| Raíz: `npm test` | Correcto: formulario, ARS, datos iniciales, búsqueda y filtros |
| Raíz: `npm run lint` | Exit 0 |
| Raíz: `npm run typecheck` | Exit 0 |
| Raíz: `npx expo-doctor` | 21/21 comprobaciones correctas |
| PWA: `npm test` | 5/5 tests correctos |
| PWA: `npm run build` | Correcto; genera Service Worker y precache |
| PWA: `npm run test:ui`, con `PWA_URL=http://127.0.0.1:4173` | Navegación, historial, filtros, foco, paneles, errores/confirmación y tamaños correctos |
| PWA: `npm run test:offline` contra preview | Recargas offline, detalle no visitado, ID ausente, alta fallida, alta confirmada simulada, reconexión, lista vacía, HTTP 503, redirección de autenticación y almacenamiento bloqueado |
| Revisión del diff | Agente principal; sin subagentes, sin generar `android/` ni `ios/` |

Se reprodujo primero el fallo de la recarga offline con la versión anterior.
La comprobación de navegador usa consultas a D1 local y simula los POST de prueba;
no se hicieron altas reales ni cambios de infraestructura en producción.
Los comandos para repetirla están en el [README de la PWA](../pwa/README.md).

La instalación de Expo informó 12 avisos de `npm audit` (11 moderados y uno alto).
Se inspeccionó el alto: Zod es una dependencia transitiva de las herramientas de
lint, no un import de la app. No se ejecutó `npm audit fix` ni una actualización
general de dependencias fuera del parche solicitado; queda como mantenimiento
separado. Los avisos no son resultados de Expo Doctor.

## Lighthouse Mobile

**Lighthouse 12.8.2**, Chrome headless, configuración Mobile predeterminada,
sobre `http://127.0.0.1:4173/`, preview de producción y D1 local.
Medición del 8/11/2026 a las 19:18 de Buenos Aires, sin advertencias de ejecución.

| Categoría | Puntaje |
| --- | ---: |
| Performance | 69 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 91 |

| Métrica | Valor |
| --- | ---: |
| FCP | 3,5 s |
| LCP | 6,7 s |
| TBT | 10 ms |
| CLS | 0 |
| Speed Index | 3,5 s |

[Informe HTML completo](evidence/stp2/lighthouse-mobile.report.html) ·
[Informe JSON](evidence/stp2/lighthouse-mobile.report.json)

![Informe Lighthouse Mobile sobre producción local](evidence/stp2/lighthouse-mobile.png)

El resultado no acredita el rendimiento de la URL pública, la red real de un
teléfono ni el paso por Access. Performance necesita mejoras: el informe señala
recursos que bloquean el renderizado, JavaScript sin usar y falta de compresión
en el servidor local. Las fuentes TTF e Ionicons añaden transferencia. SEO señala
que el fallback de la SPA devuelve HTML al solicitar `robots.txt`. La consigna
exige adjuntar Lighthouse; mejorar estos puntajes pertenece al bonus US9.

Se agregó la descripción HTML y un favicon a partir del ícono existente. La
advertencia de texto visible/nombre accesible de las tarjetas se corrigió usando
su contenido como nombre accesible, sin reemplazarlo con un `aria-label` parcial;
la comprobación de Lighthouse quedó correcta.

## Pendientes para el teléfono y la entrega

- [ ] Publicar esta revisión y comprobar, con sesión autorizada, Inicio, lista,
  detalle por enlace directo, guardado y redirección a Access sin sesión.
- [ ] Asegurar acceso del docente. La URL requiere una identidad permitida por Access.
- [ ] En teléfono, instalar desde Chrome/Android o Safari/iOS y tomar captura
  del ícono y nombre en la pantalla de inicio.
- [ ] Abrir desde el ícono y comprobar modo standalone, áreas seguras y barra inferior.
- [ ] Con internet, esperar la primera carga y activación del Service Worker.
  Desconectar la red, cerrar y reabrir la PWA; navegar Inicio/Gastos/Ajustes,
  abrir un detalle no visitado y recargar `/expenses/1`.
- [ ] Probar el teclado virtual, cancelar y volver con el sistema. Un alta offline
  debe conservar sus campos y pedir conexión; reconectar y confirmar un alta
  controlada solo cuando corresponda crear ese registro.
- [ ] Abrir STP1 en Expo Go compatible con SDK 57 y probar navegación/formulario.
- [ ] Adjuntar capturas equivalentes de Inicio, Gastos, detalle, formulario y Ajustes
  de PWA instalada y Expo Go. Las [capturas actuales](../pwa/README.md#capturas-de-navegador)
  corresponden a Chromium de computadora.
- [ ] Si es grupal, identificar aportes de cada integrante. El historial actual
  contiene `Niquinhoo` y `Facundo Nicolás Triberti`; las identidades de Git por sí
  solas no acreditan que sean personas distintas ni trabajo colaborativo.

## Referencias

- [Documentación de Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/).
- [Instalación compatible con Expo CLI](https://docs.expo.dev/more/expo-cli/#installing-dependencies).
- [Cache API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Cache).
- [Lighthouse — documentación oficial](https://developer.chrome.com/docs/lighthouse/overview).
- [Configuración y despliegue con Access](despliegue-cloudflare-sprint-2.md).
