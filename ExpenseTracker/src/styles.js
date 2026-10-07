import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#0F766E',
  background: '#F5F7F6',
  card: '#FFFFFF',
  text: '#172B28',
  muted: '#526560',
  border: '#D6E1DD',
  notification: '#B42318',
};

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, gap: 20, width: '100%', maxWidth: 600, alignSelf: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 20, fontWeight: '600', color: colors.text },
  text: { fontSize: 16, lineHeight: 24, color: colors.text },
  muted: { fontSize: 15, lineHeight: 22, color: colors.muted },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 20, gap: 12 },
  amount: { fontSize: 32, fontWeight: '700', color: colors.primary },
  field: { gap: 8 },
  label: { fontSize: 16, fontWeight: '600', color: colors.text },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.card,
    color: colors.text,
    padding: 12,
    fontSize: 16,
  },
});
