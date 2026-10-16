import { useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Screen from '../components/Screen';
import ExpenseRow from '../components/ExpenseRow';
import { HERO_STABLE_MS } from '../components/ExpenseHero';
import { expenses } from '../data/expenses';
import { colors, fonts } from '../styles';

export default function HomeScreen({ navigation, route }) {
  const isFocused = useIsFocused();
  const [scrollHeight, setScrollHeight] = useState(0);
  const dragStartedCollapsed = useRef(false);
  const scrollY = useRef(0);
  const scrollLockedUntil = useRef(0);
  const heroCollapsed = Boolean(route.params?.heroCollapsed);
  const heroTransitioning = heroCollapsed && !route.params?.heroTransitionComplete;

  function requestHero(collapsed) {
    if (!isFocused || collapsed === heroCollapsed || route.params?.heroTransitionComplete === false) return;
    if (Date.now() < Math.max(scrollLockedUntil.current, route.params?.heroLockedUntil ?? 0)) return;
    scrollLockedUntil.current = Date.now() + HERO_STABLE_MS;
    navigation.setParams({ heroCollapsed: collapsed });
  }

  function handleScrollBeginDrag({ nativeEvent }) {
    if (!isFocused) return;
    dragStartedCollapsed.current = heroCollapsed;
    if (heroCollapsed && nativeEvent.contentOffset.y <= 0) {
      requestHero(false);
    }
  }

  function handleScroll({ nativeEvent }) {
    if (!isFocused) return;
    const y = nativeEvent.contentOffset.y;
    scrollY.current = y;
    if (y <= 0 && heroCollapsed && !dragStartedCollapsed.current) return;
    const collapsed = y > 0;
    if (collapsed === heroCollapsed) return;
    requestHero(collapsed);
  }

  function handleWheel({ nativeEvent }) {
    if (!isFocused) return;
    if (nativeEvent.deltaY > 0) {
      dragStartedCollapsed.current = false;
      return;
    }
    if (!heroCollapsed || nativeEvent.deltaY >= 0) return;
    dragStartedCollapsed.current = true;
    if (scrollY.current <= 0) requestHero(false);
  }

  // shortcut: reserva 264 px al contraer para evitar oscilaciones; ajustar si cambia la altura del hero.
  return (
    <Screen
      fullBleed
      onScroll={handleScroll}
      onScrollBeginDrag={handleScrollBeginDrag}
      onWheel={Platform.OS === 'web' ? handleWheel : undefined}
      onLayout={({ nativeEvent }) => setScrollHeight(nativeEvent.layout.height)}
      contentContainerStyle={{ minHeight: scrollHeight + (heroTransitioning ? 264 : 24) }}
    >
      {isFocused && <StatusBar style="light" />}
      <View style={localStyles.body}>
        <View style={localStyles.sectionHead}>
          <Text style={localStyles.sectionTitle}>Movimientos recientes</Text>
          <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Gastos')} style={localStyles.allLink}>
            <Text style={localStyles.link}>Ver todos</Text>
            <Ionicons name="arrow-forward" size={17} color={colors.primary} />
          </Pressable>
        </View>
        <View style={localStyles.list}>
          {expenses.slice(0, 3).map((expense) => (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              onPress={() => navigation.navigate('DetalleGasto', { expenseId: expense.id })}
            />
          ))}
        </View>
      </View>
    </Screen>
  );
}

const localStyles = StyleSheet.create({
  body: { paddingHorizontal: 16, gap: 12 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 14 },
  sectionTitle: { flex: 1, color: colors.text, fontFamily: fonts.extraBold, fontSize: 18, letterSpacing: -0.8 },
  allLink: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 5 },
  link: { color: colors.primary, fontFamily: fonts.semiBold, fontSize: 12 },
  list: { gap: 8 },
});
