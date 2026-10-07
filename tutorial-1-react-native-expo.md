# Tutorial 1 — React Native y Expo

Guía de preparación para trabajar en el Sprint 1.

**Fuente:** [Tutorial 1: Introducción al entorno de desarrollo con React Native y Expo](https://programacion3.notion.site/Tutorial-1-Introducci-n-al-entorno-de-desarrollo-con-React-Native-y-Expo-3f028c25041380ecae3fed1bcf40b6fa)  
**Consultado:** 7 de octubre de 2026

## Objetivos

Al terminar, se espera poder explicar para qué sirve Expo dentro de React Native, preparar el entorno, crear un proyecto, ejecutarlo en un teléfono o emulador, modificar código básico y reconocer la estructura inicial.

## Requisitos

- Node.js LTS; la guía indica Node 22.11.0 o superior.
- Editor de código (VS Code es recomendado).
- Expo Go instalado en un teléfono Android o iOS.
- Computadora y teléfono en la misma red Wi-Fi.

Comprobar Node y npm desde una terminal:

```sh
node -v
npm -v
```

Para probar en un iPhone físico, iniciar sesión con la misma cuenta de Expo en la terminal y en Expo Go; la guía indica usar `npx expo login`.

El camino recomendado es un teléfono real con Expo Go. El uso de emuladores es opcional: Android requiere Android Studio y un dispositivo virtual; el simulador de iOS requiere macOS y Xcode. Sin una Mac se puede probar en un iPhone real con Expo Go.

## Expo en este proyecto

Expo permite comenzar con React Native sin preparar Android Studio o Xcode para la primera ejecución. Expo Go abre el proyecto escaneando el QR del servidor de desarrollo. Una development build se reserva para proyectos que necesitan módulos nativos propios.

## Crear el proyecto

Usar la plantilla mínima en JavaScript:

```sh
npx create-expo-app@latest ExpenseTracker --template blank
cd ExpenseTracker
```

La plantilla `blank` evita pantallas de ejemplo y navegación preconfigurada; el punto de entrada indicado por la guía es `App.js`. Expo también ofrece otras plantillas, pero esta es la seleccionada para la cursada.

## Ejecutar y modificar la app

Dentro de la carpeta:

```sh
npx expo start
```

Escanear el QR con Expo Go. En Android se usa el escáner de Expo Go; en iPhone, la cámara. Para emuladores, la terminal permite abrir Android con `a` e iOS con `i` (este último, en macOS).

La primera pantalla se puede modificar en `App.js` usando componentes nativos como `View` y `Text`, con estilos definidos mediante `StyleSheet`. Al guardar, Fast Refresh actualiza la app. Si la red bloquea la conexión, la guía propone `npx expo start --tunnel`, aunque la recarga será más lenta.

## Estructura inicial

- `App.js`: pantalla inicial de la plantilla `blank`.
- `app.json`: configuración de la aplicación.
- `package.json`: dependencias y scripts.
- `assets/`: imágenes e íconos.
- `node_modules/`: dependencias instaladas; se genera automáticamente y no se sube al repositorio.

La guía propone separar pantallas y componentes bajo `src/`. Para la estructura exacta y la navegación evaluable de ExpenseTracker, seguir la **US2** de [ExpenseTracker Sprint 1](expense-tracker-sprint-1.md).

## Alcance del Sprint 1

El tutorial también menciona almacenamiento con SQLite como tema posterior. Para esta entrega prevalece el alcance de Sprint 1: no se requiere SQLite, Context ni APIs remotas; sí se solicita React Navigation en la US6.

