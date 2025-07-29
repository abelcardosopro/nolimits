import React from 'react';
import { UserProfile, FoodLogEntry, HistoricalWeight, Goal } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FlameIcon } from './icons';
import { ActivityLevel } from '../types';


interface DashboardProps {
  profile: UserProfile;
  foodLog: FoodLogEntry[];
  weightHistory: HistoricalWeight[];
}

const MacroCircle: React.FC<{ label: string; value: number; total: number; unit: string; color: string }> = ({ label, value, total, unit, color }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle className="text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
          <circle
            className={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-white">{Math.round(value)}</span>
          <span className="text-xs text-gray-400">{unit}</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-gray-300">{label}</span>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ profile, foodLog, weightHistory }) => {
  const today = new Date().toISOString().split('T')[0];
  const todaysLog = foodLog.filter(entry => entry.date.startsWith(today));
  
  const totalCalories = todaysLog.reduce((acc, entry) => acc + entry.calories, 0);
  const totalProtein = todaysLog.reduce((acc, entry) => acc + entry.protein, 0);
  const totalCarbs = todaysLog.reduce((acc, entry) => acc + entry.carbohydrates, 0);
  const totalFat = todaysLog.reduce((acc, entry) => acc + entry.fat, 0);

  // BMR estimation using Mifflin-St Jeor
  const bmr = profile.sex === 'male' 
    ? (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + 5
    : (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) - 161;
  
  const activityMultipliers: { [key in ActivityLevel]: number } = {
    [ActivityLevel.SEDENTARY]: 1.2,
    [ActivityLevel.LIGHT]: 1.375,
    [ActivityLevel.MODERATE]: 1.55,
    [ActivityLevel.ACTIVE]: 1.725,
    [ActivityLevel.EXTRA_ACTIVE]: 1.9,
  };
  
  const maintenanceCalories = bmr * activityMultipliers[profile.activityLevel];
  
  let calorieGoal = maintenanceCalories;
  if (profile.goal === Goal.LOSE) calorieGoal -= 500;
  if (profile.goal === Goal.GAIN) calorieGoal += 500;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 text-white">
      <h1 className="text-3xl font-bold text-white">Hola, {profile.name}</h1>
      
      {/* Resumen diario */}
      <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-700">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">Resumen de Hoy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            <div className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-xl">
                <FlameIcon className="w-10 h-10 text-orange-500 mb-2"/>
                <span className="text-4xl font-bold text-white">{Math.round(totalCalories)}</span>
                <span className="text-gray-400">de {Math.round(calorieGoal)} Kcal</span>
            </div>
            <MacroCircle label="Proteína" value={totalProtein} total={calorieGoal * 0.3 / 4} unit="g" color="text-sky-400" />
            <MacroCircle label="Carbs" value={totalCarbs} total={calorieGoal * 0.4 / 4} unit="g" color="text-amber-400" />
            <MacroCircle label="Grasa" value={totalFat} total={calorieGoal * 0.3 / 9} unit="g" color="text-rose-400" />
        </div>
      </div>
      
      {/* Progreso de peso */}
      <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-700">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">Progreso de Peso</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={weightHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
              <XAxis dataKey="date" tick={{fontSize: 12, fill: '#a0aec0'}} />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{fontSize: 12, fill: '#a0aec0'}} unit="kg" />
              <Tooltip
                contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid #4a5568',
                    borderRadius: '10px',
                    color: '#fff'
                }}
                 labelStyle={{color: '#a0aec0'}}
              />
              <Legend wrapperStyle={{color: '#a0aec0'}}/>
              <Line type="monotone" dataKey="weight" name="Peso" stroke="#facc15" strokeWidth={2} dot={{ r: 4, fill: '#facc15' }} activeDot={{ r: 6, fill: '#facc15' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Alimentos del día */}
      <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-700">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">Alimentos Registrados Hoy</h2>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {todaysLog.length > 0 ? todaysLog.map(entry => (
            <div key={entry.id} className="p-4 bg-gray-800 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-white capitalize">{entry.itemName}</p>
                <p className="text-sm text-gray-400">{entry.servingSize}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary">{entry.calories} kcal</p>
                <p className="text-xs text-gray-400">P:{entry.protein}g C:{entry.carbohydrates}g G:{entry.fat}g</p>
              </div>
            </div>
          )) : (
            <p className="text-gray-400 text-center py-4">No has registrado alimentos hoy.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;