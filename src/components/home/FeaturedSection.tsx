import React, { useState } from 'react';
import { Product } from '../../types/product';
import { SAMPLE_PRODUCTS } from '../../data/products';
import { ProductCard } from '../products/ProductCard';
import { Sparkles, ArrowRight, Award, Flame, ThumbsUp } from 'lucide-react';

interface FeaturedSectionProps {
  onViewDetails: (product: Product) => void;
  onAskAI: (product: Product) => void;
  onExploreAll: () => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  onViewDetails,
  onAskAI,
  onExploreAll,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'ai' | 'bestsellers' | 'editors'>('all');

  const filteredProducts = SAMPLE_PRODUCTS.filter((prod) => {
    if (activeTab === 'ai') return prod.badge === 'AI Pick';
    if (activeTab === 'bestsellers') return prod.badge === 'Best Seller';
    if (activeTab === 'editors') return prod.badge === 'Editor Choice';
    return true;
  }).slice(0, 8);

  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-purple-light mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tested & Verified Excellence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Featured Products
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-navy-900 rounded-xl border border-navy-800 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'all'
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Featured
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'ai'
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-brand-purple-light" />
              <span>AI Top Picks</span>
            </button>

            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'bestsellers'
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3 h-3 text-amber-400" />
              <span>Best Sellers</span>
            </button>

            <button
              onClick={() => setActiveTab('editors')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'editors'
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-3 h-3 text-indigo-400" />
              <span>Editor Choice</span>
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onViewDetails}
              onAskAI={onAskAI}
            />
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={onExploreAll}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-850 border border-navy-750 text-slate-200 hover:text-white font-semibold text-sm transition-all shadow-md group"
          >
            <span>Browse Full Catalog ({SAMPLE_PRODUCTS.length} Products)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-brand-purple-light" />
          </button>
        </div>
      </div>
    </section>
  );
};
