# US#2 — Definir la estructura del proyecto

**Código de consigna:** `#rn-s1-us2` · **Trabajo sugerido:** colaborativo · **Fuente:** [consigna local del sprint](../../expense-tracker-sprint-1.md#L32).

## Consigna

Separar pantallas, componentes, navegación y recursos en una estructura sencilla. La consigna incluye React Navigation entre los aspectos evaluables y permite sumar carpetas si se justifica su uso.

## Qué quedó implementado

`ExpenseTracker/src/` separa `components/`, `screens/`, `navigation/` y `assets/`. También incorpora `data/`, `utils/` y `styles.js` para mantener juntos los datos de demostración, las operaciones de gastos y los estilos compartidos. Las pantallas usan piezas comunes como `Screen`, `ExpenseRow`, `ExpenseHero` y `ExpenseSheet`. `TabNavigator` y `StackNavigator` viven en archivos separados ([componentes](../../ExpenseTracker/src/components/), [pantallas](../../ExpenseTracker/src/screens/), [navegación](../../ExpenseTracker/src/navigation/)).

## Contraste de validación

| Criterio | Evidencia | Estado |
| --- | --- | --- |
| Separar pantallas y componentes | Carpetas `src/screens/` y `src/components/`. | Cumple |
| Separar navegación y recursos | `src/navigation/` y `src/assets/`. | Cumple |
| Incorporar React Navigation | Dependencias y navegadores tab/stack. | Cumple |
| Mantener el proyecto ejecutable | Tests, lint, typecheck y Expo Doctor pasan; las pruebas nativas siguen pendientes. | Cumple en código; Expo Go pendiente |

## Resultado

**Cumple la estructura pedida.** `data/` y `utils/` amplían la estructura sugerida sin cambiar el alcance funcional del sprint.
