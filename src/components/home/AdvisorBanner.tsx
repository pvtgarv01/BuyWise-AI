import React from 'react';
import { Bot, Sparkles, ArrowRight, CheckCircle2, MessageSquare } from 'lucide-react';

interface AdvisorBannerProps {
  onOpenAI: (initialPrompt?: string) => void;
}

export const AdvisorBanner: React.FC<AdvisorBannerProps> = ({ onOpenAI }) => {
  const sampleQuestions = [
    'Which noise-cancelling headphones are best for long international flights?',
    'Compare the titanium smartwatch vs running gear for marathon training.',
    'I need an espresso machine with dual boilers under $900.',
    'Recommend top books on distributed systems and habit mastery.',
  ];

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-navy-900 via-brand-purple/20 to-navy-900 border border-brand-purple/30 p-8 sm:p-12 shadow-2xl">
          {/* Subtle glow circle */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Heading and value propositions */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-xs font-semibold text-brand-purple-light">
                <Bot className="w-4 h-4" />
                <span>Conversational Advisor Grounded in Local Specs</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white tracking-tight leading-tight">
                Tired of biased sponsored reviews? <br />
                <span className="text-brand-purple-light">Ask BuyWise AI directly.</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Our advisor checks verified technical specs, price brackets, and customer consensus. Zero affiliate kickbacks, zero paid placements — just honest recommendations.
              </p>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Interactive product cards embedded directly in chat</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Understands budget limits, use cases & trade-offs</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>One-click comparison matrix launch</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onOpenAI()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white font-semibold text-sm shadow-glow-purple transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open AI Assistant Chat</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Prompt Cards */}
            <div className="lg:col-span-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Click any question to ask immediately:
              </p>
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onOpenAI(q)}
                  className="w-full text-left p-3.5 rounded-xl bg-navy-950/80 hover:bg-navy-850 border border-navy-800 hover:border-brand-purple/50 text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between group shadow-sm"
                >
                  <span className="line-clamp-2 pr-2">"{q}"</span>
                  <ArrowRight className="w-4 h-4 text-brand-purple-light opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
