import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ExpenseHero from '../components/ExpenseHero';
import NewExpenseButton from '../components/NewExpenseButton';
import { colors, fonts } from '../styles';

const Tab = createBottomTabNavigator();
const icons = { Inicio: 'home', Gastos: 'bar-chart', Ajustes: 'settings' };

function renderTabLayout(props) {
  return <TabLayout {...props} />;
}

function TabLayout({ children, state, navigation }) {
  const route = state.routes[state.index].name;
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const onHeroTransitionComplete = useCallback(() => navigation.setParams({ heroTransitionComplete: true }), [navigation]);
  return (
    <View style={localStyles.layout}>
      {route !== 'Ajustes' && <ExpenseHero expanded={route === 'Inicio'} collapsed={route === 'Inicio' && Boolean(state.routes[state.index].params?.heroCollapsed)} navigation={navigation} onAnimationComplete={onHeroTransitionComplete} />}
      <View style={localStyles.scenes} onLayout={({ nativeEvent }) => setLayout(nativeEvent.layout)}>
        <NewExpenseButton expanded={route === 'Inicio'} navigation={navigation} layout={layout} />
        {children}
      </View>
    </View>
  );
}

export default function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      id="MainTabs"
      layout={renderTabLayout}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => (
          <View style={localStyles.icon} aria-hidden>
            {focused && <View style={localStyles.indicator} />}
            <Ionicons name={icons[route.name]} size={25} color={color} />
          </View>
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontFamily: fonts.semiBold, marginTop: 3 },
        tabBarItemStyle: { paddingTop: 8, paddingBottom: 6 },
        tabBarStyle: { backgroundColor: colors.card, borderTopWidth: 0, borderTopLeftRadius: 28, borderTopRightRadius: 28, height: 72 + insets.bottom, paddingBottom: insets.bottom, elevation: 0 },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Gastos" component={ExpensesScreen} />
      <Tab.Screen name="Ajustes" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const localStyles = StyleSheet.create({
  layout: { flex: 1, backgroundColor: colors.background },
  scenes: { flex: 1, minHeight: 0 },
  icon: { alignItems: 'center', justifyContent: 'center', height: 30 },
  indicator: { position: 'absolute', top: -7, width: 20, height: 3, borderRadius: 3, backgroundColor: colors.primary },
});
