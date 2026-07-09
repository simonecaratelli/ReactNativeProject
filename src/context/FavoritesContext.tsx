import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadFavoriteIds, saveFavoriteIds } from '../features/meals/services/storage';

interface FavoritesContextType {
  favoriteIds: string[];
  isLoading: boolean;
  isFavorite: (idMeal: string) => boolean;
  toggleFavorite: (idMeal: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadFavoriteIds()
      .then(setFavoriteIds)
      .finally(() => setIsLoading(false));
  }, []);

  const isFavorite = (idMeal: string) => favoriteIds.includes(idMeal);

  const toggleFavorite = (idMeal: string) => {
    setFavoriteIds((current) => {
      const next = current.includes(idMeal)
        ? current.filter((id) => id !== idMeal)
        : [...current, idMeal];
      void saveFavoriteIds(next); 
      return next;
    });
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isLoading, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites deve essere usato all\'interno di un FavoritesProvider');
  }
  return context;
};