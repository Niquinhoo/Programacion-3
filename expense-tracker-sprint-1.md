# ExpenseTracker — Sprint 1

Consignas de las historias de usuario del sprint.

**Fuente:** [ExpenseTracker Sprint 1](https://programacion3.notion.site/ExpenseTracker-Sprint-1-3f028c250413800d8811db3354a9391e)  
**Consultado:** 7 de octubre de 2026

## Objetivo y alcance

Construir un prototipo visual y navegable de ExpenseTracker con React Native y Expo. La app debe iniciar en Expo Go, mostrar pantallas simples y representar la experiencia inicial de consulta y carga de gastos.

En este sprint no se requiere persistir datos: SQLite, Context y APIs remotas quedan fuera del alcance evaluable.

## Criterios generales y entrega

- Mostrar progreso y participación individual, también si el trabajo se hace en grupo.
- Organizar correctamente el proyecto y usar componentes de React Native.
- Verificar que la app funcione en Expo Go.
- Entregar un repositorio Git con el código fuente completo. Se valorará el uso de ramas.
- Incluir en un README o archivo similar capturas de la app funcionando y evidencia de participación individual.

## US1 — Crear el proyecto Expo

**Código:** `#rn-s1-us1` · **Trabajo sugerido:** colaborativo

Iniciar ExpenseTracker con Expo para que el equipo comparta una misma base tecnológica.

**Tareas:** crear el proyecto `ExpenseTracker` usando la plantilla `blank`; comprobarlo en Expo Go; versionar el código en Git.

**Validación:** el proyecto existe, arranca con `npx expo start`, se ve en Expo Go y está versionado.

## US2 — Definir la estructura del proyecto

**Código:** `#rn-s1-us2` · **Trabajo sugerido:** colaborativo

Organizar el código con una estructura sencilla que facilite el crecimiento de la app.

Estructura sugerida:

```text
src/
├── components/
├── screens/
│   ├── HomeScreen.js
│   ├── ExpensesScreen.js
│   ├── ExpenseDetailScreen.js
│   ├── SettingsScreen.js
│   └── NewExpenseModal.js
├── navigation/
│   ├── TabNavigator.js
│   └── StackNavigator.js
└── assets/
```

La navegación con React Navigation forma parte de lo evaluable. Se pueden agregar carpetas si se justifica su uso.

**Validación:** la estructura existe, separa pantallas y componentes, y el proyecto sigue ejecutándose.

## US3 — Construir la pantalla de bienvenida

**Código:** `#main-s1-us3` · **Trabajo sugerido:** individual

Al abrir la app, la persona debe entender rápidamente su propósito. Mostrar el nombre **ExpenseTracker**, un mensaje de bienvenida y una descripción breve que indique que sirve para registrar gastos.

**Validación:** usar `Text`, al menos un `View` y `StyleSheet`; mantener la información legible.

## US4 — Construir el formulario de carga de gastos

**Código:** `#main-s1-us4` · **Trabajo sugerido:** individual

Representar el formulario de un futuro gasto con nombre, monto, categoría y un botón **Guardar** que responda a `onPress`. No hace falta guardar la información.

**Validación:** incluir campos de texto para nombre y monto y un botón funcional. Puede ejecutar una acción sencilla, como `console.log`, mostrar un `Alert` o un mensaje temporal. La interfaz debe ser utilizable.

## US5 — Construir el listado de gastos

**Código:** `#main-s1-us5` · **Trabajo sugerido:** individual

Mostrar una lista de ejemplo con estos gastos, definidos manualmente en el código:

- Supermercado — $25.000
- Combustible — $18.000
- Internet — $32.000

**Validación:** mostrar varios elementos en forma de lista y presentar descripción y monto para cada gasto.

## US6 — Integrar las vistas del sprint

**Código:** `#rn-s1-us6` · **Trabajo sugerido:** colaborativo

Preparar una demostración que reúna la pantalla de bienvenida, el formulario y el listado, con navegación funcional entre ellas. La consigna pide al menos un `TabNavigator` y un `StackNavigator`, sin errores de navegación.

**Validación:** acceder al formulario y al listado mediante navegación real; mostrar las pantallas con los navegadores indicados; mantener el código organizado en componentes reutilizables y la app ejecutándose sin errores.

## US7 — Bonus (opcional)

**Código:** `#rn-s1-us7`

Mejoras opcionales para quien quiera investigar más:

- Mostrar íconos con Expo Vector Icons.
- Usar colores para diferenciar categorías.
- Mostrar el total de gastos al final de la lista.
- Agregar imágenes o ilustraciones desde `assets/`.
