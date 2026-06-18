import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { MealSummary } from '../services/mealsApi';

interface MealItemProps {
  meal: MealSummary;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectMeal: (id: string) => void;
  isDarkMode: boolean;
}

export const MealItem: React.FC<MealItemProps> = ({
  meal,
  isFavorite,
  onToggleFavorite,
  onSelectMeal,
  isDarkMode,
}) => {
  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  return (
    <Pressable 
      style={[styles.card, themeStyles.card]} 
      onPress={() => onSelectMeal(meal.idMeal)}
    >
      <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
      
      <View style={styles.infoContainer}>
        <Text style={[styles.title, themeStyles.text]} numberOfLines={2}>
          {meal.strMeal}
        </Text>
      </View>

      <Pressable 
        style={styles.favButton} 
        onPress={() => onToggleFavorite(meal.idMeal)}
      >
        <Text style={styles.favIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingRight: 15,
    borderRadius: 24, // Molto arrotondato
    overflow: 'hidden',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 20, // Angoli immagine arrotondati
    margin: 8,
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '500', // Più leggero
    letterSpacing: -0.2,
  },
  favButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favIcon: {
    fontSize: 22,
  },
});

const lightStyles = StyleSheet.create({
  card: { 
    backgroundColor: '#FFFFFF',
    // Ombra molto soffusa
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  text: { color: '#000000' },
});

const darkStyles = StyleSheet.create({
  card: { backgroundColor: '#1C1C1E' },
  text: { color: '#FFFFFF' },
});