import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, Text } from 'react-native';
import TabNavigator from './TabNavigator';
import ExpenseDetailScreen from '../screens/ExpenseDetailScreen';
import NewExpenseModal from '../screens/NewExpenseModal';
import { colors } from '../styles';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator id="RootStack" screenOptions={{ headerTintColor: colors.primary, headerBackTitle: 'Volver' }}>
      <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="DetalleGasto"
        component={ExpenseDetailScreen}
        options={{ title: 'Detalle del gasto' }}
      />
      <Stack.Screen
        name="NuevoGasto"
        component={NewExpenseModal}
        options={({ navigation }) => ({
          title: 'Nuevo gasto',
          presentation: 'modal',
          headerBackVisible: false,
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar formulario"
              hitSlop={12}
              onPress={() => navigation.goBack()}
              style={{ minHeight: 48, paddingHorizontal: 12, justifyContent: 'center' }}
            >
              <Text style={{ color: colors.primary, fontSize: 16 }}>Cerrar</Text>
            </Pressable>
          ),
        })}
      />
    </Stack.Navigator>
  );
}
