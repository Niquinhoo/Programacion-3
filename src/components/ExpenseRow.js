import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, fonts } from '../styles';
import { formatAmount, formatDate } from '../utils/expense';

const categoryStyles = {
  Alimentos: { icon: 'cart-outline', color: '#08A94E', background: '#DFF8E9' },
  Transporte: { icon: 'car-outline', color: '#087FF5', background: '#E0F0FF' },
  Servicios: { icon: 'wifi-outline', color: '#9C23D5', background: '#F4E5FC' },
  Otros: { icon: 'receipt-outline', color: '#C37500', background: '#FFF3D6' },
};

export default function ExpenseRow({ expense, onPress }) {
  const category = categoryStyles[expense.category] || categoryStyles.Otros;
  const amount = formatAmount(expense.amount);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver detalle de ${expense.name}, ${amount}`}
      onPress={onPress}
      style={({ pressed }) => [localStyles.row, pressed && localStyles.pressed]}
    >
      <View style={[localStyles.mark, { backgroundColor: category.background }]}>
        <Ionicons name={category.icon} size={26} color={category.color} />
      </View>
      <View style={localStyles.details}>
        <Text numberOfLines={1} style={localStyles.name}>{expense.name}</Text>
        <Text numberOfLines={1} style={localStyles.category}>{expense.category}</Text>
      </View>
      <View style={localStyles.numbers}>
        <Text style={localStyles.amount}>{amount}</Text>
        <Text style={localStyles.date}>{formatDate(expense.date)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Pressable>
  );
}

const localStyles = StyleSheet.create({
  row: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 10 },
  pressed: { opacity: 0.75, transform: [{ scale: 0.99 }] },
  mark: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  details: { flex: 1, gap: 4, minWidth: 0 },
  name: { color: colors.text, fontFamily: fonts.bold, fontSize: 14, letterSpacing: -0.4 },
  category: { color: colors.muted, fontFamily: fonts.regular, fontSize: 12 },
  numbers: { alignItems: 'flex-end', gap: 4 },
  amount: { color: colors.text, fontFamily: fonts.bold, fontSize: 14, fontVariant: ['tabular-nums'] },
  date: { color: colors.muted, fontFamily: fonts.regular, fontSize: 11 },
});
