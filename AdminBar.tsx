import React, { useState } from 'react';
import { getTranslation } from '../utils/translations';
import { Language } from '../types';

interface AdminBarProps {
  isAdmin: boolean;
  adminEmail: string;
  lang: Language;
  onLogin: (email: string, pass: string) => Promise<boolean>;
  onLogout: () => void;
  openDashboard: () => void;
}

export const AdminBar: React.FC<AdminBarProps> = ({
  isAdmin,
  adminEmail,
  lang,
  onLogin,
  onLogout,
  openDashboard,
}) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pass) return;
    setLoading(true);
    await onLogin(email, pass);
    setLoading(false);
    setPass('');
  };

  return (
    <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white px-4 py-1.5 border-b-2 border-[#F4811F] text-xs flex items-center justify-between flex-wrap gap-2 sticky top-0 z-[600]">
      <div className="flex items-center gap-2">
        <span className="font-bold text-[#F4811F] flex items-center gap-1">
          🔐 {getTranslation(lang, 'adminPanel')}
        </span>
        <span className="text-neutral-400 font-medium hidden sm:inline">
          {isAdmin ? (
            <span className="text-emerald-400 font-bold">
              {getTranslation(lang, 'adminStatusLoggedIn')} ({adminEmail})
            </span>
          ) : (
            getTranslation(lang, 'adminStatusNotLoggedIn')
          )}
        </span>
      </div>

      {isAdmin ? (
        <div className="flex items-center gap-2">
          <button
            onClick={openDashboard}
            className="bg-[#F4811F] hover:bg-[#C96000] text-white px-3 py-1 rounded-full font-bold transition-all"
          >
            📊 Dashboard
          </button>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full font-bold transition-all"
          >
            {getTranslation(lang, 'adminLogout')}
          </button>
        </div>
      ) : (
        <form onSubmit={handleLoginSubmit} className="flex items-center gap-1.5">
          <input
            type="email"
            placeholder="admin@bhandarafinder.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 text-white px-2.5 py-0.5 rounded-full text-xs w-36 sm:w-48 focus:outline-none focus:border-[#F4811F]"
          />
          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 text-white px-2.5 py-0.5 rounded-full text-xs w-24 sm:w-28 focus:outline-none focus:border-[#F4811F]"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#F4811F] hover:bg-[#C96000] text-white px-3 py-0.5 rounded-full font-bold transition-all disabled:opacity-50"
          >
            {loading ? '...' : getTranslation(lang, 'adminLogin')}
          </button>
        </form>
      )}
    </div>
  );
};
