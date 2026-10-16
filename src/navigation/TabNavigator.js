import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
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
  const route = state.routes[state.index];
  const isHome = route.name === 'Inicio';
  const isSettings = route.name === 'Ajustes';
  const homeKey = state.routes.find(item => item.name === 'Inicio').key;
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const onHeroTransitionChange = useCallback(({ complete, lockedUntil }) => navigation.dispatch({
    ...CommonActions.setParams({ heroTransitionComplete: complete, heroLockedUntil: lockedUntil }),
    source: homeKey,
  }), [navigation, homeKey]);
  return (
    <View style={localStyles.layout}>
      {!isSettings && (
        <ExpenseHero
          expanded={isHome}
          collapsed={isHome && Boolean(route.params?.heroCollapsed)}
          navigation={navigation}
          onTransitionChange={onHeroTransitionChange}
        />
      )}
      <View style={localStyles.scenes} onLayout={({ nativeEvent }) => setLayout(nativeEvent.layout)}>
        {!isSettings && <NewExpenseButton expanded={isHome} navigation={navigation} layout={layout} />}
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
        tabBarLabelPosition: 'below-icon',
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
