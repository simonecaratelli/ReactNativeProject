import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { LoginForm } from './src/features/auth/components/LoginForm';
import { HomeScreen } from './src/features/meals/screens/HomeScreen';
import { DetailsScreen } from './src/features/meals/components/DetailsScreen';
import { loadPersistedUser, savePersistedUser } from './src/features/meals/services/storage'; 

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true); // <-- STATO DI CARICAMENTO SESSIONE
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // --- RECUPERA LA SESSIONE AL RIAVVIO (Stesso identico modo dei preferiti) ---
  useEffect(() => {
    loadPersistedUser()
      .then((savedUser) => {
        if (savedUser) {
          setUser(savedUser);
        }
      })
      .finally(() => setAuthLoading(false));
  }, []);

  // Intercetta il login e lo salva stabilmente nello storage locale
  const handleLoginSuccess = async (loggedUser: any) => {
    setUser(loggedUser);
    await savePersistedUser(loggedUser); // <-- SALVA UTENTE
  };

  // Intercetta il logout e ripulisce lo storage locale
  const handleLogout = async () => {
    setUser(null);
    await savePersistedUser(null); // <-- RIMUOVE UTENTE
  };

  // Schermata di caricamento iniziale mentre legge da AsyncStorage
  if (authLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Se non c'è un utente in memoria, mostra il form di Login
  if (!user) {
    return (
      <LoginForm 
        onLoginSuccess={handleLoginSuccess} 
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
                  username={user.name || 'Utente'}
                  avatarUrl={user.avatarUri}
                  setUsername={handleLogout} // <-- Ora usa la funzione che ripulisce lo storage
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

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7', // Si adatta bene come sfondo neutro di avvio
  },
});