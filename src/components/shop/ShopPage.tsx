import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, FilterState, SortOption } from '../../types/product';
import { SAMPLE_PRODUCTS } from '../../data/products';
import { ProductCard } from '../products/ProductCard';
import { ProductFilters } from '../products/ProductFilters';
import { Search, SlidersHorizontal, ArrowUpDown, X, PackageSearch } from 'lucide-react';

interface ShopPageProps {
  initialCategory?: ProductCategory | 'All';
  initialSearchQuery?: string;
  onViewDetails: (product: Product) => void;
  onAskAI: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory = 'All',
  initialSearchQuery = '',
  onViewDetails,
  onAskAI,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: initialSearchQuery,
    category: initialCategory,
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
    inStockOnly: false,
    sortBy: 'featured',
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync when initialCategory changes from Navbar
  React.useEffect(() => {
    if (initialCategory) {
      setFilters((prev) => ({ ...prev, category: initialCategory }));
    }
  }, [initialCategory]);

  React.useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setFilters((prev) => ({ ...prev, searchQuery: initialSearchQuery }));
    }
  }, [initialSearchQuery]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'All',
      minPrice: 0,
      maxPrice: 1000,
      minRating: 0,
      inStockOnly: false,
      sortBy: 'featured',
    });
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return SAMPLE_PRODUCTS.filter((product) => {
      // Category filter
      if (filters.category !== 'All' && product.category !== filters.category) {
        return false;
      }

      // Search query (matches name, brand, description, tags)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const searchableText = `${product.name} ${product.brand} ${product.description} ${product.category} ${product.tags.join(' ')}`.toLowerCase();
        if (!searchableText.includes(query)) {
          return false;
        }
      }

      // Price filter
      if (product.price > filters.maxPrice) {
        return false;
      }

      // Rating filter
      if (filters.minRating > 0 && product.rating < filters.minRating) {
        return false;
      }

      // Stock filter
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating-desc':
          return b.rating - a.rating;
        case 'ai-score-desc':
          return b.aiMatchScore - a.aiMatchScore;
        case 'reviews-desc':
          return b.reviewCount - a.reviewCount;
        default:
          // featured
          return b.aiMatchScore - a.aiMatchScore;
      }
    });
  }, [filters]);

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Shop Banner / Header */}
        <div className="mb-8 pb-6 border-b border-navy-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-white tracking-tight">
                {filters.category === 'All' ? 'All Curated Products' : `${filters.category} Collection`}
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Explore verified products with transparent technical specs and objective AI match scores.
              </p>
            </div>

            {/* Mobile Filter Toggle & Sort selector */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-navy-900 border border-navy-750 text-slate-200 text-xs font-semibold"
              >
                <SlidersHorizontal className="w-4 h-4 text-brand-purple-light" />
                <span>Filters</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 bg-navy-900 border border-navy-750 px-3 py-2 rounded-xl text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-400 hidden sm:inline">Sort:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, sortBy: e.target.value as SortOption }))
                  }
                  className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="featured" className="bg-navy-900 text-slate-200">
                    Featured & AI Picks
                  </option>
                  <option value="ai-score-desc" className="bg-navy-900 text-slate-200">
                    Highest AI Match Score
                  </option>
                  <option value="price-asc" className="bg-navy-900 text-slate-200">
                    Price: Low to High
                  </option>
                  <option value="price-desc" className="bg-navy-900 text-slate-200">
                    Price: High to Low
                  </option>
                  <option value="rating-desc" className="bg-navy-900 text-slate-200">
                    Highest Customer Rating
                  </option>
                  <option value="reviews-desc" className="bg-navy-900 text-slate-200">
                    Most Reviewed
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Pills Bar */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {filters.category !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-purple/20 text-brand-purple-light border border-brand-purple/40">
                <span>Category: {filters.category}</span>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, category: 'All' }))}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-navy-850 text-slate-200 border border-navy-700">
                <span>Search: "{filters.searchQuery}"</span>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.maxPrice < 1000 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-navy-850 text-slate-200 border border-navy-700">
                <span>Max: ${filters.maxPrice}</span>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, maxPrice: 1000 }))}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.minRating > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/15 text-amber-300 border border-amber-400/40">
                <span>★ {filters.minRating}+</span>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, minRating: 0 }))}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.inStockOnly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <span>In Stock Only</span>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, inStockOnly: false }))}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:col-span-1 sticky top-28">
            <ProductFilters
              filters={filters}
              setFilters={setFilters}
              totalCount={SAMPLE_PRODUCTS.length}
              filteredCount={filteredProducts.length}
              onReset={handleResetFilters}
            />
          </div>

          {/* Mobile Filter Slide Drawer */}
          {mobileFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex justify-end">
              <div className="w-full max-w-xs bg-navy-900 h-full p-5 overflow-y-auto border-l border-navy-800">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-navy-800">
                  <h3 className="font-semibold text-sm text-white">Filter Products</h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <ProductFilters
                  filters={filters}
                  setFilters={setFilters}
                  totalCount={SAMPLE_PRODUCTS.length}
                  filteredCount={filteredProducts.length}
                  onReset={handleResetFilters}
                />
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="mt-6 w-full py-2.5 rounded-xl bg-brand-purple text-white text-xs font-semibold"
                >
                  Apply Filters ({filteredProducts.length})
                </button>
              </div>
            </div>
          )}

          {/* Products Grid or Empty State */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={onViewDetails}
                    onAskAI={onAskAI}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-navy-900/60 rounded-3xl border border-navy-800 p-12 text-center space-y-4 max-w-lg mx-auto my-12">
                <div className="w-16 h-16 rounded-2xl bg-navy-850 border border-navy-750 flex items-center justify-center mx-auto text-brand-purple-light">
                  <PackageSearch className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-display text-white">
                  No matching products found
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  We couldn't find any products matching your current filters or search term. Try expanding your price limit or clearing filters.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold transition-all shadow-glow-subtle"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
