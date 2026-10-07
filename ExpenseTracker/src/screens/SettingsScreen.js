import { Text, View } from 'react-native';
import Screen from '../components/Screen';
import { styles } from '../styles';

export default function SettingsScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Ajustes</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Moneda</Text>
        <Text style={styles.text}>Peso argentino (ARS)</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.subtitle}>Acerca de ExpenseTracker</Text>
        <Text style={styles.text}>Versión 1.0.0 · Modo demostración</Text>
        <Text style={styles.muted}>
          Los gastos son ejemplos y el formulario permite probar la carga sin guardar información.
        </Text>
      </View>
    </Screen>
  );
}
