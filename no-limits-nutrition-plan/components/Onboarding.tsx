import React, { useState } from 'react';
import { UserProfile, ActivityLevel, Goal } from '../types';
import { LogoIcon } from './icons';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    age: 25,
    sex: 'male',
    height: 175,
    weight: 70,
    activityLevel: ActivityLevel.LIGHT,
    goal: Goal.MAINTAIN,
    dietaryRestrictions: '',
    numMeals: 4,
    intolerances: '',
    favoriteFoods: '',
    dislikedFoods: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: name === 'age' || name === 'height' || name === 'weight' || name === 'numMeals' ? Number(value) : value }));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(profile as UserProfile);
  };

  const commonInputClasses = "mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-white placeholder-gray-500";
  const commonLabelClasses = "block text-sm font-medium text-gray-300";

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold text-white">Bienvenido a NO LIMITS NUTRITION</h2>
            <p className="text-gray-400 mt-2">Cuéntanos un poco sobre ti para empezar.</p>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className={commonLabelClasses}>Nombre</label>
                <input type="text" name="name" id="name" value={profile.name} onChange={handleChange} className={commonInputClasses} placeholder="Tu nombre" />
              </div>
              <div>
                <label htmlFor="age" className={commonLabelClasses}>Edad</label>
                <input type="number" name="age" id="age" value={profile.age} onChange={handleChange} className={commonInputClasses} />
              </div>
              <div>
                <label htmlFor="sex" className={commonLabelClasses}>Sexo</label>
                <select name="sex" id="sex" value={profile.sex} onChange={handleChange} className={commonInputClasses}>
                  <option value="male">Hombre</option>
                  <option value="female">Mujer</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold text-white">Tus métricas físicas</h2>
            <p className="text-gray-400 mt-2">Estos datos nos ayudan a calcular tus necesidades.</p>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="height" className={commonLabelClasses}>Altura (cm)</label>
                <input type="number" name="height" id="height" value={profile.height} onChange={handleChange} className={commonInputClasses} />
              </div>
              <div>
                <label htmlFor="weight" className={commonLabelClasses}>Peso (kg)</label>
                <input type="number" name="weight" id="weight" value={profile.weight} onChange={handleChange} className={commonInputClasses} />
              </div>
              <div>
                <label htmlFor="activityLevel" className={commonLabelClasses}>Nivel de Actividad Física</label>
                <select name="activityLevel" id="activityLevel" value={profile.activityLevel} onChange={handleChange} className={commonInputClasses}>
                  {Object.values(ActivityLevel).map(level => <option key={level} value={level}>{level}</option>)}
                </select>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold text-white">Tus objetivos</h2>
            <p className="text-gray-400 mt-2">¿Qué te gustaría conseguir?</p>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="goal" className={commonLabelClasses}>Objetivo principal</label>
                <select name="goal" id="goal" value={profile.goal} onChange={handleChange} className={commonInputClasses}>
                  {Object.values(Goal).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
               <div>
                <label htmlFor="numMeals" className={commonLabelClasses}>¿Cuántas comidas quieres hacer al día?</label>
                <input type="number" name="numMeals" id="numMeals" value={profile.numMeals} onChange={handleChange} min="1" max="8" className={commonInputClasses} />
              </div>
              <div>
                <label htmlFor="dietaryRestrictions" className={commonLabelClasses}>Otras restricciones (opcional)</label>
                <textarea name="dietaryRestrictions" id="dietaryRestrictions" value={profile.dietaryRestrictions} onChange={handleChange} className={commonInputClasses} placeholder="Ej: vegetariano, vegano, sin gluten..."></textarea>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
           <div>
            <h2 className="text-2xl font-bold text-white">Preferencias</h2>
            <p className="text-gray-400 mt-2">Ayuda a la IA a crear tu plan perfecto.</p>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="intolerances" className={commonLabelClasses}>Intolerancias (separadas por comas)</label>
                <textarea name="intolerances" id="intolerances" value={profile.intolerances} onChange={handleChange} className={commonInputClasses} placeholder="Ej: lactosa, fructosa..."></textarea>
              </div>
               <div>
                <label htmlFor="favoriteFoods" className={commonLabelClasses}>Alimentos que más te gustan (separados por comas)</label>
                <textarea name="favoriteFoods" id="favoriteFoods" value={profile.favoriteFoods} onChange={handleChange} className={commonInputClasses} placeholder="Ej: pollo, arroz, brócoli, salmón..."></textarea>
              </div>
               <div>
                <label htmlFor="dislikedFoods" className={commonLabelClasses}>Alimentos que no quieres incluir (separados por comas)</label>
                <textarea name="dislikedFoods" id="dislikedFoods" value={profile.dislikedFoods} onChange={handleChange} className={commonInputClasses} placeholder="Ej: pescado, coliflor, hígado..."></textarea>
              </div>
            </div>
          </div>
        )
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-700">
        <div className="flex justify-center mb-6">
            <LogoIcon className="w-20" />
        </div>
        <div className="mb-6">
            <div className="h-2 w-full bg-gray-700 rounded-full">
                <div className="h-2 bg-primary rounded-full transition-all duration-300" style={{width: `${(step/4)*100}%`}}></div>
            </div>
        </div>
        <form onSubmit={handleSubmit}>
          {renderStep()}
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500">
                Anterior
              </button>
            ) : <div/>}
            {step < 4 ? (
              <button type="button" onClick={nextStep} className="px-4 py-2 text-sm font-semibold text-black bg-primary rounded-md hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-primary">
                Siguiente
              </button>
            ) : (
              <button type="submit" className="px-4 py-2 text-sm font-semibold text-black bg-primary rounded-md hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-primary">
                Completar Perfil
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
