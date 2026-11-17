import React, { useState } from 'react';
import { Search, Sparkles, Bot, ArrowRight, ShieldCheck, Zap, Scale } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onExplore: () => void;
  onConsultAI: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onExplore,
  onConsultAI,
}) => {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal);
    }
  };

  const handleSuggestionClick = (query: string) => {
    setInputVal(query);
    onSearch(query);
  };

  const sampleChips = [
    '🎧 Noise-cancelling headphones under $300',
    '☕ Dual-boiler espresso machine',
    '🏃‍♂️ Carbon marathon shoes',
    '📚 System design engineering books',
    '🧥 Italian full-grain leather jacket',
  ];

  return (
    <div className="relative overflow-hidden pt-8 pb-16 lg:py-20 border-b border-navy-800/80 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950">
      {/* Background radial purple/indigo glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-purple/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/15 border border-brand-purple/35 text-xs font-semibold text-brand-purple-light shadow-glow-subtle animate-pulse-slow">
            <Sparkles className="w-4 h-4 text-brand-purple-light" />
            <span>BuyWise AI • Your Personal AI Shopping Advisor</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Make Every Purchase <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-brand-purple-light">
              Scientifically Sound.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Eliminate endless tabs and fake reviews. BuyWise AI analyzes technical specifications, verified owner sentiment, and value matrices to recommend the ideal products for your budget.
          </p>

          {/* Hero Search Box */}
          <div className="pt-2 max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-brand-purple via-indigo-600 to-purple-500 opacity-30 group-hover:opacity-75 blur-md transition duration-300" />
              <div className="relative flex items-center bg-navy-900 border border-navy-700/80 rounded-2xl p-1.5 shadow-2xl">
                <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Ask advisor or search products (e.g. 'headphones under $300')..."
                  className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-400 px-3 py-2.5 focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs sm:text-sm font-semibold transition-all shadow-glow-subtle shrink-0"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Prompt Suggestion Chips */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold mr-1">
                Try queries:
              </span>
              {sampleChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(chip.replace(/^[^\w\s]+/, '').trim())}
                  className="px-2.5 py-1 rounded-lg bg-navy-850 hover:bg-navy-800 border border-navy-750 text-slate-300 hover:text-white transition-colors text-xs"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onConsultAI}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-brand-purple-hover hover:to-indigo-500 text-white font-semibold text-sm shadow-glow-purple transition-all transform hover:-translate-y-0.5"
            >
              <Bot className="w-4 h-4" />
              <span>Talk with BuyWise Advisor</span>
            </button>

            <button
              onClick={onExplore}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-850 hover:bg-navy-800 border border-navy-700 text-slate-200 hover:text-white font-semibold text-sm transition-all"
            >
              <span>Explore All Categories</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Social Proof / Trust Metrics */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto border-t border-navy-800/60 text-center">
            <div className="p-2">
              <div className="flex items-center justify-center gap-1.5 text-brand-purple-light font-display font-bold text-lg">
                <Zap className="w-4 h-4 text-brand-purple-light" />
                <span>100% Grounded</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Real catalog specs only</p>
            </div>

            <div className="p-2">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-display font-bold text-lg">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Ads</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Unbiased algorithm</p>
            </div>

            <div className="p-2 col-span-2 sm:col-span-1">
              <div className="flex items-center justify-center gap-1.5 text-indigo-400 font-display font-bold text-lg">
                <Scale className="w-4 h-4" />
                <span>Multi-Category</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">6 premium collections</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
