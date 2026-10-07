import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Screen from '../components/Screen';
import ActionButton from '../components/ActionButton';
import { categories } from '../data/expenses';
import { formatAmount, validateExpense } from '../utils/expense';
import { colors, styles } from '../styles';

export default function NewExpenseModal() {
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
    <Screen>
      <Text style={styles.title}>Cargá un gasto</Text>
      <Text style={styles.muted}>Completá los datos para probar el formulario.</Text>
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
        <Text style={styles.muted}>Usá coma o punto para decimales, sin separar miles.</Text>
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
              <Text style={[styles.text, category === item && localStyles.selectedText]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      <ActionButton title="Guardar" onPress={handleSave} />
      {Boolean(message) && (
        <Text
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          style={[styles.text, { color: hasError ? colors.notification : colors.primary }]}
        >
          {message}
        </Text>
      )}
    </Screen>
  );
}

const localStyles = StyleSheet.create({
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  category: {
    minHeight: 48,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    backgroundColor: colors.card,
    justifyContent: 'center',
  },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  selectedText: { color: '#FFFFFF' },
});
