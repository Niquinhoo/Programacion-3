import { StyleSheet, Text, View } from 'react-native';
import ExpenseSheet from '../components/ExpenseSheet';
import { expenses } from '../data/expenses';
import { formatAmount, formatDate } from '../utils/expense';
import { colors, fonts, styles } from '../styles';

export default function ExpenseDetailScreen({ route, navigation }) {
  const expense = expenses.find((item) => item.id === route.params?.expenseId);

  return (
    <ExpenseSheet title="Detalle del gasto" navigation={navigation}>
      {expense ? (
        <>
          <Text style={localStyles.title}>{expense.name}</Text>
          <View style={[styles.card, localStyles.card]}>
            <Text style={styles.label}>MONTO</Text>
            <Text style={styles.amount}>{formatAmount(expense.amount)}</Text>
            <View style={localStyles.divider} />
            <View style={localStyles.row}><Text style={styles.label}>CATEGORÍA</Text><Text style={localStyles.category}>{expense.category}</Text></View>
            <View style={localStyles.row}><Text style={styles.label}>FECHA</Text><Text style={styles.muted}>{formatDate(expense.date)}</Text></View>
          </View>
        </>
      ) : (
        <View style={styles.card}><Text style={styles.subtitle}>No se encontró el gasto</Text><Text style={styles.muted}>Volvé a la lista para elegir otro movimiento.</Text></View>
      )}
    </ExpenseSheet>
  );
}

const localStyles = StyleSheet.create({
  title: { color: colors.text, fontFamily: fonts.extraBold, fontSize: 26, lineHeight: 33, letterSpacing: -0.8 },
  card: { padding: 18, gap: 10 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  category: { color: colors.primary, fontFamily: fonts.bold, fontSize: 13, backgroundColor: colors.surfaceStrong, borderRadius: 99, overflow: 'hidden', paddingHorizontal: 11, paddingVertical: 7 },
});
