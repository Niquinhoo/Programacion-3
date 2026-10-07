import { StatusBar } from 'expo-status-bar';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNavigator from './src/navigation/StackNavigator';
import { colors } from './src/styles';

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, ...colors },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={theme}>
        <StatusBar style="dark" />
        <StackNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
