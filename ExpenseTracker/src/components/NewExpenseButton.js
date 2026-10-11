import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, fonts } from '../styles';

export default function NewExpenseButton({ expanded, navigation, layout }) {
  const insets = useSafeAreaInsets();
  const [progress] = useState(() => new Animated.Value(expanded ? 1 : 0));
  const [jump] = useState(() => new Animated.Value(0));
  const [reduceMotion, setReduceMotion] = useState(true);
  const previousExpanded = useRef(expanded);
  const width = Math.max(56, Math.min(layout.width, 600) - 32 - insets.left - insets.right);
  const interpolate = (collapsed, open) => progress.interpolate({ inputRange: [0, 1], outputRange: [collapsed, open] });

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then(value => { if (active) setReduceMotion(value); }).catch(() => {});
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => { active = false; subscription.remove(); };
  }, []);

  useEffect(() => {
    if (previousExpanded.current === expanded) {
      progress.setValue(expanded ? 1 : 0);
      jump.setValue(0);
      return;
    }
    previousExpanded.current = expanded;
    jump.setValue(0);
    if (reduceMotion) {
      progress.setValue(expanded ? 1 : 0);
      return;
    }
    const animation = Animated.sequence([
      Animated.timing(progress, { toValue: expanded ? 1 : 0, duration: 360, easing: Easing.inOut(Easing.cubic), useNativeDriver: false }),
      Animated.timing(jump, { toValue: expanded ? -8 : -14, duration: 110, easing: Easing.out(Easing.quad), useNativeDriver: false }),
      Animated.spring(jump, { toValue: 0, stiffness: 220, damping: 14, mass: 0.5, useNativeDriver: false }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [expanded, jump, progress, reduceMotion]);

  return (
    <Animated.View pointerEvents="box-none" style={{ height: interpolate(0, 82), zIndex: 1 }}>
      <Animated.View
        testID="new-expense-button"
        style={[styles.button, {
          opacity: layout.width ? 1 : 0,
          width: interpolate(56, width),
          height: interpolate(56, 50),
          borderRadius: interpolate(28, 25),
          left: interpolate(layout.width - insets.right - 76, (layout.width - Math.min(layout.width, 600)) / 2 + 16 + insets.left),
          top: interpolate(layout.height - insets.bottom - 144, 16),
          transform: [{ translateY: jump }],
        }]}
      >
        <Pressable accessibilityRole="button" accessibilityLabel={expanded ? 'Cargar un gasto' : 'Nuevo gasto'} onPress={() => navigation.navigate('NuevoGasto')} style={({ pressed }) => [styles.touch, pressed && styles.pressed]}>
          <Animated.View aria-hidden style={[styles.plus, { left: interpolate(13, 20) }]}><Ionicons name="add" size={30} color={colors.card} /></Animated.View>
          <Animated.Text aria-hidden style={[styles.label, { opacity: progress }]} numberOfLines={1}>Cargar un gasto</Animated.Text>
          <Animated.View aria-hidden style={[styles.arrow, { opacity: progress }]}><Ionicons name="arrow-forward" size={22} color={colors.card} /></Animated.View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: { position: 'absolute', backgroundColor: colors.primary, shadowColor: colors.primary, shadowOpacity: 0.24, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 6 },
  touch: { flex: 1, borderRadius: 28, overflow: 'hidden', justifyContent: 'center' },
  plus: { position: 'absolute', top: 0, bottom: 0, justifyContent: 'center' },
  label: { marginLeft: 56, marginRight: 46, color: colors.card, fontFamily: fonts.bold, fontSize: 14, textAlign: 'center', textTransform: 'uppercase' },
  arrow: { position: 'absolute', right: 20, top: 0, bottom: 0, justifyContent: 'center' },
  pressed: { opacity: 0.9 },
});
