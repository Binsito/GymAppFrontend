import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import RutinasScreen from './screens/RutinasScreen';
import EntrenamientoScreen from './screens/EntrenamientoScreen';
import EjerciciosScreen from './screens/EjerciciosScreen';
import PerfilScreen from './screens/PerfilScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: true,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Rutinas" component={RutinasScreen} />
          <Stack.Screen name="Entrenamientos" component={EntrenamientoScreen} />
          <Stack.Screen name="Ejercicios" component={EjerciciosScreen} />
          <Stack.Screen name="Perfil" component={PerfilScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
