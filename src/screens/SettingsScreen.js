import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Screen from '../components/Screen';
import { categories } from '../data/expenses';
import { colors, fonts, styles } from '../styles';

/** @type {{ title: string, rows: { icon: keyof typeof Ionicons.glyphMap, label: string, value?: string, message: string }[] }[]} */
const groups = [
  { title: 'CUENTA', rows: [
    { icon: 'person-outline', label: 'Editar perfil', message: 'El perfil es de ejemplo. La edición de cuentas no está habilitada en esta demostración.' },
    { icon: 'notifications-outline', label: 'Notificaciones', message: 'Esta demostración no envía notificaciones.' },
  ] },
  { title: 'APP', rows: [
    { icon: 'color-palette-outline', label: 'Apariencia', value: 'Claro', message: 'La app utiliza un tema claro y azul para todas las acciones.' },
    { icon: 'shield-checkmark-outline', label: 'Seguridad', message: 'Esta demo no solicita credenciales ni guarda información personal.' },
    { icon: 'pie-chart-outline', label: 'Categorías', message: `Categorías disponibles: ${categories.join(', ')}.` },
    { icon: 'wallet-outline', label: 'Moneda y formato', value: 'ARS', message: 'Los montos se muestran en pesos argentinos (ARS), con punto para miles y coma para decimales.' },
  ] },
  { title: 'SOPORTE', rows: [
    { icon: 'help-circle-outline', label: 'Ayuda y soporte', message: 'Cargá un gasto desde Inicio. El formulario valida los datos y muestra una confirmación sin guardarlos.' },
    { icon: 'chatbox-ellipses-outline', label: 'Enviar sugerencia', message: 'El envío de sugerencias no está habilitado en esta demostración.' },
    { icon: 'information-circle-outline', label: 'Sobre la app', value: 'v1.0.0', message: 'ExpenseTracker · Versión 1.0.0. Prototipo del Sprint 1 con gastos de ejemplo y sin persistencia.' },
  ] },
];

export default function SettingsScreen() {
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');

  return (
    <Screen fullBleed>
      {isFocused && <StatusBar style="dark" />}
      <View style={[localStyles.body, { paddingTop: insets.top + 24 }]}>
        <Text style={localStyles.title}>Configuración</Text>
        {groups.map((group) => (
          <View key={group.title} style={localStyles.section}>
            <Text style={localStyles.sectionLabel}>{group.title}</Text>
            <View style={localStyles.group}>
              {group.title === 'CUENTA' && (
                <View style={localStyles.profile}>
                  <View style={localStyles.avatar}>
                    <Text style={localStyles.initial}>N</Text>
                  </View>
                  <View style={localStyles.profileText}>
                    <Text style={localStyles.profileName}>Nicolás</Text>
                    <Text style={localStyles.profileHint}>Modo demostración</Text>
                  </View>
                  <Text style={localStyles.demo}>DEMO</Text>
                </View>
              )}
              {group.rows.map((row, index) => (
                <Pressable
                  key={row.label}
                  accessibilityRole="button"
                  accessibilityLabel={[row.label, row.value].filter(Boolean).join(', ')}
                  onPress={() => setMessage(row.message)}
                  style={({ pressed }) => [
                    localStyles.row,
                    (index > 0 || group.title === 'CUENTA') && localStyles.divider,
                    pressed && localStyles.pressed,
                  ]}
                >
                  <Ionicons name={row.icon} size={20} color={colors.muted} />
                  <Text style={localStyles.rowLabel}>{row.label}</Text>
                  {row.value && <Text style={localStyles.value}>{row.value}</Text>}
                  <Ionicons name="chevron-forward" size={15} color={colors.muted} />
                </Pressable>
              ))}
            </View>
          </View>
        ))}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar sesión"
          onPress={() => setMessage('Esta demo no tiene una sesión activa ni requiere iniciar sesión.')}
          style={({ pressed }) => [localStyles.logout, pressed && localStyles.pressed]}
        >
          <Ionicons name="log-out-outline" size={21} color={colors.primary} />
          <Text style={localStyles.logoutLabel}>Cerrar sesión</Text>
          <Ionicons name="chevron-forward" size={15} color={colors.primary} />
        </Pressable>
        {Boolean(message) && (
          <View style={styles.card}>
            <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.muted}>
              {message}
            </Text>
            <Pressable accessibilityRole="button" onPress={() => setMessage('')} style={localStyles.dismiss}>
              <Text style={localStyles.logoutLabel}>Entendido</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Screen>
  );
}

const localStyles = StyleSheet.create({
  body: { paddingHorizontal: 16, paddingBottom: 72, gap: 18 },
  title: { color: colors.text, fontFamily: fonts.extraBold, fontSize: 27, letterSpacing: -1, marginBottom: 2 },
  section: { gap: 7 },
  sectionLabel: { color: colors.muted, fontFamily: fonts.regular, fontSize: 10, letterSpacing: 1.1, paddingLeft: 12 },
  group: { backgroundColor: colors.card, borderRadius: 18, overflow: 'hidden', paddingHorizontal: 14 },
  profile: { minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 38, height: 38, borderRadius: 13, backgroundColor: colors.surfaceStrong, alignItems: 'center', justifyContent: 'center' },
  initial: { color: colors.primary, fontFamily: fonts.semiBold, fontSize: 19 },
  profileText: { flex: 1, gap: 3 },
  profileName: { color: colors.text, fontFamily: fonts.semiBold, fontSize: 13 },
  profileHint: { color: colors.muted, fontFamily: fonts.regular, fontSize: 11 },
  demo: { color: colors.muted, fontFamily: fonts.mono, fontSize: 9 },
  row: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10 },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#EDF1F7' },
  rowLabel: { flex: 1, color: colors.text, fontFamily: fonts.medium, fontSize: 12 },
  value: { color: colors.muted, fontFamily: fonts.regular, fontSize: 11 },
  pressed: { opacity: 0.65 },
  logout: { minHeight: 46, flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.card, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16 },
  logoutLabel: { flex: 1, color: colors.primary, fontFamily: fonts.medium, fontSize: 12 },
  dismiss: { minHeight: 44, justifyContent: 'center' },
});
