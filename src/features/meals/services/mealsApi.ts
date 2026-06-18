export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface MealDetail {
  idMeal: string;
  strMeal: string;
  strInstructions: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  [key: string]: string | undefined; 
}

// Fetch della lista dei piatti Italiani
export const fetchItalianMeals = async (): Promise<MealSummary[]> => {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?a=Italian');
  if (!response.ok) {
    throw new Error('Errore nel caricamento dei piatti italiani');
  }
  const data = await response.json();
  return data.meals || [];
};

// Fetch dei dettagli di una singola ricetta tramite ID
export const fetchMealDetails = async (id: string): Promise<MealDetail> => {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  if (!response.ok) {
    throw new Error('Errore nel caricamento del dettaglio della ricetta');
  }
  const data = await response.json();
  if (!data.meals || data.meals.length === 0) {
    throw new Error('Ricetta non trovata');
  }
  return data.meals[0];
};