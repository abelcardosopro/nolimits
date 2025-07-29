import React, { useState } from 'react';
import { analyzeFood } from '../services/geminiService';
import { FoodLogEntry } from '../types';
import { BrainCircuitIcon } from './icons';

interface LoggerProps {
  onFoodLogged: (entry: Omit<FoodLogEntry, 'id' | 'date'>) => void;
}

const Logger: React.FC<LoggerProps> = ({ onFoodLogged }) => {
  const [foodInput, setFoodInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState<Omit<FoodLogEntry, 'id' | 'date'> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!foodInput.trim()) {
      setError('Por favor, introduce un alimento.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await analyzeFood(foodInput);
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogFood = () => {
    if(analysisResult) {
      onFoodLogged(analysisResult);
      setAnalysisResult(null);
      setFoodInput('');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-white">Registrar Alimentos</h1>
      <p className="text-gray-300">Introduce lo que has comido. Puedes ser descriptivo, como "un tazón de avena con plátano y almendras".</p>

      <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-md">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={foodInput}
            onChange={(e) => setFoodInput(e.target.value)}
            placeholder="Ej: 100g de pechuga de pollo y una ensalada"
            className="flex-grow w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-white placeholder-gray-500"
            disabled={isLoading}
          />
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="flex items-center justify-center px-6 py-3 bg-primary text-black font-semibold rounded-lg shadow-md hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-primary disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analizando...
              </>
            ) : (
                <>
                <BrainCircuitIcon className="w-5 h-5 mr-2" />
                Analizar
                </>
            )}
          </button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {analysisResult && (
        <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-md animate-fade-in-up">
          <h2 className="text-xl font-semibold text-white mb-4">Resultados del Análisis</h2>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-primary capitalize">{analysisResult.itemName}</h3>
            <p className="text-sm text-gray-300">{analysisResult.servingSize}</p>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-2 bg-gray-900 rounded-md">
                <p className="text-sm text-gray-400">Calorías</p>
                <p className="text-lg font-bold text-orange-400">{analysisResult.calories}</p>
              </div>
              <div className="p-2 bg-gray-900 rounded-md">
                <p className="text-sm text-gray-400">Proteínas</p>
                <p className="text-lg font-bold text-sky-400">{analysisResult.protein}g</p>
              </div>
              <div className="p-2 bg-gray-900 rounded-md">
                <p className="text-sm text-gray-400">Carbs</p>
                <p className="text-lg font-bold text-amber-400">{analysisResult.carbohydrates}g</p>
              </div>
              <div className="p-2 bg-gray-900 rounded-md">
                <p className="text-sm text-gray-400">Grasas</p>
                <p className="text-lg font-bold text-rose-400">{analysisResult.fat}g</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={handleLogFood} className="px-6 py-2 bg-primary text-black font-semibold rounded-lg shadow-md hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-primary">
              Añadir al registro
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logger;