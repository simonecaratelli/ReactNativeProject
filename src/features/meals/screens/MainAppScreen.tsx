import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { fetchItalianMeals, MealSummary } from '../services/mealsApi';
import { LoginForm } from '../../auth/components/LoginForm';
import { AuthUser } from '../services/auth';
import { UserHeader } from '../components/UserHeader';
import { MealItem } from '../components/MealItem';
import { MealDetailView } from '../components/MealDetailView';
import { loadFavoriteIds, loadStoredUser, saveFavoriteIds, saveStoredUser } from '../services/storage';

export const MainAppScreen: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [meals, setMeals] = useState<MealSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    Promise.all([loadStoredUser()])
      .then(([storedUser]) => {
        if (isMounted) {
          if (storedUser) {
            setUser({
              email: storedUser,
              password: '',
              name: storedUser,
              avatarUri: '',
            });
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          setFavorites([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    setStatus('loading');

    loadFavoriteIds(user.name)
      .then((ids) => {
        if (isMounted) {
          setFavorites(ids);
        }
      })
      .catch(() => {
        if (isMounted) {
          setFavorites([]);
        }
      });

    fetchItalianMeals()
      .then((data) => {
        if (isMounted) {
          setMeals(data);
          setStatus('success');
        }
      })
      .catch(() => {
        if (isMounted) setStatus('error');
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;
    saveFavoriteIds(favorites, user.name);
  }, [favorites, user]);

  useEffect(() => {
    saveStoredUser(user?.name ?? null);
  }, [user]);

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedMealId(null);
    setSearchQuery('');
    setFilterFavoritesOnly(false);
  };

  const displayedMeals = meals.filter((meal) => {
    const matchesSearch = meal.strMeal.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFav = filterFavoritesOnly ? favorites.includes(meal.idMeal) : true;
    return matchesSearch && matchesFav;
  });

  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  if (!user) {
    return <LoginForm onLoginSuccess={setUser} isDarkMode={isDarkMode} />;
  }

  if (selectedMealId) {
    return (
      <View style={[styles.root, themeStyles.container]}>
        <UserHeader username={user.name} avatarUri={user.avatarUri} isDarkMode={isDarkMode} onToggleTheme={setIsDarkMode} onLogout={handleLogout} />
        <MealDetailView mealId={selectedMealId} onBack={() => setSelectedMealId(null)} isDarkMode={isDarkMode} />
      </View>
    );
  }

  return (
    <View style={[styles.root, themeStyles.container]}>
      <UserHeader username={user.name} avatarUri={user.avatarUri} isDarkMode={isDarkMode} onToggleTheme={setIsDarkMode} onLogout={handleLogout} />

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
            <Text style={[
              styles.tabText, 
              isDarkMode ? darkStyles.tabText : lightStyles.tabText,
              !filterFavoritesOnly && styles.activeTabText
            ]}>Tutti i Piatti</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.tabButton,
              filterFavoritesOnly && (isDarkMode ? darkStyles.activeTab : lightStyles.activeTab),
              pressed && { opacity: 0.7 }
            ]}
            onPress={() => setFilterFavoritesOnly(true)}
          >
            <Text style={[
              styles.tabText, 
              isDarkMode ? darkStyles.tabText : lightStyles.tabText,
              filterFavoritesOnly && styles.activeTabText
            ]}>
              Preferiti ({favorites.length})
            </Text>
          </Pressable>
        </View>
      </View>

      {status === 'loading' && (
        <View style={styles.center}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      )}

      {status === 'error' && (
        <View style={styles.center}>
          <Text style={[styles.infoMsg, themeStyles.text, { fontWeight: '500', marginBottom: 16 }]}>Errore di connessione di rete.</Text>
          <Pressable
            style={({ pressed }) => [
              styles.retryBtn,
              pressed && { opacity: 0.4, transform: [{ scale: 0.92 }] }
            ]}
            onPress={() => {
              setStatus('loading');
              fetchItalianMeals()
                .then((d) => { setMeals(d); setStatus('success'); })
                .catch(() => setStatus('error'));
            }}
          >
            <Text style={styles.retryBtnText}>Riprova</Text>
          </Pressable>
        </View>
      )}

      {status === 'success' && displayedMeals.length === 0 && (
        <View style={styles.center}>
          <Text style={[styles.infoMsg, themeStyles.secondaryText]}>Nessun piatto trovato</Text>
        </View>
      )}

      {status === 'success' && displayedMeals.length > 0 && (
        <FlatList
          data={displayedMeals}
          keyExtractor={(item) => item.idMeal}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <MealItem
              meal={item}
              isFavorite={favorites.includes(item.idMeal)}
              onToggleFavorite={handleToggleFavorite}
              onSelectMeal={setSelectedMealId}
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
  activeTab: { backgroundColor: '#007AFF' },
  tabText: { color: '#AEAEB2' }
});