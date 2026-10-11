import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#0057FF',
  primaryStrong: '#062A78',
  background: '#F3F7FC',
  card: '#FFFFFF',
  surfaceSoft: '#EEF4FC',
  surfaceStrong: '#DBE8FF',
  text: '#10112F',
  muted: '#61718D',
  border: '#D4E0F2',
  notification: '#B91C1C',
  success: '#166534',
};

export const fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
  mono: 'JetBrainsMono_500Medium',
  monoBold: 'JetBrainsMono_700Bold',
};

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 28, gap: 22, width: '100%', maxWidth: 600, alignSelf: 'center' },
  eyebrow: { fontFamily: fonts.monoBold, fontSize: 10, letterSpacing: 1.5, color: colors.primary },
  title: { fontFamily: fonts.extraBold, fontSize: 30, lineHeight: 37, letterSpacing: -1.2, color: colors.text },
  subtitle: { fontFamily: fonts.bold, fontSize: 18, lineHeight: 24, letterSpacing: -0.4, color: colors.text },
  text: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 23, color: colors.text },
  muted: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.muted },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    gap: 12,
    shadowColor: '#274472',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 7 },
    elevation: 2,
  },
  amount: { fontFamily: fonts.extraBold, fontSize: 32, letterSpacing: -1.2, color: colors.text },
  field: { gap: 8 },
  label: { fontFamily: fonts.bold, fontSize: 11, letterSpacing: 1.1, color: colors.muted, textTransform: 'uppercase' },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surfaceSoft,
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.medium,
    fontSize: 15,
  },
});
