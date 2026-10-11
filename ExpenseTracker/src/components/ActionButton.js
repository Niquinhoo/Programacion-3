import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, fonts } from '../styles';

export default function ActionButton({ title, onPress, icon = null }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <View style={styles.content}>
        {icon && <Ionicons name={icon} size={26} color={colors.card} />}
        <Text style={styles.label}>{title}</Text>
      </View>
      <Ionicons name="arrow-forward" size={22} color={colors.card} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: colors.primary, borderRadius: 99, minHeight: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, gap: 10, shadowColor: colors.primary, shadowOpacity: 0.16, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  content: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  label: { color: colors.card, fontFamily: fonts.bold, fontSize: 14, textAlign: 'center', textTransform: 'uppercase' },
});
