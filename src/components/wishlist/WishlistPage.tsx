import React from 'react';
import { Product } from '../../types/product';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { ProductCard } from '../products/ProductCard';
import { Heart, Trash2, Scale, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';

interface WishlistPageProps {
  onViewDetails: (product: Product) => void;
  onAskAI: (product: Product) => void;
  onBrowseShop: () => void;
  onOpenCompare: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  onViewDetails,
  onAskAI,
  onBrowseShop,
  onOpenCompare,
}) => {
  const { wishlist, clearWishlist, count } = useWishlist();
  const { addToCompare } = useCompare();

  const totalValue = wishlist.reduce((sum, item) => sum + item.price, 0);

  const handleCompareAll = () => {
    wishlist.slice(0, 4).forEach((prod) => {
      addToCompare(prod);
    });
    onOpenCompare();
  };

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-navy-800 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">
              <Heart className="w-4 h-4 fill-rose-400" />
              <span>Saved Items (Local Storage)</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">
              My Personal Wishlist
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Your shortlisted products persist automatically in your browser storage.
            </p>
          </div>

          {count > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleCompareAll}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-semibold transition-all"
              >
                <Scale className="w-4 h-4" />
                <span>Compare Wishlist Items</span>
              </button>

              <button
                onClick={clearWishlist}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-navy-900 hover:bg-rose-500/20 border border-navy-750 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 text-xs font-semibold transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>
          )}
        </div>

        {/* When items exist */}
        {count > 0 ? (
          <div>
            {/* Quick summary strip */}
            <div className="mb-8 p-4 rounded-2xl bg-navy-900/70 border border-navy-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Total Saved</span>
                  <p className="text-lg font-bold font-display text-white">{count} items</p>
                </div>
                <div className="h-8 w-px bg-navy-800" />
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Combined Value</span>
                  <p className="text-lg font-bold font-display text-brand-purple-light">${totalValue.toLocaleString()}</p>
                </div>
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-purple-light" />
                <span>Average AI Match Score: {Math.round(wishlist.reduce((acc, i) => acc + i.aiMatchScore, 0) / count)}%</span>
              </div>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={onViewDetails}
                  onAskAI={onAskAI}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-navy-900/60 rounded-3xl border border-navy-800 p-12 sm:p-16 text-center space-y-4 max-w-lg mx-auto my-12">
            <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400 shadow-glow-subtle">
              <Heart className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white">
              Your wishlist is currently empty
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
              Save products while browsing or asking our AI Advisor to compare specs, monitor prices, and build your ideal setup.
            </p>
            <div className="pt-4">
              <button
                onClick={onBrowseShop}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-semibold transition-all shadow-glow-purple"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Discover Curated Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
