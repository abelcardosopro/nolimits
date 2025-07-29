import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { UserProfile, FoodLogEntry, HistoricalWeight } from './types';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Logger from './components/Logger';
import Planner from './components/Planner';
import Profile from './components/Profile';
import CustomPlanner from './components/CustomPlanner';
import { DashboardIcon, LoggerIcon, PlannerIcon, ProfileIcon, LogoIcon, CreatePlanIcon } from './components/icons';

const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: React.SetStateAction<T>) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: React.SetStateAction<T>) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};

const NavItem: React.FC<{ to: string, children: React.ReactNode }> = ({ to, children }) => {
    const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors";
    const activeClasses = "bg-primary/10 text-primary font-semibold";
    return (
        <NavLink to={to} className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : ''}`}>
            {children}
        </NavLink>
    );
};

const App: React.FC = () => {
  const [profile, setProfile] = useLocalStorage<UserProfile | null>('userProfile', null);
  const [foodLog, setFoodLog] = useLocalStorage<FoodLogEntry[]>('foodLog', []);
  const [weightHistory, setWeightHistory] = useLocalStorage<HistoricalWeight[]>('weightHistory', []);
  const location = useLocation();

  const handleOnboardingComplete = (completedProfile: UserProfile) => {
    setProfile(completedProfile);
    const initialWeightEntry = {
        date: new Date().toISOString().split('T')[0],
        weight: completedProfile.weight
    };
    setWeightHistory([initialWeightEntry]);
  };

  const handleFoodLogged = useCallback((entry: Omit<FoodLogEntry, 'id' | 'date'>) => {
    const newEntry: FoodLogEntry = {
      ...entry,
      id: new Date().toISOString(),
      date: new Date().toISOString(),
    };
    setFoodLog(prevLog => [...prevLog, newEntry]);
    alert(`${entry.itemName} ha sido añadido a tu registro.`);
  }, [setFoodLog]);

  const handleProfileUpdate = useCallback((updatedProfile: UserProfile) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const hasTodayEntry = weightHistory.some(entry => entry.date === todayStr);

    if (profile && updatedProfile.weight !== profile.weight) {
        setWeightHistory(prev => {
            if(hasTodayEntry){
                return prev.map(e => e.date === todayStr ? {...e, weight: updatedProfile.weight} : e);
            } else {
                return [...prev, {date: todayStr, weight: updatedProfile.weight}];
            }
        });
    }
    setProfile(updatedProfile);
  }, [profile, setProfile, weightHistory, setWeightHistory]);

  useEffect(() => {
    if (profile && weightHistory.length <= 1) {
      const mockHistory = [
        { date: '2023-10-01', weight: profile.weight + 2 },
        { date: '2023-10-08', weight: profile.weight + 1.5 },
        { date: '2023-10-15', weight: profile.weight + 1 },
        { date: '2023-10-22', weight: profile.weight + 0.5 },
        { date: '2023-10-29', weight: profile.weight },
      ];
      const currentEntry = weightHistory.length > 0 ? weightHistory : [{date: new Date().toISOString().split('T')[0], weight: profile.weight}];
      if (currentEntry.length === 1) {
          setWeightHistory(mockHistory.map(e => ({...e, weight: e.weight - profile.weight + currentEntry[0].weight})));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);
  
  if (!profile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const pageTitles: { [key: string]: string } = {
      '/': 'Dashboard',
      '/log': 'Registrar Alimento',
      '/plan': 'Planificador AI',
      '/custom-plan': 'Crear Plan',
      '/profile': 'Mi Perfil'
  }

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-gray-950 border-r border-gray-800 p-4 flex-col hidden md:flex">
        <div className="flex justify-center items-center py-6 px-4 border-b border-gray-800">
            <LogoIcon className="w-24" />
        </div>
        <div className="mt-6 space-y-2">
            <NavItem to="/"><DashboardIcon className="w-5 h-5"/>Dashboard</NavItem>
            <NavItem to="/log"><LoggerIcon className="w-5 h-5"/>Registrar</NavItem>
            <NavItem to="/plan"><PlannerIcon className="w-5 h-5"/>Plan AI</NavItem>
            <NavItem to="/custom-plan"><CreatePlanIcon className="w-5 h-5"/>Crear Plan</NavItem>
            <NavItem to="/profile"><ProfileIcon className="w-5 h-5"/>Perfil</NavItem>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-950/80 backdrop-blur-lg border-b border-gray-800 p-4 md:hidden">
            <h1 className="text-lg font-bold text-center text-white">{pageTitles[location.pathname] || 'NO LIMITS NUTRITION'}</h1>
        </header>
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard profile={profile} foodLog={foodLog} weightHistory={weightHistory} />} />
            <Route path="/log" element={<Logger onFoodLogged={handleFoodLogged} />} />
            <Route path="/plan" element={<Planner profile={profile} />} />
            <Route path="/custom-plan" element={<CustomPlanner />} />
            <Route path="/profile" element={<Profile profile={profile} onProfileUpdate={handleProfileUpdate} />} />
          </Routes>
        </div>
        {/* Bottom Navigation for Mobile */}
        <nav className="md:hidden bg-gray-950 border-t border-gray-800 grid grid-cols-5">
             <NavLink to="/" className={({isActive}) => `p-3 flex flex-col items-center justify-center text-xs ${isActive ? 'text-primary' : 'text-gray-400'}`}> <DashboardIcon className="w-6 h-6 mb-1"/> Dash</NavLink>
             <NavLink to="/log" className={({isActive}) => `p-3 flex flex-col items-center justify-center text-xs ${isActive ? 'text-primary' : 'text-gray-400'}`}> <LoggerIcon className="w-6 h-6 mb-1"/> Registrar</NavLink>
             <NavLink to="/plan" className={({isActive}) => `p-3 flex flex-col items-center justify-center text-xs ${isActive ? 'text-primary' : 'text-gray-400'}`}> <PlannerIcon className="w-6 h-6 mb-1"/> Plan AI</NavLink>
             <NavLink to="/custom-plan" className={({isActive}) => `p-3 flex flex-col items-center justify-center text-xs ${isActive ? 'text-primary' : 'text-gray-400'}`}> <CreatePlanIcon className="w-6 h-6 mb-1"/> Crear</NavLink>
             <NavLink to="/profile" className={({isActive}) => `p-3 flex flex-col items-center justify-center text-xs ${isActive ? 'text-primary' : 'text-gray-400'}`}> <ProfileIcon className="w-6 h-6 mb-1"/> Perfil</NavLink>
        </nav>
      </main>
    </div>
  );
};

export default App;
