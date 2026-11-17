import React from 'react';
import { Product } from '../../types/product';
import { StarRating } from '../common/StarRating';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import {
  X,
  Heart,
  Scale,
  Sparkles,
  CheckCircle2,
  XCircle,
  Bot,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAskAI: (product: Product) => void;
  onOpenCompare: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAskAI,
  onOpenCompare,
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Click backdrop to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-navy-900 border border-navy-750 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-navy-950/80 hover:bg-navy-800 text-slate-300 hover:text-white transition-colors border border-navy-700"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="max-h-[85vh] overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left: Product Image & Badges */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-navy-950 border border-navy-800">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-brand-purple text-white shadow-lg border border-brand-purple-light/40">
                    {product.badge}
                  </span>
                )}
                {discountPercentage && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500 text-white shadow">
                    Save {discountPercentage}%
                  </span>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-400 p-3 rounded-xl bg-navy-950/60 border border-navy-800/80">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-brand-purple-light" />
                  <span>Verified Specs</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>Free Global Express</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-blue-400" />
                  <span>30-Day Evaluation</span>
                </div>
              </div>
            </div>

            {/* Right: Info & Pricing & AI Assessment */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-purple-light mb-1">
                  <span>{product.category}</span>
                  <span>•</span>
                  <span className="text-slate-400">{product.brand}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white leading-tight mb-2">
                  {product.name}
                </h2>
                <div className="flex items-center gap-3">
                  <StarRating rating={product.rating} reviewCount={product.reviewCount} />
                  <span className="text-xs text-emerald-400 font-medium">● In Stock & Ready to Ship</span>
                </div>
              </div>

              {/* Price display */}
              <div className="flex items-baseline gap-3 p-4 rounded-xl bg-navy-950/70 border border-navy-800">
                <span className="text-3xl font-display font-bold text-white">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {discountPercentage && (
                  <span className="text-xs font-semibold text-rose-400 ml-auto">
                    Save ${(product.originalPrice! - product.price).toFixed(2)}
                  </span>
                )}
              </div>

              {/* AI Advisor Assessment Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-purple/15 via-navy-850 to-navy-900 border border-brand-purple/30 shadow-glow-subtle space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-purple-light" />
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-purple-light">
                      BuyWise AI Evaluation
                    </span>
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-brand-purple/30 text-white font-bold text-xs">
                    {product.aiMatchScore}% Match Score
                  </div>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {product.aiHighlights}
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onAskAI(product);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-brand-purple text-white text-xs font-semibold hover:bg-brand-purple-hover transition-colors shadow-sm"
                >
                  <Bot className="w-4 h-4" />
                  <span>Consult AI Advisor About This Product</span>
                </button>
              </div>

              {/* Action Buttons: Wishlist & Compare */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all border ${
                    isFavorited
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-navy-850 hover:bg-navy-800 border-navy-700 text-slate-200'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorited ? 'fill-rose-400 text-rose-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                </button>

                <button
                  onClick={() => {
                    toggleCompare(product);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all border ${
                    isCompared
                      ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200'
                      : 'bg-navy-850 hover:bg-navy-800 border-navy-700 text-slate-200'
                  }`}
                >
                  <Scale className="w-4 h-4 text-indigo-400" />
                  <span>{isCompared ? 'Remove from Compare' : 'Add to Compare'}</span>
                </button>
              </div>

              {isCompared && (
                <div className="text-right">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCompare();
                    }}
                    className="text-xs text-indigo-300 hover:text-white underline"
                  >
                    View Side-by-Side Comparison Matrix →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description & Key Features */}
          <div className="mt-8 pt-8 border-t border-navy-800 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white mb-2">Product Overview</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{product.description}</p>
            </div>

            {/* Feature Bullets */}
            <div>
              <h3 className="text-base font-bold text-white mb-3">Key Highlights</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.features.map((feat, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-slate-300 bg-navy-950/40 p-2.5 rounded-xl border border-navy-850"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-purple-light shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pros and Cons Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Objective Strengths</span>
                </h4>
                <ul className="space-y-1.5">
                  {product.pros.map((pro, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">+</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  <span>Considerations / Trade-Offs</span>
                </h4>
                <ul className="space-y-1.5">
                  {product.cons.map((con, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-rose-400 font-bold">-</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Technical Specifications Table */}
            <div>
              <h3 className="text-base font-bold text-white mb-3">Technical Specifications</h3>
              <div className="rounded-2xl border border-navy-800 overflow-hidden bg-navy-950/50">
                <table className="w-full text-left text-xs">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, val], idx) => (
                      <tr
                        key={key}
                        className={idx % 2 === 0 ? 'bg-navy-900/40' : 'bg-transparent'}
                      >
                        <td className="py-2.5 px-4 font-semibold text-slate-400 border-b border-navy-850 w-1/3">
                          {key}
                        </td>
                        <td className="py-2.5 px-4 text-slate-200 border-b border-navy-850">
                          {val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Verified Reviews Section */}
            {product.reviews && product.reviews.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-white mb-3">
                  Verified Buyer Reviews ({product.reviews.length})
                </h3>
                <div className="space-y-3">
                  {product.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl bg-navy-950/60 border border-navy-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-200">{rev.author}</span>
                          {rev.verified && (
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <span className="text-slate-500">{rev.date}</span>
                      </div>
                      <StarRating rating={rev.rating} showCount={false} size="sm" />
                      <h5 className="text-xs font-semibold text-slate-200">{rev.title}</h5>
                      <p className="text-xs text-slate-400 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
