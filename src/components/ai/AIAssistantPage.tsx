import React, { useState, useRef, useEffect } from 'react';
import { Product, ChatMessage } from '../../types/product';
import { processAdvisorQuery } from '../../services/aiAdvisor';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { StarRating } from '../common/StarRating';
import {
  Bot,
  Send,
  Sparkles,
  Trash2,
  Heart,
  Scale,
  Eye,
  ShieldCheck,
  Check,
  ArrowRight,
  Info,
} from 'lucide-react';

interface AIAssistantPageProps {
  initialPrompt?: string;
  contextProduct?: Product | null;
  onViewDetails: (product: Product) => void;
  onOpenCompare: () => void;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({
  initialPrompt,
  contextProduct,
  onViewDetails,
  onOpenCompare,
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: `Welcome to **BuyWise AI Advisor**! I am your personal shopping advisor. I analyze technical specifications, pros & cons, and verified customer feedback from our curated catalog to give you objective, honest advice.\n\nHow can I help you today? You can specify a budget (e.g. *"Headphones under $300"*), ask for category recommendations, or request a spec-by-spec comparison.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionPrompt: 'Pick a query below or type your custom shopping question.',
      },
    ];
  });

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle incoming initial prompt or context product
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleUserSendMessage(initialPrompt);
    } else if (contextProduct) {
      handleUserSendMessage(`Tell me about ${contextProduct.name} and whether it is worth buying.`);
    }
  }, [initialPrompt, contextProduct]);

  const handleUserSendMessage = (queryText: string) => {
    const text = queryText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Realistic processing pause
    setTimeout(() => {
      const response = processAdvisorQuery(text, contextProduct || undefined);
      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: response.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProducts: response.suggestedProducts,
        comparisonProducts: response.comparisonProducts,
        actionPrompt: response.actionPrompt,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Chat cleared. What can I help you research or compare today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const promptSuggestions = [
    '🎧 Best wireless headphones under $300',
    '☕ Dual-boiler espresso machine comparison',
    '🏃‍♂️ Carbon marathon shoes for long runs',
    '📚 Books on system design & engineering',
    '🧥 Men\'s Italian leather jacket',
    '✨ Multi-peptide anti-aging skincare serum',
  ];

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Chat Card Container */}
        <div className="bg-navy-900 border border-navy-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[78vh] min-h-[580px]">
          {/* Chat Header */}
          <div className="p-4 sm:p-5 bg-navy-950/90 border-b border-navy-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-purple to-indigo-700 flex items-center justify-center shadow-glow-purple">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-bold text-base text-white">
                    BuyWise AI Shopping Advisor
                  </h2>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Catalog Grounded
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Unbiased evaluations • Spec matching • Transparent pros & cons
                </p>
              </div>
            </div>

            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-slate-400 hover:text-rose-400 transition-colors border border-navy-800"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Context Banner if evaluating a specific item */}
          {contextProduct && (
            <div className="bg-brand-purple/10 border-b border-brand-purple/20 px-4 py-2 flex items-center justify-between text-xs text-brand-purple-light">
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>Currently analyzing: <strong>{contextProduct.name}</strong> (${contextProduct.price})</span>
              </span>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-navy-800 border border-brand-purple/40 flex items-center justify-center text-brand-purple-light shrink-0 mt-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-brand-purple text-white rounded-br-none'
                      : 'bg-navy-950 border border-navy-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {/* Message Prose with formatted bullets and bold text */}
                  <div className="whitespace-pre-wrap space-y-2">
                    {msg.text.split('\n\n').map((paragraph, pIdx) => (
                      <p key={pIdx}>
                        {paragraph.split('**').map((part, idx) =>
                          idx % 2 === 1 ? (
                            <strong key={idx} className="font-bold text-white">
                              {part}
                            </strong>
                          ) : (
                            part
                          )
                        )}
                      </p>
                    ))}
                  </div>

                  {/* Render Suggested Product Cards directly inside the assistant message */}
                  {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-navy-800 space-y-3">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-brand-purple-light">
                        Matched Products from Catalog:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {msg.suggestedProducts.map((prod) => (
                          <div
                            key={prod.id}
                            className="p-3 rounded-xl bg-navy-900 border border-navy-800 hover:border-brand-purple/40 transition-colors flex flex-col justify-between"
                          >
                            <div>
                              <div className="aspect-[16/10] rounded-lg overflow-hidden bg-navy-950 mb-2">
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                                <span className="font-semibold text-brand-purple-light uppercase">
                                  {prod.category}
                                </span>
                                <span className="font-bold text-emerald-400">
                                  {prod.aiMatchScore}% Match
                                </span>
                              </div>
                              <h4
                                onClick={() => onViewDetails(prod)}
                                className="font-semibold text-xs text-white hover:text-brand-purple-light cursor-pointer line-clamp-1 mb-1"
                              >
                                {prod.name}
                              </h4>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold font-display text-white">
                                  ${prod.price}
                                </span>
                                <StarRating rating={prod.rating} size="sm" showCount={false} />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-1.5 mt-3 pt-2 border-t border-navy-800">
                              <button
                                onClick={() => onViewDetails(prod)}
                                className="py-1 px-2 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1 border border-navy-700"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Details</span>
                              </button>
                              <button
                                onClick={() => toggleWishlist(prod)}
                                className={`py-1 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 border ${
                                  isInWishlist(prod.id)
                                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                                    : 'bg-navy-800 hover:bg-navy-750 border-navy-700 text-slate-300'
                                }`}
                              >
                                <Heart className={`w-3 h-3 ${isInWishlist(prod.id) ? 'fill-rose-400 text-rose-400' : ''}`} />
                                <span>{isInWishlist(prod.id) ? 'Saved' : 'Wishlist'}</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Render Comparison Cards if query was comparison */}
                  {msg.comparisonProducts && msg.comparisonProducts.length >= 2 && (
                    <div className="mt-4 pt-4 border-t border-navy-800">
                      <button
                        onClick={onOpenCompare}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
                      >
                        <Scale className="w-4 h-4" />
                        <span>Open Side-by-Side Comparison Matrix</span>
                      </button>
                    </div>
                  )}

                  {/* Action prompt if available */}
                  {msg.actionPrompt && (
                    <p className="mt-3 text-[11px] text-slate-400 italic">
                      💡 {msg.actionPrompt}
                    </p>
                  )}

                  {/* Timestamp */}
                  <span
                    className={`block text-[10px] mt-2 ${
                      msg.sender === 'user' ? 'text-purple-200 text-right' : 'text-slate-500'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3.5 items-center">
                <div className="w-8 h-8 rounded-lg bg-navy-800 border border-brand-purple/40 flex items-center justify-center text-brand-purple-light shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-navy-950 border border-navy-800 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-purple animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-brand-purple animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-brand-purple animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-slate-400 ml-2">Advisor analyzing catalog specs...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt chips suggestions */}
          <div className="px-4 py-2 bg-navy-950/60 border-t border-navy-850 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap shrink-0">
              Suggestions:
            </span>
            {promptSuggestions.map((p, i) => (
              <button
                key={i}
                onClick={() => handleUserSendMessage(p.replace(/^[^\w\s]+/, '').trim())}
                className="px-2.5 py-1 rounded-lg bg-navy-900 hover:bg-navy-850 border border-navy-800 text-slate-300 hover:text-white whitespace-nowrap text-xs transition-colors shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 bg-navy-950 border-t border-navy-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUserSendMessage(inputValue);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask advice (e.g. 'Compare running shoes' or 'Find headphones under $300')..."
                className="flex-1 bg-navy-900 border border-navy-750 text-slate-100 placeholder-slate-400 text-sm px-4 py-3 rounded-2xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="p-3 rounded-2xl bg-brand-purple hover:bg-brand-purple-hover text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-subtle transition-all shrink-0"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            {/* Disclaimer */}
            <div className="mt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-purple-light" />
              <span>
                Grounded in the BuyWise verified catalog specs & reviews. No fake AI hallucinations or unverified external price claims.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
