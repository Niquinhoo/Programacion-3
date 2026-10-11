import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Screen from '../components/Screen';
import ExpenseRow from '../components/ExpenseRow';
import { categories, expenses } from '../data/expenses';
import { filterExpenses } from '../utils/expense';
import { colors, fonts, styles } from '../styles';

export default function ExpensesScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [query, setQuery] = useState('');
  const [period, setPeriod] = useState('Todos');
  const [category, setCategory] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const visibleExpenses = filterExpenses(expenses, { query, period, category });

  return (
    <Screen fullBleed>
      {isFocused && <StatusBar style="light" />}
      <View style={localStyles.body}>
        <View style={localStyles.search}>
          <Ionicons name="search-outline" size={22} color={colors.primaryStrong} />
          <TextInput
            accessibilityLabel="Buscar gastos, comercios o categorías"
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar gastos, comercios o categorías..."
            placeholderTextColor={colors.muted}
            style={localStyles.searchInput}
          />
          {Boolean(query) && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Limpiar búsqueda"
              onPress={() => setQuery('')}
              style={localStyles.clear}
            >
              <Ionicons name="close" size={20} color={colors.primary} />
            </Pressable>
          )}
        </View>
        <View style={localStyles.filters}>
          {['Todos', 'Hoy', 'Semana', 'Mes'].map((item) => (
            <Pressable
              key={item}
              accessibilityRole="button"
              accessibilityState={{ selected: period === item }}
              onPress={() => setPeriod(item)}
              style={[localStyles.chip, localStyles.periodChip, period === item && localStyles.selected]}
            >
              <Text style={[localStyles.chipText, period === item && localStyles.selectedText]}>{item}</Text>
            </Pressable>
          ))}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Filtrar por categoría"
            accessibilityState={{ expanded: showCategories, selected: Boolean(category) }}
            onPress={() => setShowCategories(!showCategories)}
            style={[localStyles.chip, localStyles.categoryChip, Boolean(category) && localStyles.selected]}
          >
            <Ionicons name="options-outline" size={17} color={category ? colors.card : colors.primary} />
            <Text style={[localStyles.chipText, Boolean(category) && localStyles.selectedText]}>Categorías</Text>
          </Pressable>
        </View>
        {showCategories && (
          <View style={localStyles.categories}>
            {['', ...categories].map((item) => (
              <Pressable
                key={item}
                accessibilityRole="button"
                accessibilityState={{ selected: category === item }}
                onPress={() => setCategory(item)}
                style={[localStyles.chip, category === item && localStyles.selected]}
              >
                <Text style={[localStyles.chipText, category === item && localStyles.selectedText]}>{item || 'Todas'}</Text>
              </Pressable>
            ))}
          </View>
        )}
        <View style={localStyles.list}>
          {visibleExpenses.map((expense) => (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              onPress={() => navigation.navigate('DetalleGasto', { expenseId: expense.id })}
            />
          ))}
          {visibleExpenses.length === 0 && (
            <View style={styles.card}>
              <Text style={styles.subtitle}>Sin movimientos</Text>
              <Text style={styles.muted}>Probá otra búsqueda o cambiá los filtros.</Text>
            </View>
          )}
        </View>
      </View>
    </Screen>
  );
}

const localStyles = StyleSheet.create({
  body: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 72, gap: 12 },
  search: { minHeight: 46, borderWidth: 1, borderColor: '#BED0ED', borderRadius: 99, paddingLeft: 15, paddingRight: 8, flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchInput: { flex: 1, minWidth: 0, minHeight: 44, paddingVertical: 10, color: colors.text, fontFamily: fonts.regular, fontSize: 12 },
  clear: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  filters: { flexDirection: 'row', gap: 4 },
  chip: { minHeight: 44, paddingHorizontal: 9, borderRadius: 99, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  periodChip: { flex: 1, minWidth: 44, paddingHorizontal: 0 },
  chipText: { color: colors.muted, fontFamily: fonts.medium, fontSize: 11 },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  selectedText: { color: colors.card },
  categoryChip: { flexDirection: 'row', flexShrink: 0, paddingHorizontal: 7, gap: 5 },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  list: { gap: 8 },
});
