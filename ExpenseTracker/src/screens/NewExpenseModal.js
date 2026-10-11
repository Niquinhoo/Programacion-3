import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import ExpenseSheet from '../components/ExpenseSheet';
import ActionButton from '../components/ActionButton';
import { categories } from '../data/expenses';
import { formatAmount, validateExpense } from '../utils/expense';
import { colors, fonts, styles } from '../styles';

export default function NewExpenseModal({ navigation }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [message, setMessage] = useState('');
  const [hasError, setHasError] = useState(false);

  function handleSave() {
    const result = validateExpense({ name, amount, category });
    setHasError(Boolean(result.error));
    if (result.error) {
      setMessage(result.error);
      return;
    }
    const expense = result.expense;
    setMessage(
      `Formulario enviado: ${expense.name} · ${formatAmount(expense.amount)} · ${expense.category}. Esta demo no guarda el gasto.`,
    );
  }

  return (
    <ExpenseSheet title="Nuevo gasto" navigation={navigation}>
      <Text style={localStyles.title}>Cargá un gasto</Text>
      <View style={localStyles.fields}>
        <View style={styles.field}>
          <Text nativeID="name-label" style={styles.label}>Nombre</Text>
          <TextInput
            accessibilityLabel="Nombre del gasto"
            accessibilityLabelledBy="name-label"
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ej.: Supermercado"
            placeholderTextColor={colors.muted}
            maxLength={100}
            autoCapitalize="sentences"
          />
        </View>
        <View style={styles.field}>
          <Text nativeID="amount-label" style={styles.label}>Monto (ARS)</Text>
          <TextInput
            accessibilityLabel="Monto del gasto en pesos argentinos"
            accessibilityLabelledBy="amount-label"
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="Ej.: 25000,50"
            placeholderTextColor={colors.muted}
            keyboardType="decimal-pad"
            maxLength={18}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Categoría</Text>
          <View style={localStyles.categories} accessibilityRole="radiogroup" accessibilityLabel="Categoría">
            {categories.map((item) => (
              <Pressable
                key={item}
                accessibilityRole="radio"
                aria-checked={category === item}
                onPress={() => setCategory(item)}
                style={[localStyles.category, category === item && localStyles.selected]}
              >
                <Text style={[localStyles.categoryText, category === item && localStyles.selectedText]}>
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
      <ActionButton title="Guardar" onPress={handleSave} />
      {Boolean(message) && (
        <View style={[localStyles.message, hasError ? localStyles.error : localStyles.success]}>
          <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={[styles.text, { color: hasError ? colors.notification : colors.success }]}>{message}</Text>
        </View>
      )}
    </ExpenseSheet>
  );
}

const localStyles = StyleSheet.create({
  title: { color: colors.text, fontFamily: fonts.extraBold, fontSize: 26, lineHeight: 33, letterSpacing: -0.8 },
  fields: { gap: 16 },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  category: {
    minHeight: 44,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 99,
    backgroundColor: colors.surfaceSoft,
    justifyContent: 'center',
  },
  categoryText: { color: colors.muted, fontFamily: fonts.semiBold, fontSize: 12 },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  selectedText: { color: colors.card },
  message: { borderRadius: 16, borderWidth: 1, padding: 14 },
  error: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  success: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' },
});
