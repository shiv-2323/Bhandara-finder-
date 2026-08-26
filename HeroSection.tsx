import React from 'react';
import { getTranslation } from '../utils/translations';
import { Language } from '../types';

interface HeroSectionProps {
  lang: Language;
  totalCount: number;
  todayCount: number;
  totalMeals: number;
  onFindClick: () => void;
  onAddClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  totalCount,
  todayCount,
  totalMeals,
  onFindClick,
  onAddClick,
}) => {
  return (
    <section className="relative min-h-[460px] bg-gradient-to-br from-[#F4811F] via-[#B85200] to-[#120800] text-white py-14 px-4 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -right-10 -bottom-10 text-[260px] opacity-10 select-none pointer-events-none leading-none">
        🍛
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5">
          {getTranslation(lang, 'heroBadge')}
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 text-shadow leading-tight">
          {getTranslation(lang, 'heroTitle')}{' '}
          <em className="not-italic text-[#E8A000]">{getTranslation(lang, 'heroTitleHighlight')}</em>{' '}
          {getTranslation(lang, 'heroTitleEnd')}
        </h1>

        <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto mb-8 leading-relaxed">
          {getTranslation(lang, 'heroSub')}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            onClick={onFindClick}
            className="bg-white text-[#F4811F] hover:bg-amber-50 px-7 py-3 rounded-full font-extrabold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            {getTranslation(lang, 'findBtn')}
          </button>
          <button
            onClick={onAddClick}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 backdrop-blur-md px-7 py-3 rounded-full font-extrabold text-sm hover:-translate-y-0.5 transition-all"
          >
            {getTranslation(lang, 'addBtn')}
          </button>
        </div>

        {/* Live Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center">
            <div className="text-2xl font-extrabold font-['Baloo_2']">{totalCount}</div>
            <div className="text-xs text-white/80">{getTranslation(lang, 'listedStat')}</div>
          </div>
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center">
            <div className="text-2xl font-extrabold font-['Baloo_2'] text-emerald-300">{todayCount}</div>
            <div className="text-xs text-white/80">{getTranslation(lang, 'todayStat')}</div>
          </div>
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center">
            <div className="text-2xl font-extrabold font-['Baloo_2'] text-amber-300">
              {totalMeals >= 1000 ? `${(totalMeals / 1000).toFixed(1)}k+` : totalMeals}
            </div>
            <div className="text-xs text-white/80">{getTranslation(lang, 'mealsServedStat')}</div>
          </div>
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center">
            <div className="text-2xl font-extrabold font-['Baloo_2']">100%</div>
            <div className="text-xs text-white/80">{getTranslation(lang, 'freeStat')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
