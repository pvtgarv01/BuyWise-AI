import React from 'react';
import { Product } from '../../types/product';
import { useCompare } from '../../context/CompareContext';
import { SAMPLE_PRODUCTS } from '../../data/products';
import { StarRating } from '../common/StarRating';
import {
  Scale,
  Trash2,
  X,
  Plus,
  Sparkles,
  CheckCircle2,
  XCircle,
  Eye,
  Bot,
  ArrowRight,
} from 'lucide-react';

interface ComparePageProps {
  onViewDetails: (product: Product) => void;
  onAskAI: (product: Product) => void;
  onBrowseShop: () => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({
  onViewDetails,
  onAskAI,
  onBrowseShop,
}) => {
  const { compareItems, removeFromCompare, clearCompare, addToCompare } = useCompare();

  // Find lowest price and highest AI score among compared
  const lowestPrice = compareItems.length > 0 ? Math.min(...compareItems.map((p) => p.price)) : 0;
  const highestScore = compareItems.length > 0 ? Math.max(...compareItems.map((p) => p.aiMatchScore)) : 0;

  // Extract all unique specification keys
  const allSpecKeys = Array.from(
    new Set(compareItems.flatMap((p) => Object.keys(p.specifications)))
  );

  // Suggestions to add if less than 4 items
  const suggestedToAdd = SAMPLE_PRODUCTS.filter(
    (p) => !compareItems.some((item) => item.id === p.id)
  ).slice(0, 4);

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-navy-800 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
              <Scale className="w-4 h-4" />
              <span>Side-by-Side Matrix</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">
              Product Comparison Matrix
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Analyze specifications, AI match metrics, and trade-offs side by side (up to 4 products).
            </p>
          </div>

          {compareItems.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={clearCompare}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-rose-500/20 border border-navy-750 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 text-xs font-semibold transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Table</span>
              </button>
            </div>
          )}
        </div>

