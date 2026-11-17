import React, { useState } from 'react';
import { ShoppingBag, Sparkles, ShieldCheck, Cpu, ArrowRight, Heart } from 'lucide-react';
import { CATEGORIES_LIST } from '../../data/products';
import { ProductCategory } from '../../types/product';
import { useToast } from '../../context/ToastContext';

interface FooterProps {
  onSelectCategory: (cat: ProductCategory) => void;
  onNavigateAI: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onNavigateAI }) => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().includes('@')) {
      showToast('Thank you for subscribing to BuyWise AI product alerts & deal intelligence.', 'success');
      setEmail('');
    } else {
      showToast('Please enter a valid email address.', 'warning');
    }
  };

  return (
    <footer className="bg-navy-950 border-t border-navy-800 text-slate-400 mt-20">
      {/* Upper Feature Highlights Bar */}
      <div className="border-b border-navy-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-navy-900/40 border border-navy-800/60">
              <div className="w-10 h-10 rounded-lg bg-brand-purple/15 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-brand-purple-light" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Objective AI Scoring</h4>
                <p className="text-xs text-slate-400">Spec-driven unbiased ratings</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-navy-900/40 border border-navy-800/60">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Zero Sponsored Bias</h4>
                <p className="text-xs text-slate-400">Honest pros, cons & trade-offs</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-navy-900/40 border border-navy-800/60">
              <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Side-by-Side Specs</h4>
                <p className="text-xs text-slate-400">Granular matrix comparison</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-navy-900/40 border border-navy-800/60">
              <div className="w-10 h-10 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Local Wishlist Storage</h4>
                <p className="text-xs text-slate-400">Zero tracking, persistent in browser</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-purple to-indigo-700 flex items-center justify-center shadow-glow-purple">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-xl text-white tracking-tight">
                  BuyWise<span className="text-brand-purple-light">.AI</span>
                </span>
                <p className="text-xs text-slate-400">Your Personal AI Shopping Advisor</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              BuyWise AI combines deep specification benchmarking, verified customer consensus, and contextual recommendation logic to help you buy with absolute confidence.
            </p>
            <div className="pt-2">
              <button
                onClick={onNavigateAI}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-purple-light hover:text-white transition-colors"
              >
                <span>Consult with AI Advisor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Explore Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              {CATEGORIES_LIST.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className="hover:text-brand-purple-light transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Smart Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Advisor Features
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-300">Spec Comparison Matrix</span>
              </li>
              <li>
                <span className="text-slate-300">AI Match Score Engine</span>
              </li>
              <li>
                <span className="text-slate-300">Grounded Budget Analyzer</span>
              </li>
              <li>
                <span className="text-slate-300">Verified Pros & Cons</span>
              </li>
              <li>
                <span className="text-slate-300">Local Wishlist Manager</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Stay Informed
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Receive smart price alerts and unbiased product breakdowns directly to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-navy-900 border border-navy-800 text-slate-200 text-xs px-3 py-2.5 rounded-lg placeholder-slate-500 focus:outline-none focus:border-brand-purple"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold transition-all shadow-glow-subtle"
              >
                Subscribe to Advisor Briefs
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-10 mt-10 border-t border-navy-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 BuyWise AI. All rights reserved. Built for discerning shoppers.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Grounded Data Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
