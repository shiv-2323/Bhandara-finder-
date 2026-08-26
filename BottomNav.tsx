import React from 'react';
import { Language } from '../types';

interface BottomNavProps {
  lang: Language;
  viewMode: 'list' | 'map' | 'split';
  onViewModeChange: (v: 'list' | 'map' | 'split') => void;
  onOpenForm: () => void;
  onOpenNeeds: () => void;
  onOpenAdmin: () => void;
  isAdmin: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  lang,
  viewMode,
  onViewModeChange,
  onOpenForm,
  onOpenNeeds,
  onOpenAdmin,
  isAdmin,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[500] bg-[var(--nav-bg)] border-t border-[var(--nav-border)] shadow-lg px-2 py-1.5 flex items-center justify-around text-center">
      <button
        onClick={() => onViewModeChange('list')}
        className={`flex flex-col items-center gap-0.5 p-1 font-bold text-[10px] transition-all ${
          viewMode === 'list' ? 'text-[#F4811F]' : 'text-[var(--text-faint)]'
        }`}
      >
        <span className="text-lg">🔍</span>
        <span>{lang === 'hi' ? 'खोजें' : 'Find'}</span>
      </button>

      <button
        onClick={() => onViewModeChange('map')}
        className={`flex flex-col items-center gap-0.5 p-1 font-bold text-[10px] transition-all ${
          viewMode === 'map' ? 'text-[#F4811F]' : 'text-[var(--text-faint)]'
        }`}
      >
        <span className="text-lg">🗺️</span>
        <span>{lang === 'hi' ? 'मानचित्र' : 'Map'}</span>
      </button>

      <button
        onClick={onOpenForm}
        className="flex flex-col items-center justify-center -mt-5 bg-[#F4811F] text-white w-12 h-12 rounded-full shadow-lg font-extrabold border-4 border-[var(--bg)] hover:scale-105 transition-all"
      >
        <span className="text-2xl leading-none">+</span>
      </button>

      <button
        onClick={onOpenNeeds}
        className="flex flex-col items-center gap-0.5 p-1 font-bold text-[10px] text-[var(--text-faint)] hover:text-[#F4811F]"
      >
        <span className="text-lg">🌾</span>
        <span>{lang === 'hi' ? 'आवश्यकता' : 'Needs'}</span>
      </button>

      <button
        onClick={onOpenAdmin}
        className={`flex flex-col items-center gap-0.5 p-1 font-bold text-[10px] transition-all ${
          isAdmin ? 'text-emerald-500' : 'text-[var(--text-faint)]'
        }`}
      >
        <span className="text-lg">🛡️</span>
        <span>{isAdmin ? (lang === 'hi' ? 'प्रबंधक' : 'Admin') : lang === 'hi' ? 'लॉगिन' : 'Login'}</span>
      </button>
    </div>
  );
};
