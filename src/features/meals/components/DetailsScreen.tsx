import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchMealById, MealDetail } from '../services/mealsApi';

interface DetailsScreenProps {
  navigation: any;
  route: any;
  isDarkMode: boolean;
}

interface DetailState {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: MealDetail | null;
  message: string;
}

export const DetailsScreen: React.FC<DetailsScreenProps> = ({ navigation, route, isDarkMode }) => {
  const [state, setState] = useState<DetailState>({
    status: 'idle',
    data: null,
    message: '',
  });

  const mealId = route.params?.id;

  async function loadMealDetails() {
    if (!mealId) {
      setState({ status: 'error', data: null, message: 'ID piatto non valido.' });
      return;
    }

    setState({ status: 'loading', data: null, message: '' });
    try {
      const detail = await fetchMealById(mealId);
      if (!detail) {
        setState({ status: 'error', data: null, message: 'Dettagli del piatto non trovati.' });
      } else {
        setState({ status: 'success', data: detail, message: '' });
      }
    } catch {
      setState({
        status: 'error',
        data: null,
        message: 'Impossibile caricare la ricetta. Errore di rete.',
      });
    }
  }

  useEffect(() => {
    loadMealDetails();
  }, [mealId]);

  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  if (state.status === 'error') {
    return (
      <View style={[styles.center, themeStyles.container]}>
        <Text style={[styles.errorText, themeStyles.text]}>{state.message}</Text>
        <Pressable 
          style={({ pressed }) => [
            styles.retryBtn,
            pressed && { opacity: 0.4, transform: [{ scale: 0.92 }] }
          ]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryBtnText}>Torna alla Home</Text>
        </Pressable>
      </View>
    );
  }

  if (state.status === 'loading' || !state.data) {
    return (
      <View style={[styles.center, themeStyles.container]}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }

  const meal = state.data;
  const ingredientsList: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== '') {
      ingredientsList.push(`${ingredient} • ${measure ? measure.trim() : ''}`);
    }
  }

  return (
    <ScrollView style={[styles.container, themeStyles.container]} showsVerticalScrollIndicator={false}>
      <Pressable 
        style={({ pressed }) => [
          styles.backBar,
          pressed && { opacity: 0.5 }
        ]} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backBarText}>← Indietro</Text>
      </Pressable>

      <View style={styles.imageContainer}>
        <Image source={{ uri: meal.strMealThumb }} style={styles.imageHeader} />
      </View>

      <View style={styles.body}>
        <Text style={[styles.mealTitle, themeStyles.text]}>{meal.strMeal}</Text>
        <Text style={styles.badge}>{meal.strCategory} · {meal.strArea}</Text>

        <Text style={[styles.sectionTitle, themeStyles.text]}>Ingredienti</Text>
        {ingredientsList.map((item, index) => (
          <View key={index} style={[styles.ingredientRow, themeStyles.ingredientCard]}>
            <Text style={[styles.ingredientText, themeStyles.text]}>{item}</Text>
          </View>
        ))}

        <Text style={[styles.sectionTitle, themeStyles.text]}>Preparazione</Text>
        <Text style={[styles.instructionsText, themeStyles.secondaryText]}>{meal.strInstructions}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backBar: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  backBarText: { fontSize: 16, color: '#007AFF', fontWeight: '500' },
  imageContainer: { paddingHorizontal: 24, marginVertical: 12 },
  imageHeader: { width: '100%', height: 240, borderRadius: 24 },
  body: { paddingHorizontal: 24, paddingBottom: 40 },
  mealTitle: { fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
  badge: { color: '#8E8E93', fontSize: 14, fontWeight: '500', marginTop: 4, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 24, marginBottom: 12, letterSpacing: -0.2 },
  ingredientRow: { padding: 14, borderRadius: 14, marginVertical: 4 },
  ingredientText: { fontSize: 15, fontWeight: '500' },
  instructionsText: { fontSize: 15, lineHeight: 22, textAlign: 'left' },
  errorText: { fontSize: 16, marginBottom: 16, fontWeight: '500' },
  retryBtn: { backgroundColor: '#FF3B30', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  retryBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});

const lightStyles = StyleSheet.create({
  container: { backgroundColor: '#F2F2F7' },
  text: { color: '#000000' },
  secondaryText: { color: '#3A3A3C' },
  ingredientCard: { backgroundColor: '#FFFFFF' },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#000000' },
  text: { color: '#FFFFFF' },
  secondaryText: { color: '#E5E5EA' },
  ingredientCard: { backgroundColor: '#1C1C1E' },
});