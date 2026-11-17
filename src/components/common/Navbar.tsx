import React, { useState } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { ProductCategory } from '../../types/product';
import { CATEGORIES_LIST } from '../../data/products';
import {
  Sparkles,
  Heart,
  Scale,
  Bot,
  Search,
  Menu,
  X,
  ChevronDown,
  ShoppingBag,
} from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'shop' | 'compare' | 'wishlist' | 'ai';
  setCurrentView: (view: 'home' | 'shop' | 'compare' | 'wishlist' | 'ai') => void;
  selectedCategory: ProductCategory | 'All';
  setSelectedCategory: (cat: ProductCategory | 'All') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectCategoryFromNav: (cat: ProductCategory | 'All') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onSelectCategoryFromNav,
}) => {
  const { count: wishlistCount } = useWishlist();
  const { count: compareCount } = useCompare();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      setCurrentView('shop');
      setMobileMenuOpen(false);
    }
  };

  const handleCategoryClick = (cat: ProductCategory | 'All') => {
    onSelectCategoryFromNav(cat);
    setCategoryDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-navy-800 bg-navy-950/85 backdrop-blur-md">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-navy-900 via-brand-purple/20 to-navy-900 border-b border-navy-800/60 text-xs py-1.5 px-4 text-center text-slate-300">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-purple-light" />
          <span className="font-medium text-slate-200">BuyWise AI Engine Active:</span>{' '}
          Personalized catalog curation & objective specification matching.
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand Tagline */}
          <button
            onClick={() => {
              setCurrentView('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 text-left group focus:outline-none shrink-0"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-purple to-indigo-700 flex items-center justify-center shadow-glow-purple group-hover:scale-105 transition-transform duration-200">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-white">
                  BuyWise<span className="text-brand-purple-light">.AI</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-brand-purple/20 text-brand-purple-light rounded border border-brand-purple/30">
                  Advisor
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">
                Your Personal AI Shopping Advisor
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'home'
                  ? 'bg-navy-800 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-navy-850'
              }`}
            >
              Home
            </button>

            {/* Categories dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoryDropdownOpen(true)}
              onMouseLeave={() => setCategoryDropdownOpen(false)}
            >
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setCurrentView('shop');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'shop'
                    ? 'bg-navy-800 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-navy-850'
                }`}
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {categoryDropdownOpen && (
                <div className="absolute left-0 top-full pt-2 w-64 z-50">
                  <div className="glass-dropdown rounded-xl shadow-2xl p-2 border border-navy-750">
                    <button
                      onClick={() => handleCategoryClick('All')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                        selectedCategory === 'All' && currentView === 'shop'
                          ? 'bg-brand-purple text-white'
                          : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                      }`}
                    >
                      All Categories ({CATEGORIES_LIST.reduce((a, b) => a + b.count, 0)} items)
                    </button>
                    <div className="h-px bg-navy-800 my-1.5" />
                    {CATEGORIES_LIST.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === cat.id && currentView === 'shop'
                            ? 'bg-brand-purple/20 text-brand-purple-light font-semibold'
                            : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs text-slate-500 bg-navy-900 px-2 py-0.5 rounded-full border border-navy-800">
                          {cat.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setCurrentView('compare')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'compare'
                  ? 'bg-navy-800 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-navy-850'
              }`}
            >
              <Scale className="w-4 h-4 text-indigo-400" />
              <span>Compare</span>
              {compareCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs font-bold bg-indigo-500 text-white rounded-full">
                  {compareCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentView('wishlist')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'wishlist'
                  ? 'bg-navy-800 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-navy-850'
              }`}
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'text-rose-400 fill-rose-400' : 'text-slate-400'}`} />
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* AI Assistant Special CTA */}
            <button
              onClick={() => setCurrentView('ai')}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border ${
                currentView === 'ai'
                  ? 'bg-brand-purple text-white border-brand-purple-light shadow-glow-purple'
                  : 'bg-navy-900 text-brand-purple-light border-brand-purple/40 hover:bg-brand-purple/15 hover:border-brand-purple'
              }`}
            >
              <Bot className="w-4 h-4 animate-pulse" />
              <span>AI Assistant</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-1 -right-1" />
            </button>
          </nav>

          {/* Search bar in Navbar */}
          <div className="hidden md:flex items-center max-w-xs lg:max-w-sm w-full">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search products, brands, specs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (currentView !== 'shop') {
                    // Let user start typing
                  }
                }}
                className="w-full bg-navy-900/90 text-sm text-slate-100 placeholder-slate-400 pl-9 pr-4 py-2 rounded-xl border border-navy-750 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>

          {/* Mobile Right Action Icons */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setCurrentView('compare')}
              className="p-2 rounded-lg bg-navy-900 border border-navy-800 text-slate-300 hover:text-white relative"
              aria-label="Compare"
            >
              <Scale className="w-5 h-5 text-indigo-400" />
              {compareCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-500 text-white rounded-full text-[11px] font-bold flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentView('wishlist')}
              className="p-2 rounded-lg bg-navy-900 border border-navy-800 text-slate-300 hover:text-white relative"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-rose-400 fill-rose-400' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full text-[11px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentView('ai')}
              className="p-2 rounded-lg bg-brand-purple/20 border border-brand-purple/40 text-brand-purple-light hover:bg-brand-purple/30"
              aria-label="AI Assistant"
            >
              <Bot className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-navy-900 border border-navy-800 text-slate-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input (Visible on small screens) */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search products, brands, specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-navy-900 text-sm text-slate-100 placeholder-slate-400 pl-9 pr-4 py-2 rounded-xl border border-navy-800 focus:outline-none focus:border-brand-purple"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-navy-800 bg-navy-950/95 backdrop-blur-xl px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-left font-medium text-sm flex items-center justify-between ${
                currentView === 'home' ? 'bg-brand-purple text-white' : 'bg-navy-900 text-slate-200'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setCurrentView('shop');
                setMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-left font-medium text-sm flex items-center justify-between ${
                currentView === 'shop' && selectedCategory === 'All' ? 'bg-brand-purple text-white' : 'bg-navy-900 text-slate-200'
              }`}
            >
              All Products
            </button>
          </div>

          <div className="pt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Browse Categories
            </p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES_LIST.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`p-2.5 rounded-lg text-left text-xs font-medium flex items-center justify-between ${
                    selectedCategory === cat.id && currentView === 'shop'
                      ? 'bg-brand-purple/20 text-brand-purple-light border border-brand-purple/40'
                      : 'bg-navy-900/60 text-slate-300 hover:bg-navy-900'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] text-slate-500">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-navy-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setCurrentView('compare');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between p-3 rounded-xl bg-navy-900 text-slate-200 text-sm"
            >
              <span className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-400" />
                Comparison Matrix
              </span>
              <span className="px-2 py-0.5 text-xs bg-indigo-500 text-white rounded-full">
                {compareCount}
              </span>
            </button>

            <button
              onClick={() => {
                setCurrentView('wishlist');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between p-3 rounded-xl bg-navy-900 text-slate-200 text-sm"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                Saved Wishlist
              </span>
              <span className="px-2 py-0.5 text-xs bg-rose-500 text-white rounded-full">
                {wishlistCount}
              </span>
            </button>

            <button
              onClick={() => {
                setCurrentView('ai');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 text-white text-sm font-semibold shadow-glow-purple"
            >
              <span className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                Ask BuyWise AI Advisor
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Live
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
