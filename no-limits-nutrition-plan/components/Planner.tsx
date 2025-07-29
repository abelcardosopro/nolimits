import React, { useState } from 'react';
import { generatePlanForUser } from '../services/geminiService';
import { UserProfile, MealPlan } from '../types';
import { BrainCircuitIcon, FlameIcon } from './icons';

interface PlannerProps {
  profile: UserProfile;
}

const Planner: React.FC<PlannerProps> = ({ profile }) => {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setError(null);
    setMealPlan(null);
    try {
      const plan = await generatePlanForUser(profile);
      setMealPlan(plan);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al generar el plan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-white">Planificador de Comidas AI</h1>
      <p className="text-gray-300">
        Genera un plan de comidas personalizado para hoy basado en tu perfil y objetivos.
      </p>

      <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-md text-center">
        <h2 className="text-xl font-semibold text-gray-200 mb-2">Tu Objetivo Actual</h2>
        <p className="text-2xl font-bold text-primary mb-4">{profile.goal}</p>
        <button
          onClick={handleGeneratePlan}
          disabled={isLoading}
          className="flex items-center justify-center w-full sm:w-auto mx-auto px-6 py-3 bg-primary text-black font-semibold rounded-lg shadow-md hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-primary disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generando Plan...
            </>
          ) : (
             <>
                <BrainCircuitIcon className="w-5 h-5 mr-2" />
                Generar Plan de Hoy
             </>
          )}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {mealPlan && (
        <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-md space-y-6 animate-fade-in-up">
          <div className="text-center border-b pb-4 border-gray-700">
            <h2 className="text-2xl font-bold text-white">Tu Plan Personalizado</h2>
            <div className="mt-2 flex items-center justify-center gap-2 text-orange-400">
                <FlameIcon className="w-6 h-6"/>
                <p className="text-xl font-semibold">{Math.round(mealPlan.dailyCalorieGoal)} Kcal</p>
            </div>
          </div>

          <div className="space-y-8">
            {mealPlan.meals.map((meal, index) => (
              <div key={index} className="p-4 bg-gray-800 rounded-lg">
                <h3 className="text-xl font-bold text-primary">{meal.mealType}</h3>
                <p className="text-gray-300 mt-1">{meal.description}</p>
                <div className="text-xs text-gray-400 mt-2 flex gap-4">
                    <span><span className="font-semibold text-gray-300">{meal.calories}</span> kcal</span>
                    <span>P: <span className="font-semibold text-gray-300">{meal.protein}g</span></span>
                    <span>C: <span className="font-semibold text-gray-300">{meal.carbohydrates}g</span></span>
                    <span>G: <span className="font-semibold text-gray-300">{meal.fat}g</span></span>
                </div>
                
                {meal.recipes.map((recipe, r_index) => (
                    <div key={r_index} className="mt-4 border-t border-gray-700 pt-4">
                        <h4 className="font-semibold text-gray-200">{recipe.name}</h4>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h5 className="text-sm font-bold text-gray-300">Ingredientes:</h5>
                                <ul className="list-disc list-inside text-gray-400 text-sm mt-1 space-y-1">
                                    {recipe.ingredients.map((ing, i_index) => <li key={i_index}>{ing}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-gray-300">Instrucciones:</h5>
                                <ol className="list-decimal list-inside text-gray-400 text-sm mt-1 space-y-1">
                                    {recipe.instructions.map((ins, i_index) => <li key={i_index}>{ins}</li>)}
                                </ol>
                            </div>
                        </div>
                    </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;