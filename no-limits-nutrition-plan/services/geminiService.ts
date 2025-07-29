import { GoogleGenAI, Type } from "@google/genai";
import type { UserProfile, MealPlan } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const foodAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    itemName: { type: Type.STRING, description: "Nombre del alimento o plato. Ejemplo: 'Pechuga de pollo a la plancha con arroz'" },
    calories: { type: Type.NUMBER, description: "Calorías totales estimadas." },
    protein: { type: Type.NUMBER, description: "Gramos de proteína." },
    carbohydrates: { type: Type.NUMBER, description: "Gramos de carbohidratos." },
    fat: { type: Type.NUMBER, description: "Gramos de grasa." },
    servingSize: { type: Type.STRING, description: "Tamaño de la porción analizada. Ejemplo: '100g', '1 taza', '1 plato'" },
  },
  required: ["itemName", "calories", "protein", "carbohydrates", "fat", "servingSize"],
};

const mealPlanSchema = {
  type: Type.OBJECT,
  properties: {
    dailyCalorieGoal: { type: Type.NUMBER, description: "El objetivo calórico diario total para el plan." },
    meals: {
      type: Type.ARRAY,
      description: "Una lista de comidas para el día.",
      items: {
        type: Type.OBJECT,
        properties: {
          mealType: { type: Type.STRING, description: "Tipo de comida, e.g., 'Desayuno', 'Almuerzo', 'Cena', 'Snack'" },
          description: { type: Type.STRING, description: "Una breve descripción del plato." },
          recipes: {
            type: Type.ARRAY,
            description: "Recetas para la comida.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: {type: Type.STRING, description: "Nombre de la receta."},
                    ingredients: {type: Type.ARRAY, items: {type: Type.STRING}, description: "Lista de ingredientes."},
                    instructions: {type: Type.ARRAY, items: {type: Type.STRING}, description: "Pasos de la preparación."},
                },
                required: ["name", "ingredients", "instructions"]
            }
          },
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          carbohydrates: { type: Type.NUMBER },
          fat: { type: Type.NUMBER },
        },
        required: ["mealType", "description", "recipes", "calories", "protein", "carbohydrates", "fat"]
      },
    },
  },
  required: ["dailyCalorieGoal", "meals"]
};


export const analyzeFood = async (foodInput: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analiza la siguiente entrada de comida y proporciona su información nutricional. Entrada: "${foodInput}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: foodAnalysisSchema,
      }
    });
    
    const parsedResponse = JSON.parse(response.text);
    return parsedResponse;
  } catch (error) {
    console.error("Error analyzing food with Gemini:", error);
    throw new Error("No se pudo analizar el alimento. Por favor, inténtalo de nuevo.");
  }
};

export const generatePlanForUser = async (profile: UserProfile): Promise<MealPlan> => {
  const prompt = `
    Crea un plan de comidas de un día para el siguiente perfil de usuario:
    - Edad: ${profile.age}
    - Sexo: ${profile.sex === 'male' ? 'Hombre' : 'Mujer'}
    - Altura: ${profile.height} cm
    - Peso: ${profile.weight} kg
    - Nivel de actividad: ${profile.activityLevel}
    - Objetivo: ${profile.goal}
    - Número de comidas deseadas al día: ${profile.numMeals}
    - Restricciones dietéticas generales: ${profile.dietaryRestrictions || 'Ninguna'}
    - Intolerancias: ${profile.intolerances || 'Ninguna'}
    - Alimentos que le gustan: ${profile.favoriteFoods || 'Ninguna preferencia específica'}
    - Alimentos que NO quiere incluir: ${profile.dislikedFoods || 'Ninguno'}

    El plan debe tener exactamente ${profile.numMeals} comidas, distribuidas a lo largo del día (ej. Desayuno, Almuerzo, Cena, etc.).
    Distribuye las calorías y macronutrientes de forma equilibrada entre las comidas para cumplir el objetivo del usuario de forma saludable.
    Basa las recetas y sugerencias en los alimentos que le gustan al usuario y evita estrictamente los que no quiere.
    Ten en cuenta las intolerancias y restricciones.
    Ofrece variedad y recetas saludables y detalladas (ingredientes y preparación).
    Devuelve la respuesta en formato JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: mealPlanSchema,
      }
    });

    const parsedResponse = JSON.parse(response.text) as MealPlan;
    return parsedResponse;
  } catch (error) {
    console.error("Error generating meal plan with Gemini:", error);
    throw new Error("No se pudo generar el plan nutricional. Por favor, inténtalo de nuevo.");
  }
};