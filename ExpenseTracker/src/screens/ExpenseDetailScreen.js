import { Text, View } from 'react-native';
import Screen from '../components/Screen';
import { expenses } from '../data/expenses';
import { formatAmount } from '../utils/expense';
import { styles } from '../styles';

export default function ExpenseDetailScreen({ route }) {
  const expense = expenses.find((item) => item.id === route.params?.expenseId);

  return (
    <Screen>
      {expense ? (
        <View style={styles.card}>
          <Text style={styles.title}>{expense.name}</Text>
          <Text style={styles.muted}>{expense.category}</Text>
          <Text style={styles.amount}>{formatAmount(expense.amount)}</Text>
          <Text style={styles.muted}>Este gasto es un ejemplo.</Text>
        </View>
      ) : (
        <Text style={styles.text}>No se encontró el gasto.</Text>
      )}
    </Screen>
  );
}
