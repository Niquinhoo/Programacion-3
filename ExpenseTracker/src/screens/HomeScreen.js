import { Text, View } from 'react-native';
import Screen from '../components/Screen';
import ActionButton from '../components/ActionButton';
import { styles } from '../styles';

export default function HomeScreen({ navigation }) {
  return (
    <Screen>
      <View style={styles.field}>
        <Text style={styles.muted}>¡Bienvenido!</Text>
        <Text style={styles.title}>ExpenseTracker</Text>
        <Text style={styles.text}>Registrá tus gastos y conocé en qué usás tu dinero.</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.subtitle}>Tus gastos, en un solo lugar</Text>
        <Text style={styles.text}>
          Explorá los gastos de ejemplo o probá el formulario para cargar un nuevo gasto.
        </Text>
        <ActionButton title="Ver gastos" onPress={() => navigation.navigate('Gastos')} />
        <ActionButton title="Nuevo gasto" onPress={() => navigation.navigate('NuevoGasto')} />
      </View>
    </Screen>
  );
}
