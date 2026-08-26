import React from 'react';
import { getTranslation } from '../utils/translations';
import { Language, FontSize } from '../types';

interface NavbarProps {
  lang: Language;
  fontSize: FontSize;
  isDark: boolean;
  trashCount: number;
  isAdmin: boolean;
  notifEnabled?: boolean;
  onToggleLang: () => void;
  onChangeFontSize: (size: FontSize) => void;
  onToggleDark: () => void;
  onOpenForm: () => void;
  onOpenDonate: () => void;
  onOpenNeeds: () => void;
  onOpenVolunteer: () => void;
  onOpenTrash: () => void;
  onOpenNotification: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  fontSize,
  isDark,
  trashCount,
  isAdmin,
  notifEnabled = false,
  onToggleLang,
  onChangeFontSize,
  onToggleDark,
  onOpenForm,
  onOpenDonate,
  onOpenNeeds,
  onOpenVolunteer,
  onOpenTrash,
  onOpenNotification,
}) => {
  return (
    <header className="bg-[var(--nav-bg)] border-b border-[var(--nav-border)] px-4 py-3 sticky top-[33px] z-[500] shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
        {/* Brand */}
        <div className="flex items-center gap-2 font-['Baloo_2'] font-extrabold text-2xl text-[#F4811F] cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="text-3xl leading-none">🍛</span>
          <span>{getTranslation(lang, 'appName')}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Font Size Adjuster for Elderly */}
          <div className="hidden md:flex items-center bg-[var(--bg-input)] border border-[var(--border)] rounded-full px-2 py-0.5 text-xs gap-1">
            <span className="text-[var(--text-faint)] font-medium mr-1">Aa</span>
            <button
              onClick={() => onChangeFontSize('small')}
              className={`px-1.5 py-0.5 rounded-full font-bold transition-all ${
                fontSize === 'small' ? 'bg-[#F4811F] text-white' : 'text-[var(--text-muted)] hover:text-[#F4811F]'
              }`}
              title={getTranslation(lang, 'fontSmall')}
            >
              A-
            </button>
            <button
              onClick={() => onChangeFontSize('normal')}
              className={`px-1.5 py-0.5 rounded-full font-bold transition-all ${
                fontSize === 'normal' ? 'bg-[#F4811F] text-white' : 'text-[var(--text-muted)] hover:text-[#F4811F]'
              }`}
              title={getTranslation(lang, 'fontNormal')}
            >
              A
            </button>
            <button
              onClick={() => onChangeFontSize('large')}
              className={`px-1.5 py-0.5 rounded-full font-bold transition-all ${
                fontSize === 'large' ? 'bg-[#F4811F] text-white' : 'text-[var(--text-muted)] hover:text-[#F4811F]'
              }`}
              title={getTranslation(lang, 'fontLarge')}
            >
              A+
            </button>
          </div>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="px-3 py-1.5 rounded-full border-2 border-[var(--border)] text-[var(--text-body)] text-xs font-bold hover:border-[#F4811F] hover:text-[#F4811F] transition-all bg-[var(--bg-input)] flex items-center gap-1"
          >
            🌐 {getTranslation(lang, 'langToggle')}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDark}
            className="w-9 h-9 rounded-full border-2 border-[var(--border)] bg-[var(--bg-input)] flex items-center justify-center text-base hover:border-[#F4811F] transition-all"
            title={getTranslation(lang, 'themeToggle')}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Notification Settings Button */}
          <button
            onClick={onOpenNotification}
            className={`relative w-9 h-9 rounded-full border-2 flex items-center justify-center text-base transition-all ${
              notifEnabled
                ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'border-[var(--border)] bg-[var(--bg-input)] hover:border-[#F4811F]'
            }`}
            title={lang === 'hi' ? 'पुश अलर्ट सेटिंग्स' : 'Notification Settings'}
          >
            🔔
            {notifEnabled && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[var(--bg)] animate-pulse" />
            )}
          </button>

          {/* Needs Board Button */}
          <button
            onClick={onOpenNeeds}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-[var(--border)] text-[var(--text-body)] text-xs font-bold hover:border-[#F4811F] hover:bg-[var(--saffron-lt)] transition-all"
          >
            🌾 {lang === 'hi' ? 'सामग्री आवश्यकता' : 'Needs Board'}
          </button>

          {/* Volunteer Registration Button */}
          <button
            onClick={onOpenVolunteer}
            className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-[var(--border)] text-[var(--text-body)] text-xs font-bold hover:border-[#F4811F] hover:bg-[var(--saffron-lt)] transition-all"
          >
            🤝 {lang === 'hi' ? 'सेवा पंजीकरण' : 'Volunteer'}
          </button>

          {/* Donate Button */}
          <button
            onClick={onOpenDonate}
            className="px-3.5 py-1.5 rounded-full border-2 border-amber-500 text-amber-600 dark:text-amber-400 text-xs font-bold hover:bg-amber-500 hover:text-white transition-all bg-amber-50 dark:bg-amber-950/40"
          >
            {getTranslation(lang, 'donateBtn')}
          </button>

          {/* Add Bhandara Button */}
          <button
            onClick={onOpenForm}
            className="bg-[#F4811F] hover:bg-[#C96000] text-white px-4 py-1.5 rounded-full text-xs font-extrabold shadow-sm hover:shadow transition-all"
          >
            + {lang === 'hi' ? 'भंडारा जोड़ें' : 'Add Bhandara'}
          </button>

          {/* Trash Bin for Admin */}
          {isAdmin && (
            <button
              onClick={onOpenTrash}
              className="relative w-9 h-9 rounded-full border-2 border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-base hover:bg-red-100 transition-all"
              title={getTranslation(lang, 'trashBin')}
            >
              🗑️
              {trashCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {trashCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
