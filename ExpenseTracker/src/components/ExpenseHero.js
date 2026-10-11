import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { expenses } from '../data/expenses';
import { filterExpenses, formatAmount } from '../utils/expense';
import { colors, fonts } from '../styles';

export default function ExpenseHero({ expanded, collapsed = false, navigation, onAnimationComplete }) {
  const insets = useSafeAreaInsets();
  const showDetails = expanded && !collapsed;
  const [progress] = useState(() => new Animated.Value(showDetails ? 1 : 0));
  const [reduceMotion, setReduceMotion] = useState(true);
  const [introHeight, setIntroHeight] = useState(154);
  const [footerHeight, setFooterHeight] = useState(64);
  const items = expanded ? expenses : filterExpenses(expenses, { period: 'Mes' });
  const total = items.reduce((sum, expense) => sum + expense.amount, 0);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => setReduceMotion(true));
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: showDetails ? 1 : 0,
      duration: reduceMotion ? 0 : 360,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    });
    animation.start(({ finished }) => finished && onAnimationComplete());
    return () => animation.stop();
  }, [showDetails, progress, reduceMotion, onAnimationComplete]);

  return (
    <View testID="expense-hero" style={[styles.hero, { paddingTop: insets.top + 24 }]}>
      <Animated.View style={[styles.art, { transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [0, 14] }) }] }]} pointerEvents="none" aria-hidden>
        <View style={styles.outerOrbit} />
        <View style={styles.innerOrbit} />
        <View style={styles.lightOrbit} />
      </Animated.View>
      <View style={styles.heroTop}>
        <Text style={styles.eyebrow}>{expanded ? 'EXPENSETRACKER' : 'EXPENSETRACKER / GASTOS'}</Text>
        <Animated.View aria-hidden={expanded} style={[styles.demoBadge, { opacity: expanded && collapsed ? 0 : progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]}>
          <View style={styles.dot} /><Text style={styles.demoText}>DEMO</Text>
        </Animated.View>
      </View>
      <Animated.View aria-hidden={!showDetails} pointerEvents={showDetails ? 'auto' : 'none'} style={{ height: progress.interpolate({ inputRange: [0, 1], outputRange: [0, introHeight] }), opacity: progress, overflow: 'hidden' }}>
        <View onLayout={({ nativeEvent }) => setIntroHeight(nativeEvent.layout.height)} style={styles.intro}>
          <Text style={styles.title}>{'Tus gastos,\nmás claros.'}</Text>
          <Text style={styles.description}>Bienvenido. Registrá tus gastos y conocé en qué usás tu dinero.</Text>
        </View>
      </Animated.View>
      <View style={styles.balance}>
        <View style={styles.total}>
          <Text style={styles.totalLabel}>{expanded ? 'TOTAL DE GASTOS' : 'ESTE MES'}</Text>
          <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7} style={styles.amount}>{formatAmount(total)}</Text>
        </View>
        <Animated.View aria-hidden pointerEvents="none" style={{ opacity: progress, overflow: 'hidden', height: progress.interpolate({ inputRange: [0, 1], outputRange: [0, 104] }), width: progress.interpolate({ inputRange: [0, 1], outputRange: [0, 92] }), marginLeft: progress.interpolate({ inputRange: [0, 1], outputRange: [0, 12] }) }}>
          <View style={styles.chart}>
            {[28, 46, 70, 96].map((height) => <View key={height} style={[styles.bar, { height }]} />)}
          </View>
        </Animated.View>
      </View>
      <Animated.View aria-hidden={!showDetails} pointerEvents={showDetails ? 'auto' : 'none'} style={{ height: progress.interpolate({ inputRange: [0, 1], outputRange: [0, footerHeight] }), opacity: progress, overflow: 'hidden' }}>
        <View onLayout={({ nativeEvent }) => setFooterHeight(nativeEvent.layout.height)} style={styles.heroFooter}>
          <View style={styles.activity}>
            <View style={styles.countBadge}><Text style={styles.count}>{expenses.length} gastos</Text></View>
            <Text style={styles.hint}>de ejemplo</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Ver visión general de los gastos" onPress={() => navigation.navigate('Gastos')} style={styles.overview}>
            <Ionicons name="pie-chart-outline" size={19} color={colors.card} />
            <Text style={styles.overviewText}>VISIÓN GENERAL</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.card} />
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { width: '100%', maxWidth: 600, alignSelf: 'center', backgroundColor: colors.primaryStrong, borderBottomLeftRadius: 36, borderBottomRightRadius: 36, paddingHorizontal: 20, paddingBottom: 24, overflow: 'hidden' },
  art: { position: 'absolute', top: -14, right: 0, bottom: 0, left: 0, overflow: 'hidden' },
  outerOrbit: { position: 'absolute', width: 490, height: 490, borderRadius: 245, backgroundColor: '#073FA5', borderWidth: 1, borderColor: '#116CFA', top: -300, right: -125 },
  innerOrbit: { position: 'absolute', width: 400, height: 400, borderRadius: 200, backgroundColor: '#0759D9', borderWidth: 1, borderColor: '#008FFF', top: -290, right: -150 },
  lightOrbit: { position: 'absolute', width: 360, height: 360, borderRadius: 180, backgroundColor: '#0072E6', borderWidth: 1, borderColor: '#21B4FF', top: -295, left: -100 },
  heroTop: { minHeight: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  eyebrow: { flexShrink: 1, color: colors.card, fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1.2 },
  demoBadge: { flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1, borderColor: '#678BCC', borderRadius: 99, paddingHorizontal: 12, paddingVertical: 7 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#32EEA0' },
  demoText: { color: colors.card, fontFamily: fonts.mono, fontSize: 10 },
  intro: { paddingTop: 20, gap: 12 },
  title: { color: colors.card, fontFamily: fonts.extraBold, fontSize: 36, lineHeight: 42, letterSpacing: -1.5 },
  description: { color: '#DCEAFF', fontFamily: fonts.regular, fontSize: 12, lineHeight: 19, maxWidth: 260 },
  balance: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 22 },
  total: { flex: 1, gap: 4 },
  totalLabel: { color: '#DCEAFF', fontFamily: fonts.mono, fontSize: 10, lineHeight: 16, letterSpacing: 2 },
  amount: { color: colors.card, fontFamily: fonts.extraBold, fontSize: 48, lineHeight: 62, letterSpacing: -1.8 },
  chart: { width: 92, height: 104, flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingBottom: 8 },
  bar: { width: 17, borderRadius: 10, backgroundColor: '#2787FF' },
  heroFooter: { paddingTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  activity: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  countBadge: { backgroundColor: '#075C66', borderRadius: 99, paddingHorizontal: 11, paddingVertical: 8 },
  count: { color: '#72F5BE', fontFamily: fonts.bold, fontSize: 11 },
  hint: { color: '#DCEAFF', fontFamily: fonts.regular, fontSize: 10 },
  overview: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 8 },
  overviewText: { color: colors.card, fontFamily: fonts.mono, fontSize: 9, letterSpacing: 0.5 },
});
