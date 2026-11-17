import React from 'react';
import { Product } from '../../types/product';
import { StarRating } from '../common/StarRating';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { Heart, Scale, Sparkles, Eye, Check, Bot } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAskAI: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onAskAI,
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group relative bg-navy-900/90 rounded-2xl border border-navy-800/80 hover:border-brand-purple/40 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top Media Area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy-950">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent opacity-60" />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.badge && (
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide shadow-md ${
                product.badge === 'AI Pick'
                  ? 'bg-brand-purple text-white border border-brand-purple-light/40 shadow-glow-subtle'
                  : product.badge === 'Best Seller'
                  ? 'bg-amber-500 text-navy-950 font-black'
                  : product.badge === 'Editor Choice'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {product.badge === 'AI Pick' && <Sparkles className="w-3 h-3 inline mr-1 -mt-0.5" />}
              {product.badge}
            </span>
          )}

          {discountPercentage && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/90 text-white shadow">
              -{discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* AI Match Score Tag (Top Right) */}
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-navy-950/85 backdrop-blur-md border border-brand-purple/50 shadow-md">
            <Sparkles className="w-3 h-3 text-brand-purple-light" />
            <span className="text-xs font-bold text-slate-100">{product.aiMatchScore}%</span>
            <span className="text-[10px] text-brand-purple-light font-medium uppercase tracking-wider">Match</span>
          </div>
        </div>

        {/* Quick View Hover Action Overlay */}
        <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-4">
          <button
            onClick={() => onViewDetails(product)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-navy-950 font-semibold text-xs shadow-lg hover:bg-slate-100 transition-all transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-4 h-4" />
            <span>Quick Specs</span>
          </button>
          <button
            onClick={() => onAskAI(product)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-purple text-white font-semibold text-xs shadow-glow-subtle hover:bg-brand-purple-hover transition-all transform translate-y-2 group-hover:translate-y-0"
          >
            <Bot className="w-4 h-4" />
            <span>Ask Advisor</span>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Brand row */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold text-brand-purple-light uppercase tracking-wider text-[11px]">
              {product.category}
            </span>
            <span className="text-slate-400 font-medium">{product.brand}</span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onViewDetails(product)}
            className="text-base font-semibold text-slate-100 line-clamp-2 hover:text-brand-purple-light cursor-pointer transition-colors leading-snug mb-2"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Rating */}
          <div className="mb-3">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size="sm" />
          </div>
        </div>

        {/* Price & Action Row */}
        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-bold font-display text-white">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-500 line-through">
                ${product.originalPrice}
              </span>
            )}
            <span className="text-[11px] text-emerald-400 ml-auto font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              In Stock
            </span>
          </div>

          {/* Interactive Button Strip */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-navy-800">
            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all border ${
                isFavorited
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                  : 'bg-navy-850 hover:bg-navy-800 border-navy-750 text-slate-300 hover:text-white'
              }`}
              title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  isFavorited ? 'fill-rose-400 text-rose-400' : 'text-slate-400'
                }`}
              />
              <span>{isFavorited ? 'Saved' : 'Wishlist'}</span>
            </button>

            {/* Compare Button */}
            <button
              onClick={() => toggleCompare(product)}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all border ${
                isCompared
                  ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                  : 'bg-navy-850 hover:bg-navy-800 border-navy-750 text-slate-300 hover:text-white'
              }`}
              title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
            >
              {isCompared ? (
                <>
                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Comparing</span>
                </>
              ) : (
                <>
                  <Scale className="w-3.5 h-3.5 text-slate-400" />
                  <span>Compare</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
