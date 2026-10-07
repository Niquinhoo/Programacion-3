import { Pressable, StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import ActionButton from '../components/ActionButton';
import { expenses } from '../data/expenses';
import { formatAmount } from '../utils/expense';
import { colors, styles } from '../styles';

export default function ExpensesScreen({ navigation }) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Screen>
      <Text style={styles.title}>Tus gastos</Text>
      <Text style={styles.muted}>Datos de ejemplo para explorar la app.</Text>
      {expenses.map((expense) => (
        <Pressable
          key={expense.id}
          accessibilityRole="button"
          accessibilityLabel={`Ver detalle de ${expense.name}, ${formatAmount(expense.amount)}`}
          style={({ pressed }) => [styles.card, pressed && { opacity: 0.75 }]}
          onPress={() => navigation.navigate('DetalleGasto', { expenseId: expense.id })}
        >
          <Text style={styles.subtitle}>{expense.name}</Text>
          <View style={localStyles.row}>
            <Text style={styles.muted}>{expense.category}</Text>
            <Text style={localStyles.amount}>{formatAmount(expense.amount)}</Text>
          </View>
        </Pressable>
      ))}
      <View style={styles.card}>
        <Text style={styles.label}>Total de gastos</Text>
        <Text style={styles.amount}>{formatAmount(total)}</Text>
      </View>
      <ActionButton title="Nuevo gasto" onPress={() => navigation.navigate('NuevoGasto')} />
    </Screen>
  );
}

const localStyles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  amount: { fontSize: 18, fontWeight: '600', color: colors.primary },
});
