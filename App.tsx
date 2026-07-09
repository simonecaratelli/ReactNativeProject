import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { LoginForm } from './src/features/auth/components/LoginForm';
import { HomeScreen } from './src/features/meals/screens/HomeScreen';
import { DetailsScreen } from './src/features/meals/components/DetailsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  // Salviamo l'oggetto utente intero per non perdere dati (come l'avatar)
  const [user, setUser] = useState<any | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  if (!user) {
    return (
      <LoginForm 
        onLoginSuccess={(loggedUser: any) => setUser(loggedUser)} 
        isDarkMode={isDarkMode} 
      />
    );
  }

  // Configurazione Deep Linking (Lab 14)
  const linking = {
    prefixes: ['italianmeals://'],
    config: {
      screens: {
        Home: 'home',
        Details: 'details/:id',
      },
    },
  };

  return (
    <SafeAreaProvider>
      <FavoritesProvider>
        <NavigationContainer linking={linking}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home">
              {(props) => (
                <HomeScreen
                  {...props}
                  username={user.username || user.name || 'Utente'}
                  avatarUrl={user.avatarUrl || user.avatar || user.image} // Passa l'avatar da auth
                  setUsername={setUser} // Passerà null per effettuare il logout
                  isDarkMode={isDarkMode}
                  setIsDarkMode={setIsDarkMode}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Details">
              {(props) => <DetailsScreen {...props} isDarkMode={isDarkMode} />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}