import React from 'react';
import { getTranslation } from '../utils/translations';
import { Language, BhandaraCategory, FoodType } from '../types';

interface FilterBarProps {
  lang: Language;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: BhandaraCategory | 'All';
  onCategoryChange: (cat: BhandaraCategory | 'All') => void;
  dateFilter: 'all' | 'today' | 'tomorrow' | 'upcoming';
  onDateFilterChange: (f: 'all' | 'today' | 'tomorrow' | 'upcoming') => void;
  foodFilter: FoodType;
  onFoodFilterChange: (f: FoodType) => void;
  radiusFilter: number | null; // in km
  onRadiusFilterChange: (r: number | null) => void;
  viewMode: 'list' | 'map' | 'split';
  onViewModeChange: (v: 'list' | 'map' | 'split') => void;
  hasUserLocation: boolean;
  onRequestLocation: () => void;
  isNearbyActive: boolean;
  onToggleNearby: () => void;
}

const CATEGORIES: (BhandaraCategory | 'All')[] = [
  'All',
  'Navratri',
  'Guru Purnima',
  'Langar',
  'Wedding Donation',
  'Prasad',
  'Hanuman Jayanti',
  'Shivratri',
  'Other',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  lang,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  dateFilter,
  onDateFilterChange,
  foodFilter,
  onFoodFilterChange,
  radiusFilter,
  onRadiusFilterChange,
  viewMode,
  onViewModeChange,
  hasUserLocation,
  onRequestLocation,
  isNearbyActive,
  onToggleNearby,
}) => {
  return (
    <div className="bg-[var(--nav-bg)] border-b border-[var(--nav-border)] py-4 px-4 sticky top-[88px] z-[400] shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        {/* Top Controls Row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Box */}
          <div className="flex-1 min-w-[220px] sm:max-w-md flex items-center gap-2 bg-[var(--bg-input)] border-2 border-[var(--border)] rounded-full px-4 py-2 focus-within:border-[#F4811F] focus-within:ring-2 focus-within:ring-[#F4811F]/20 transition-all">
            <span className="text-[var(--text-faint)]">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={getTranslation(lang, 'searchPlaceholder')}
              className="w-full bg-transparent border-none text-sm text-[var(--text-body)] focus:outline-none placeholder:text-[var(--text-faint)]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-xs text-[var(--text-faint)] hover:text-[var(--text-body)]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Date Filters */}
          <div className="flex items-center gap-1 bg-[var(--bg-input)] p-1 rounded-full border border-[var(--border)] text-xs font-bold">
            <button
              onClick={() => onDateFilterChange('all')}
              className={`px-3 py-1 rounded-full transition-all ${
                dateFilter === 'all'
                  ? 'bg-[#F4811F] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[#F4811F]'
              }`}
            >
              {getTranslation(lang, 'allDates')}
            </button>
            <button
              onClick={() => onDateFilterChange('today')}
              className={`px-3 py-1 rounded-full transition-all ${
                dateFilter === 'today'
                  ? 'bg-[#F4811F] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[#F4811F]'
              }`}
            >
              {getTranslation(lang, 'today')}
            </button>
            <button
              onClick={() => onDateFilterChange('tomorrow')}
              className={`px-3 py-1 rounded-full transition-all ${
                dateFilter === 'tomorrow'
                  ? 'bg-[#F4811F] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[#F4811F]'
              }`}
            >
              {getTranslation(lang, 'tomorrow')}
            </button>
            <button
              onClick={() => onDateFilterChange('upcoming')}
              className={`px-3 py-1 rounded-full transition-all ${
                dateFilter === 'upcoming'
                  ? 'bg-[#F4811F] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[#F4811F]'
              }`}
            >
              {getTranslation(lang, 'upcoming')}
            </button>
          </div>

          {/* Food Type Select */}
          <select
            value={foodFilter}
            onChange={(e) => onFoodFilterChange(e.target.value as FoodType)}
            className="px-3 py-2 rounded-full border-2 border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-body)] text-xs font-bold focus:outline-none focus:border-[#F4811F]"
          >
            <option value="All">{getTranslation(lang, 'foodCategory')}</option>
            <option value="सात्विक">🌿 सात्विक</option>
            <option value="प्रसाद">🙏 प्रसाद</option>
            <option value="लंगर">🍲 लंगर</option>
            <option value="अन्नदान">🌾 अन्नदान</option>
            <option value="मिठाई">🍬 मिठाई</option>
          </select>

          {/* Radius Filter */}
          <select
            value={radiusFilter || ''}
            onChange={(e) => {
              const val = e.target.value ? Number(e.target.value) : null;
              if (val && !hasUserLocation) {
                onRequestLocation();
              }
              onRadiusFilterChange(val);
            }}
            className="px-3 py-2 rounded-full border-2 border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-body)] text-xs font-bold focus:outline-none focus:border-[#F4811F]"
          >
            <option value="">{getTranslation(lang, 'radiusAll')}</option>
            <option value="2">📍 {getTranslation(lang, 'radius2km')}</option>
            <option value="5">📍 {getTranslation(lang, 'radius5km')}</option>
            <option value="10">📍 {getTranslation(lang, 'radius10km')}</option>
          </select>

          {/* Nearby Toggle Button */}
          <button
            onClick={onToggleNearby}
            className={`px-3 py-2 rounded-full border-2 font-bold text-xs transition-all ${
              isNearbyActive
                ? 'bg-neutral-900 border-neutral-900 text-amber-400'
                : 'border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-muted)] hover:border-[#F4811F] hover:text-[#F4811F]'
            }`}
          >
            📍 {getTranslation(lang, 'nearbyBtn')}
          </button>

          {/* View Mode Switcher (List / Map / Split) */}
          <div className="ml-auto flex items-center bg-[var(--bg-input)] p-1 rounded-full border border-[var(--border)] text-xs font-bold">
            <button
              onClick={() => onViewModeChange('list')}
              className={`px-3 py-1 rounded-full transition-all ${
                viewMode === 'list'
                  ? 'bg-[#F4811F] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[#F4811F]'
              }`}
            >
              {getTranslation(lang, 'listView')}
            </button>
            <button
              onClick={() => onViewModeChange('map')}
              className={`px-3 py-1 rounded-full transition-all ${
                viewMode === 'map'
                  ? 'bg-[#F4811F] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[#F4811F]'
              }`}
            >
              {getTranslation(lang, 'mapView')}
            </button>
            <button
              onClick={() => onViewModeChange('split')}
              className={`hidden md:block px-3 py-1 rounded-full transition-all ${
                viewMode === 'split'
                  ? 'bg-[#F4811F] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[#F4811F]'
              }`}
            >
              {getTranslation(lang, 'splitView')}
            </button>
          </div>
        </div>

        {/* Multi-Select Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3.5 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-[#F4811F] border-[#F4811F] text-white shadow-sm scale-105'
                  : 'bg-[var(--bg-chip)] border-[var(--border)] text-[var(--text-muted)] hover:border-[#F4811F] hover:text-[#F4811F]'
              }`}
            >
              {cat === 'All' ? getTranslation(lang, 'allCategories') : cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
