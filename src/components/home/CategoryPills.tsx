import React from 'react';
import { ProductCategory } from '../../types/product';
import { CATEGORIES_LIST } from '../../data/products';
import {
  Laptop,
  Shirt,
  Coffee,
  Sparkles,
  Trophy,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface CategoryPillsProps {
  onSelectCategory: (category: ProductCategory) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({ onSelectCategory }) => {
  const getCategoryIcon = (category: ProductCategory) => {
    switch (category) {
      case 'Electronics':
        return <Laptop className="w-6 h-6 text-cyan-400" />;
      case 'Fashion':
        return <Shirt className="w-6 h-6 text-rose-400" />;
      case 'Home & Kitchen':
        return <Coffee className="w-6 h-6 text-amber-400" />;
      case 'Beauty':
        return <Sparkles className="w-6 h-6 text-pink-400" />;
      case 'Sports':
        return <Trophy className="w-6 h-6 text-emerald-400" />;
      case 'Books':
        return <BookOpen className="w-6 h-6 text-indigo-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-brand-purple" />;
    }
  };

  return (
    <section className="py-12 border-b border-navy-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-purple-light mb-1">
              <span>Curated Departments</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Explore by Category
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Every category is indexed with granular hardware specifications, benchmark ratings, and pros & cons.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {CATEGORIES_LIST.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group p-4 rounded-2xl bg-navy-900/70 hover:bg-navy-850 border border-navy-800 hover:border-brand-purple/50 transition-all duration-300 text-left flex flex-col justify-between shadow-card hover:shadow-card-hover"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-navy-950 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 border border-navy-800">
                  {getCategoryIcon(cat.id)}
                </div>
                <h3 className="font-semibold text-sm text-slate-100 group-hover:text-brand-purple-light transition-colors mb-1">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-navy-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>{cat.count} curated items</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-brand-purple-light" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
