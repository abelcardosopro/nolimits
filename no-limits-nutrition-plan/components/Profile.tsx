import React, { useState } from 'react';
import { UserProfile, ActivityLevel, Goal } from '../types';

interface ProfileProps {
  profile: UserProfile;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, onProfileUpdate }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'age' || name === 'height' || name === 'weight' || name === 'numMeals') ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProfileUpdate(formData);
    setIsEditing(false);
    setSuccessMessage('¡Perfil actualizado con éxito!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  }

  const commonInputClasses = "mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-white disabled:bg-gray-800/50 disabled:text-gray-400 disabled:cursor-not-allowed";
  const commonLabelClasses = "block text-sm font-medium text-gray-300";

  const InputField: React.FC<{label: string, name: keyof UserProfile, type?: string, children?: React.ReactNode}> = ({label, name, type="text", children}) => (
    <div>
        <label htmlFor={name} className={commonLabelClasses}>{label}</label>
        {children ? (
            <select name={name} id={name} value={formData[name] as string} onChange={handleChange} disabled={!isEditing} className={commonInputClasses}>
                {children}
            </select>
        ) : (
            <input type={type} name={name} id={name} value={formData[name] as string | number} onChange={handleChange} disabled={!isEditing} className={commonInputClasses} />
        )}
    </div>
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Tu Perfil</h1>
      <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-md max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Nombre" name="name" />
                <InputField label="Edad" name="age" type="number" />
                <InputField label="Sexo" name="sex">
                    <option value="male">Hombre</option>
                    <option value="female">Mujer</option>
                </InputField>
                <InputField label="Altura (cm)" name="height" type="number" />
                <InputField label="Peso (kg)" name="weight" type="number" />
                <InputField label="Nivel de Actividad" name="activityLevel">
                    {Object.values(ActivityLevel).map(level => <option key={level} value={level}>{level}</option>)}
                </InputField>
                <InputField label="Objetivo" name="goal">
                    {Object.values(Goal).map(g => <option key={g} value={g}>{g}</option>)}
                </InputField>
                 <InputField label="Comidas por día" name="numMeals" type="number" />
                
                <div className="md:col-span-2">
                    <label htmlFor="intolerances" className={commonLabelClasses}>Intolerancias</label>
                    <textarea name="intolerances" id="intolerances" value={formData.intolerances} onChange={handleChange} disabled={!isEditing}
                        className={commonInputClasses} placeholder="Ej: lactosa, gluten..." ></textarea>
                </div>
                 <div className="md:col-span-2">
                    <label htmlFor="favoriteFoods" className={commonLabelClasses}>Alimentos Favoritos</label>
                    <textarea name="favoriteFoods" id="favoriteFoods" value={formData.favoriteFoods} onChange={handleChange} disabled={!isEditing}
                        className={commonInputClasses} placeholder="Ej: pollo, salmón, avena..." ></textarea>
                </div>
                 <div className="md:col-span-2">
                    <label htmlFor="dislikedFoods" className={commonLabelClasses}>Alimentos a Evitar</label>
                    <textarea name="dislikedFoods" id="dislikedFoods" value={formData.dislikedFoods} onChange={handleChange} disabled={!isEditing}
                        className={commonInputClasses} placeholder="Ej: hígado, coliflor..." ></textarea>
                </div>
            </div>

            {successMessage && <div className="p-3 bg-green-900/50 text-green-300 rounded-md text-sm border border-green-700">{successMessage}</div>}

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
            {isEditing ? (
              <>
                <button type="button" onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-500">
                    Cancelar
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-black bg-primary rounded-md hover:bg-primary-500">
                    Guardar Cambios
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm font-semibold text-black bg-primary rounded-md hover:bg-primary-500">
                Editar Perfil
              </button>
            )}
            </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;