import React, { useState, useMemo } from 'react';
import { analyzeFood } from '../services/geminiService';
import { AnalyzedFoodItem } from '../types';
import { foodGroups } from '../data/foods';

type Meal = {
  name: string;
  items: AnalyzedFoodItem[];
}

const CustomPlanner: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([{ name: 'Comida 1', items: [] }]);
  const [activeMealIndex, setActiveMealIndex] = useState<number | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>(Object.keys(foodGroups)[0]);
  const [selectedFood, setSelectedFood] = useState<string>(foodGroups[Object.keys(foodGroups)[0]][0]);
  const [grams, setGrams] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddMeal = () => {
    setMeals([...meals, { name: `Comida ${meals.length + 1}`, items: [] }]);
  };

  const handleRemoveMeal = (index: number) => {
    setMeals(meals.filter((_, i) => i !== index));
  };
  
  const handleRemoveFood = (mealIndex: number, foodIndex: number) => {
    const newMeals = [...meals];
    newMeals[mealIndex].items.splice(foodIndex, 1);
    setMeals(newMeals);
  };

  const handleAddFood = async (mealIndex: number) => {
    if (grams <= 0) {
        setError("Los gramos deben ser un número positivo.");
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
        const foodToAnalyze = `${grams}g de ${selectedFood}`;
        const analysis = await analyzeFood(foodToAnalyze);
        const newFoodItem: AnalyzedFoodItem = { ...analysis, grams: grams };

        const newMeals = [...meals];
        newMeals[mealIndex].items.push(newFoodItem);
        setMeals(newMeals);
        setActiveMealIndex(null); // Close form
    } catch (err: any) {
        setError(err.message || 'Error al analizar el alimento.');
    } finally {
        setIsLoading(false);
    }
  };
  
  const totalNutrition = useMemo(() => {
    return meals.reduce((totals, meal) => {
        const mealTotals = meal.items.reduce((acc, item) => ({
            calories: acc.calories + item.calories,
            protein: acc.protein + item.protein,
            carbohydrates: acc.carbohydrates + item.carbohydrates,
            fat: acc.fat + item.fat,
        }), { calories: 0, protein: 0, carbohydrates: 0, fat: 0 });
        
        return {
            calories: totals.calories + mealTotals.calories,
            protein: totals.protein + mealTotals.protein,
            carbohydrates: totals.carbohydrates + mealTotals.carbohydrates,
            fat: totals.fat + mealTotals.fat,
        };
    }, { calories: 0, protein: 0, carbohydrates: 0, fat: 0 });
  }, [meals]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-white">Crea tu Propio Plan</h1>
      <p className="text-gray-300">Añade comidas y alimentos para construir tu plan de nutrición perfecto. La IA analizará cada alimento por ti.</p>

      {/* Totales del día */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md py-4">
        <div className="bg-gray-900 border border-gray-700 p-4 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold text-white text-center mb-3">Totales del Día</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                 <div className="p-2">
                    <p className="text-sm text-gray-400">Calorías</p>
                    <p className="text-lg font-bold text-orange-400">{Math.round(totalNutrition.calories)}</p>
                </div>
                <div className="p-2">
                    <p className="text-sm text-gray-400">Proteínas</p>
                    <p className="text-lg font-bold text-sky-400">{Math.round(totalNutrition.protein)}g</p>
                </div>
                <div className="p-2">
                    <p className="text-sm text-gray-400">Carbs</p>
                    <p className="text-lg font-bold text-amber-400">{Math.round(totalNutrition.carbohydrates)}g</p>
                </div>
                <div className="p-2">
                    <p className="text-sm text-gray-400">Grasas</p>
                    <p className="text-lg font-bold text-rose-400">{Math.round(totalNutrition.fat)}g</p>
                </div>
            </div>
        </div>
      </div>

      {/* Comidas */}
      <div className="space-y-6">
        {meals.map((meal, mealIndex) => (
          <div key={mealIndex} className="bg-gray-900 border border-gray-700 p-5 rounded-xl">
            <h3 className="text-xl font-bold text-primary">{meal.name}</h3>
            
            {/* Lista de alimentos */}
            <div className="mt-4 space-y-2">
                {meal.items.map((item, foodIndex) => (
                    <div key={foodIndex} className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                        <div>
                            <p className="text-white capitalize font-semibold">{item.itemName}</p>
                             <p className="text-xs text-gray-400">P:{Math.round(item.protein)}g C:{Math.round(item.carbohydrates)}g G:{Math.round(item.fat)}g</p>
                        </div>
                        <div className="flex items-center gap-4">
                           <p className="font-semibold text-primary">{Math.round(item.calories)} kcal</p>
                           <button onClick={() => handleRemoveFood(mealIndex, foodIndex)} className="text-gray-500 hover:text-red-500">&times;</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Formulario para añadir alimento */}
            {activeMealIndex === mealIndex ? (
                <div className="mt-4 p-4 bg-gray-800 rounded-md border border-gray-600">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <select value={selectedGroup} onChange={e => { setSelectedGroup(e.target.value); setSelectedFood(foodGroups[e.target.value][0]); }} className="bg-gray-700 text-white border-gray-600 rounded p-2">
                            {Object.keys(foodGroups).map(group => <option key={group} value={group}>{group}</option>)}
                        </select>
                        <select value={selectedFood} onChange={e => setSelectedFood(e.target.value)} className="bg-gray-700 text-white border-gray-600 rounded p-2">
                            {foodGroups[selectedGroup].map(food => <option key={food} value={food}>{food}</option>)}
                        </select>
                        <input type="number" value={grams} onChange={e => setGrams(Number(e.target.value))} className="bg-gray-700 text-white border-gray-600 rounded p-2" placeholder="Gramos" />
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <div className="mt-4 flex justify-end gap-2">
                        <button onClick={() => setActiveMealIndex(null)} className="px-3 py-1 text-sm bg-gray-600 text-white rounded">Cancelar</button>
                        <button onClick={() => handleAddFood(mealIndex)} disabled={isLoading} className="px-3 py-1 text-sm bg-primary text-black font-semibold rounded disabled:bg-gray-500">
                            {isLoading ? 'Añadiendo...' : 'Añadir'}
                        </button>
                    </div>
                </div>
            ) : (
                <button onClick={() => setActiveMealIndex(mealIndex)} className="mt-4 px-4 py-2 text-sm bg-primary/20 text-primary font-semibold rounded-lg hover:bg-primary/30 w-full">
                    + Añadir Alimento
                </button>
            )}
             <button onClick={() => handleRemoveMeal(mealIndex)} className="mt-2 text-xs text-gray-500 hover:text-red-500 w-full text-right">Eliminar comida</button>
          </div>
        ))}
        <button onClick={handleAddMeal} className="w-full py-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:bg-gray-800 hover:border-gray-600">
          + Añadir otra comida
        </button>
      </div>
    </div>
  );
};

export default CustomPlanner;