        {/* When 2 or more products are compared */}
        {compareItems.length >= 2 ? (
          <div className="space-y-8">
            {/* Overview / Winner Summary Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-navy-900 via-indigo-950/40 to-navy-900 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">BuyWise Advisor Analysis</h4>
                  <p className="text-xs text-slate-300">
                    Highest rated by match score: <strong className="text-brand-purple-light">{compareItems.find(p => p.aiMatchScore === highestScore)?.name}</strong> ({highestScore}%). Most cost-efficient: <strong className="text-emerald-400">{compareItems.find(p => p.price === lowestPrice)?.name}</strong> (${lowestPrice}).
                  </p>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto rounded-3xl border border-navy-800 bg-navy-900/60 shadow-2xl">
              <table className="w-full text-left border-collapse min-w-[680px]">
                <thead>
                  <tr className="border-b border-navy-800 bg-navy-950/80">
                    <th className="p-4 sm:p-6 w-48 text-xs font-bold uppercase tracking-wider text-slate-400 align-top">
                      Product
                    </th>
                    {compareItems.map((prod) => (
                      <th
                        key={prod.id}
                        className="p-4 sm:p-6 align-top border-l border-navy-800/80 min-w-[220px]"
                      >
                        <div className="relative group space-y-3">
                          <button
                            onClick={() => removeFromCompare(prod.id)}
                            className="absolute -top-2 -right-2 p-1.5 rounded-full bg-navy-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-navy-700 transition-colors"
                            title="Remove from comparison"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-navy-950 border border-navy-800">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div>
                            <span className="text-[11px] font-semibold text-brand-purple-light uppercase tracking-wider">
                              {prod.category}
                            </span>
                            <h3 className="text-sm font-semibold text-white line-clamp-2 mt-0.5">
                              {prod.name}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => onViewDetails(prod)}
                              className="flex-1 py-1.5 px-2 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 border border-navy-700"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Specs</span>
                            </button>
                            <button
                              onClick={() => onAskAI(prod)}
                              className="py-1.5 px-2 rounded-lg bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold flex items-center justify-center"
                              title="Ask AI Advisor"
                            >
                              <Bot className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </th>
                    ))}
                    {/* Placeholder slot if less than 4 */}
                    {compareItems.length < 4 && (
                      <th className="p-4 sm:p-6 align-middle border-l border-navy-800/80 border-dashed text-center min-w-[200px]">
                        <button
                          onClick={onBrowseShop}
                          className="w-full h-48 rounded-2xl border-2 border-dashed border-navy-750 hover:border-brand-purple/60 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-brand-purple-light transition-all p-4 group"
                        >
                          <div className="w-10 h-10 rounded-full bg-navy-800 group-hover:bg-brand-purple/20 flex items-center justify-center">
                            <Plus className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-semibold">Add another product</span>
                        </button>
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-navy-800 text-xs">
                  {/* Price Row */}
                  <tr className="hover:bg-navy-850/40">
                    <td className="p-4 font-semibold text-slate-400">Price</td>
                    {compareItems.map((prod) => (
                      <td key={prod.id} className="p-4 border-l border-navy-800">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold font-display text-white">
                            ${prod.price}
                          </span>
                          {prod.price === lowestPrice && compareItems.length > 1 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Lowest Price
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                    {compareItems.length < 4 && <td className="p-4 border-l border-navy-800" />}
                  </tr>

                  {/* Rating Row */}
                  <tr className="hover:bg-navy-850/40">
                    <td className="p-4 font-semibold text-slate-400">Customer Rating</td>
                    {compareItems.map((prod) => (
                      <td key={prod.id} className="p-4 border-l border-navy-800">
                        <StarRating rating={prod.rating} reviewCount={prod.reviewCount} size="sm" />
                      </td>
                    ))}
                    {compareItems.length < 4 && <td className="p-4 border-l border-navy-800" />}
                  </tr>

                  {/* AI Match Score Row */}
                  <tr className="hover:bg-navy-850/40 bg-brand-purple/5">
                    <td className="p-4 font-semibold text-brand-purple-light flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Match Score</span>
                    </td>
                    {compareItems.map((prod) => (
                      <td key={prod.id} className="p-4 border-l border-navy-800">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {prod.aiMatchScore}%
                          </span>
                          {prod.aiMatchScore === highestScore && compareItems.length > 1 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-purple text-white shadow-glow-subtle">
                              Top Match
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                    {compareItems.length < 4 && <td className="p-4 border-l border-navy-800" />}
                  </tr>

                  {/* Brand Row */}
                  <tr className="hover:bg-navy-850/40">
                    <td className="p-4 font-semibold text-slate-400">Brand & Origin</td>
                    {compareItems.map((prod) => (
                      <td key={prod.id} className="p-4 border-l border-navy-800 text-slate-200">
                        {prod.brand}
                      </td>
                    ))}
                    {compareItems.length < 4 && <td className="p-4 border-l border-navy-800" />}
                  </tr>

                  {/* Stock Status */}
                  <tr className="hover:bg-navy-850/40">
                    <td className="p-4 font-semibold text-slate-400">Availability</td>
                    {compareItems.map((prod) => (
                      <td key={prod.id} className="p-4 border-l border-navy-800">
                        <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>In Stock</span>
                        </span>
                      </td>
                    ))}
                    {compareItems.length < 4 && <td className="p-4 border-l border-navy-800" />}
                  </tr>

                  {/* Dynamic Technical Specifications Rows */}
                  {allSpecKeys.map((specKey) => (
                    <tr key={specKey} className="hover:bg-navy-850/40">
                      <td className="p-4 font-semibold text-slate-400">{specKey}</td>
                      {compareItems.map((prod) => (
                        <td
                          key={prod.id}
                          className="p-4 border-l border-navy-800 text-slate-200"
                        >
                          {prod.specifications[specKey] || (
                            <span className="text-slate-500 italic">—</span>
                          )}
                        </td>
                      ))}
                      {compareItems.length < 4 && <td className="p-4 border-l border-navy-800" />}
                    </tr>
                  ))}

                  {/* Pros Row */}
                  <tr className="hover:bg-navy-850/40 bg-emerald-950/10">
                    <td className="p-4 font-semibold text-emerald-400">Key Strengths</td>
                    {compareItems.map((prod) => (
                      <td key={prod.id} className="p-4 border-l border-navy-800 align-top">
                        <ul className="space-y-1">
                          {prod.pros.map((p, i) => (
                            <li key={i} className="text-slate-300 flex items-start gap-1.5">
                              <span className="text-emerald-400 font-bold">+</span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                    {compareItems.length < 4 && <td className="p-4 border-l border-navy-800" />}
                  </tr>

                  {/* Cons Row */}
                  <tr className="hover:bg-navy-850/40 bg-rose-950/10">
                    <td className="p-4 font-semibold text-rose-400">Trade-offs</td>
                    {compareItems.map((prod) => (
                      <td key={prod.id} className="p-4 border-l border-navy-800 align-top">
                        <ul className="space-y-1">
                          {prod.cons.map((c, i) => (
                            <li key={i} className="text-slate-300 flex items-start gap-1.5">
                              <span className="text-rose-400 font-bold">-</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                    {compareItems.length < 4 && <td className="p-4 border-l border-navy-800" />}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : compareItems.length === 1 ? (
          /* When only 1 product is in compare */
          <div className="space-y-8">
            <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 text-center max-w-2xl mx-auto space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-white">
                Add at least one more product to compare
              </h3>
              <p className="text-sm text-slate-400">
                You have selected <strong>"{compareItems[0].name}"</strong>. Select a second product to generate the side-by-side spec matrix.
              </p>
            </div>

            {/* Quick add suggestions */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
                Recommended additions for comparison:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {suggestedToAdd.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 rounded-2xl bg-navy-900 border border-navy-800 flex flex-col justify-between"
                  >
                    <div>
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-32 object-cover rounded-xl mb-3"
                      />
                      <span className="text-[10px] text-brand-purple-light font-bold uppercase">
                        {prod.category}
                      </span>
                      <h5 className="text-xs font-semibold text-white line-clamp-1">
                        {prod.name}
                      </h5>
                      <span className="text-sm font-bold text-white font-display">
                        ${prod.price}
                      </span>
                    </div>
                    <button
                      onClick={() => addToCompare(prod)}
                      className="mt-3 w-full py-1.5 px-3 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Compare</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Empty State when 0 products selected */
          <div className="bg-navy-900/60 rounded-3xl border border-navy-800 p-12 sm:p-16 text-center space-y-4 max-w-lg mx-auto my-12">
            <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400 shadow-glow-subtle">
              <Scale className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white">
              No products in comparison
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
              Select any 2 to 4 products from our catalog or Ask AI Advisor to build an automated head-to-head matrix.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onBrowseShop}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-semibold transition-all shadow-glow-purple"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  // Add first two items automatically for instant preview demonstration!
                  addToCompare(SAMPLE_PRODUCTS[0]);
                  addToCompare(SAMPLE_PRODUCTS[1]);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-navy-850 hover:bg-navy-800 border border-navy-700 text-slate-200 text-sm font-semibold transition-all"
              >
                <Sparkles className="w-4 h-4 text-brand-purple-light" />
                <span>Load Sample Comparison</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
