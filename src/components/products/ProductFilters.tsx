import React from 'react';
import { ProductCategory, FilterState } from '../../types/product';
import { CATEGORIES_LIST } from '../../data/products';
import { RotateCcw, Filter, SlidersHorizontal, Check } from 'lucide-react';

interface ProductFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalCount: number;
  filteredCount: number;
  onReset: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  setFilters,
  totalCount,
  filteredCount,
  onReset,
}) => {
  const handleCategoryChange = (category: ProductCategory | 'All') => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const handleRatingChange = (minRating: number) => {
    setFilters((prev) => ({
      ...prev,
      minRating: prev.minRating === minRating ? 0 : minRating,
    }));
  };

  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.searchQuery !== '' ||
    filters.minPrice > 0 ||
    filters.maxPrice < 1000 ||
    filters.minRating > 0 ||
    filters.inStockOnly;

  return (
    <div className="bg-navy-900/80 rounded-2xl border border-navy-800 p-5 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-navy-800">
        <div className="flex items-center gap-2 text-slate-100 font-semibold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-brand-purple-light" />
          <span>Filters & Refining</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-brand-purple-light hover:text-white transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
          Category
        </label>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => handleCategoryChange('All')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
              filters.category === 'All'
                ? 'bg-brand-purple text-white font-semibold shadow-glow-subtle'
                : 'text-slate-300 hover:bg-navy-800'
            }`}
          >
            <span>All Categories</span>
            <span className="text-[11px] opacity-75">{totalCount}</span>
          </button>

          {CATEGORIES_LIST.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                filters.category === cat.id
                  ? 'bg-brand-purple text-white font-semibold shadow-glow-subtle'
                  : 'text-slate-300 hover:bg-navy-800'
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[11px] opacity-75">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
          <span>Max Price</span>
          <span className="text-brand-purple-light font-display text-sm font-bold">
            ${filters.maxPrice}
          </span>
        </div>
        <input
          type="range"
          min={20}
          max={1000}
          step={20}
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
          }
          className="w-full accent-brand-purple bg-navy-800 h-2 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-500 mt-1">
          <span>$20</span>
          <span>$500</span>
          <span>$1000</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
          Minimum Rating
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[4.8, 4.5, 4.0].map((starVal) => (
            <button
              key={starVal}
              onClick={() => handleRatingChange(starVal)}
              className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                filters.minRating === starVal
                  ? 'bg-amber-400/15 border-amber-400/50 text-amber-300 font-semibold'
                  : 'bg-navy-850 border-navy-750 text-slate-400 hover:text-slate-200'
              }`}
            >
              ★ {starVal}+
            </button>
          ))}
        </div>
      </div>

      {/* In-Stock Filter */}
      <div className="pt-2 border-t border-navy-800">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))
            }
            className="w-4 h-4 rounded border-navy-700 bg-navy-800 text-brand-purple focus:ring-brand-purple cursor-pointer"
          />
          <span className="text-xs font-medium text-slate-300">
            In Stock Items Only
          </span>
        </label>
      </div>

      {/* Results badge */}
      <div className="p-3 rounded-xl bg-navy-950/70 border border-navy-800/80 text-center">
        <span className="text-xs text-slate-400">
          Showing <span className="font-bold text-white">{filteredCount}</span> of{' '}
          {totalCount} products
        </span>
      </div>
    </div>
  );
};
