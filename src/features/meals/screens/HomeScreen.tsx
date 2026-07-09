import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { fetchItalianMeals, MealSummary } from '../services/mealsApi';
import { useFavorites } from '../../../context/FavoritesContext';
import { UserHeader } from '../components/UserHeader';
import { MealItem } from '../components/MealItem';

interface ScreenState {
  status: 'idle' | 'loading' | 'success' | 'error';
  items: MealSummary[];
  message: string;
}

export const HomeScreen = ({ navigation, username, avatarUrl, setUsername, isDarkMode, setIsDarkMode }: any) => {
  const { favoriteIds, isLoading: favoritesLoading, toggleFavorite } = useFavorites();
  
  const [state, setState] = useState<ScreenState>({
    status: 'idle',
    items: [],
    message: '',
  });
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState<boolean>(false);

  async function loadMeals() {
    setState({ status: 'loading', items: [], message: '' });
    try {
      const data = await fetchItalianMeals();
      setState({ status: 'success', items: data, message: '' });
    } catch {
      setState({
        status: 'error',
        items: [],
        message: 'Caricamento fallito. Controlla la connessione.',
      });
    }
  }

  useEffect(() => {
    if (username) {
      loadMeals();
    }
  }, [username]);

  const handleLogout = () => {
    setUsername(null);
    setSearchQuery('');
    setFilterFavoritesOnly(false);
  };

  const displayedMeals = state.items.filter((meal) => {
    const matchesSearch = meal.strMeal.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFav = filterFavoritesOnly ? favoriteIds.includes(meal.idMeal) : true;
    return matchesSearch && matchesFav;
  });

  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  if (favoritesLoading || state.status === 'loading') {
    return (
      <View style={[styles.center, themeStyles.container]}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={[styles.infoMsg, themeStyles.text, { marginTop: 8 }]}>Caricamento...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, themeStyles.container]}>
      <UserHeader 
        username={username} 
        avatarUrl={avatarUrl}
        isDarkMode={isDarkMode} 
        onToggleTheme={setIsDarkMode} 
        onLogout={handleLogout} 
      />

      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchBar, themeStyles.input]}
          placeholder="Cerca piatto italiano..."
          placeholderTextColor={isDarkMode ? '#8E8E93' : '#AEAEB2'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <View style={[styles.tabContainer, themeStyles.tabBg]}>
          <Pressable
            style={({ pressed }) => [
              styles.tabButton,
              !filterFavoritesOnly && (isDarkMode ? darkStyles.activeTab : lightStyles.activeTab),
              pressed && { opacity: 0.7 }
            ]}
            onPress={() => setFilterFavoritesOnly(false)}
          >
            <Text style={[styles.tabText, isDarkMode ? darkStyles.tabText : lightStyles.tabText, !filterFavoritesOnly && styles.activeTabText]}>
              Tutti i Piatti
            </Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.tabButton,
              filterFavoritesOnly && (isDarkMode ? darkStyles.activeTab : lightStyles.activeTab),
              pressed && { opacity: 0.7 }
            ]}
            onPress={() => setFilterFavoritesOnly(true)}
          >
            <Text style={[styles.tabText, isDarkMode ? darkStyles.tabText : lightStyles.tabText, filterFavoritesOnly && styles.activeTabText]}>
              Preferiti ({favoriteIds.length})
            </Text>
          </Pressable>
        </View>
      </View>

      {state.status === 'error' && (
        <View style={styles.center}>
          <Text style={[styles.infoMsg, themeStyles.text, { fontWeight: '500', marginBottom: 16 }]}>{state.message}</Text>
          <Pressable style={({ pressed }) => [styles.retryBtn, pressed && { opacity: 0.4, transform: [{ scale: 0.92 }] }]} onPress={loadMeals}>
            <Text style={styles.retryBtnText}>Riprova</Text>
          </Pressable>
        </View>
      )}

      {state.status === 'success' && displayedMeals.length === 0 && (
        <View style={styles.center}>
          <Text style={[styles.infoMsg, themeStyles.secondaryText]}>Nessun piatto trovato</Text>
        </View>
      )}

      {state.status === 'success' && displayedMeals.length > 0 && (
        <FlatList
          data={displayedMeals}
          keyExtractor={(item) => item.idMeal}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <MealItem
              meal={item}
              isFavorite={favoriteIds.includes(item.idMeal)}
              onToggleFavorite={toggleFavorite}
              onSelectMeal={(id) => navigation.navigate('Details', { id })}
              isDarkMode={isDarkMode}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  searchContainer: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  searchBar: { height: 50, borderRadius: 14, paddingHorizontal: 16, fontSize: 16, marginBottom: 16 },
  tabContainer: { flexDirection: 'row', padding: 3, borderRadius: 12 },
  tabButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 9 },
  tabText: { fontSize: 14, fontWeight: '500' },
  activeTabText: { color: '#000000', fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  infoMsg: { fontSize: 16 },
  retryBtn: { backgroundColor: '#FF3B30', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  retryBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});

const lightStyles = StyleSheet.create({
  container: { backgroundColor: '#F2F2F7' },
  input: { backgroundColor: '#FFFFFF', color: '#000000' },
  text: { color: '#000000' },
  secondaryText: { color: '#8E8E93' },
  tabBg: { backgroundColor: '#E5E5EA' },
  activeTab: { backgroundColor: '#FFFFFF' },
  tabText: { color: '#3A3A3C' }
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#000000' },
  input: { backgroundColor: '#1C1C1E', color: '#FFFFFF' },
  text: { color: '#FFFFFF' },
  secondaryText: { color: '#8E8E93' },
  tabBg: { backgroundColor: '#1C1C1E' },
  activeTab: { backgroundColor: '#FFFFFF' },
  tabText: { color: '#AEAEB2' }
});