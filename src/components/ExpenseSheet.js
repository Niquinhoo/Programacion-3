import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated, BackHandler, Easing, Keyboard, KeyboardAvoidingView,
  Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, fonts } from '../styles';
import useReduceMotion from '../hooks/useReduceMotion';

export default function ExpenseSheet({ title, navigation, children }) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [progress] = useState(() => new Animated.Value(0));
  const reduceMotion = useReduceMotion(null);
  const [closing, setClosing] = useState(false);
  const backButton = useRef(null);

  const close = useCallback(() => {
    Keyboard.dismiss();
    setClosing(true);
    return true;
  }, []);

  useEffect(() => {
    if (reduceMotion === null) return;
    const animation = Animated.timing(progress, {
      toValue: closing ? 0 : 1,
      duration: reduceMotion ? 0 : closing ? 220 : 340,
      easing: closing ? Easing.in(Easing.cubic) : Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    });
    animation.start(({ finished }) => {
      if (finished && closing) navigation.goBack();
    });
    return () => animation.stop();
  }, [closing, navigation, progress, reduceMotion]);

  useEffect(() => {
    const back = BackHandler.addEventListener('hardwareBackPress', close);
    const previousFocus = Platform.OS === 'web' ? document.activeElement : null;
    const keyboard = event => {
      if (event.key === 'Escape') close();
      if (event.key === 'Tab') {
        const controls = Array.from(document.querySelectorAll(
          '[data-testid="expense-sheet"] input, [data-testid="expense-sheet"] [tabindex="0"]',
        ));
        const index = controls.indexOf(document.activeElement);
        const next = (index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
        event.preventDefault();
        if (controls[next] instanceof HTMLElement) controls[next].focus();
      }
    };
    if (Platform.OS === 'web') {
      backButton.current?.focus({ preventScroll: true });
      document.addEventListener('keydown', keyboard);
    }
    return () => {
      back.remove();
      if (Platform.OS === 'web') {
        document.removeEventListener('keydown', keyboard);
        if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
      }
    };
  }, [close]);

  return (
    <View style={localStyles.overlay}>
      <Animated.View
        pointerEvents="none"
        aria-hidden
        style={[StyleSheet.absoluteFill, localStyles.scrim, { opacity: progress }]}
      />
      <KeyboardAvoidingView
        style={[localStyles.container, { paddingTop: insets.top + 64 }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable
          testID="sheet-backdrop"
          accessibilityRole="button"
          accessibilityLabel="Cerrar tocando fuera del panel"
          onPress={close}
          style={localStyles.backdrop}
        />
        <Animated.View
          testID="expense-sheet"
          role="dialog"
          aria-modal
          accessibilityViewIsModal
          accessibilityLabel={title}
          onAccessibilityEscape={close}
          style={[localStyles.sheet, {
            maxHeight: height - insets.top - 64,
            transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [height, 0] }) }],
          }]}
        >
          <View aria-hidden style={localStyles.handle} />
          <View style={localStyles.header}>
            <Pressable ref={backButton} accessibilityRole="button" accessibilityLabel="Volver" onPress={close} style={localStyles.back}>
              <Ionicons name="arrow-back" size={23} color={colors.primary} />
            </Pressable>
            <Text accessibilityRole="header" style={localStyles.title}>{title}</Text>
          </View>
          <ScrollView
            style={localStyles.scroll}
            contentContainerStyle={[localStyles.content, { paddingBottom: 20 + insets.bottom }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  overlay: { flex: 1 },
  scrim: { backgroundColor: '#101D38A6' },
  container: { flex: 1 },
  backdrop: { flex: 1 },
  sheet: { flexShrink: 1, width: '100%', maxWidth: 600, alignSelf: 'center', backgroundColor: colors.background, borderTopLeftRadius: 26, borderTopRightRadius: 26, overflow: 'hidden' },
  handle: { width: 38, height: 4, borderRadius: 2, backgroundColor: '#BCCADD', alignSelf: 'center', marginTop: 9, marginBottom: 3 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 4 },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text, fontFamily: fonts.bold, fontSize: 15 },
  scroll: { flexGrow: 0, flexShrink: 1 },
  content: { paddingHorizontal: 20, paddingTop: 14, gap: 16 },
});
