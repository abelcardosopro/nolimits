export enum ActivityLevel {
  SEDENTARY = 'Sedentario (poco o nada de ejercicio)',
  LIGHT = 'Ejercicio ligero (1-3 días/semana)',
  MODERATE = 'Ejercicio moderado (3-5 días/semana)',
  ACTIVE = 'Muy activo (6-7 días/semana)',
  EXTRA_ACTIVE = 'Extremadamente activo (trabajo físico y ejercicio diario)',
}

export enum Goal {
  LOSE = 'Perder peso',
  MAINTAIN = 'Mantener peso',
  GAIN = 'Ganar músculo',
}

export interface UserProfile {
  name: string;
  age: number;
  sex: 'male' | 'female';
  height: number;
  weight: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  dietaryRestrictions: string;
  numMeals: number;
  intolerances: string;
  favoriteFoods: string;
  dislikedFoods: string;
}

export interface FoodLogEntry {
  id: string;
  date: string; // ISO string
  itemName: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  servingSize: string;
}

export interface Meal {
    mealType: string;
    description: string;
    recipes: {
      name:string;
      ingredients: string[];
      instructions: string[];
    }[];
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
}

export interface MealPlan {
  dailyCalorieGoal: number;
  meals: Meal[];
}

export interface HistoricalWeight {
  date: string; // "YYYY-MM-DD"
  weight: number;
}

export interface AnalyzedFoodItem extends Omit<FoodLogEntry, 'id' | 'date'> {
  grams: number;
}
