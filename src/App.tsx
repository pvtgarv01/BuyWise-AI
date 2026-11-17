import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import { ToastContainer } from './components/common/Toast';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/home/HeroSection';
import { CategoryPills } from './components/home/CategoryPills';
import { FeaturedSection } from './components/home/FeaturedSection';
import { AdvisorBanner } from './components/home/AdvisorBanner';
import { ShopPage } from './components/shop/ShopPage';
import { WishlistPage } from './components/wishlist/WishlistPage';
import { ComparePage } from './components/compare/ComparePage';
import { AIAssistantPage } from './components/ai/AIAssistantPage';
import { ProductDetailModal } from './components/products/ProductDetailModal';
import { Product, ProductCategory } from './types/product';

export const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'compare' | 'wishlist' | 'ai'>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  // States to pass to AI Assistant
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>(undefined);
  const [aiContextProduct, setAiContextProduct] = useState<Product | null>(null);

  // Handlers
  const handleOpenDetailModal = (product: Product) => {
    setSelectedProductForModal(product);
  };

  const handleCloseDetailModal = () => {
    setSelectedProductForModal(null);
  };

  const handleConsultAIAboutProduct = (product: Product) => {
    setAiContextProduct(product);
    setAiInitialPrompt(`I am considering the ${product.name} ($${product.price}). Can you summarize its pros, cons, and whether it's the best option in ${product.category}?`);
    setCurrentView('ai');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (category: ProductCategory | 'All') => {
    setSelectedCategory(category);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAIFromBanner = (prompt?: string) => {
    setAiContextProduct(null);
    setAiInitialPrompt(prompt || '');
    setCurrentView('ai');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 selection:bg-brand-purple selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectCategoryFromNav={handleSelectCategory}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <div>
            <HeroSection
              onSearch={handleHeroSearch}
              onExplore={() => {
                setSelectedCategory('All');
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onConsultAI={() => handleOpenAIFromBanner()}
            />

            <CategoryPills onSelectCategory={handleSelectCategory} />

            <FeaturedSection
              onViewDetails={handleOpenDetailModal}
              onAskAI={handleConsultAIAboutProduct}
              onExploreAll={() => {
                setSelectedCategory('All');
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <AdvisorBanner onOpenAI={handleOpenAIFromBanner} />
          </div>
        )}

        {currentView === 'shop' && (
          <ShopPage
            initialCategory={selectedCategory}
            initialSearchQuery={searchQuery}
            onViewDetails={handleOpenDetailModal}
            onAskAI={handleConsultAIAboutProduct}
          />
        )}

        {currentView === 'compare' && (
          <ComparePage
            onViewDetails={handleOpenDetailModal}
            onAskAI={handleConsultAIAboutProduct}
            onBrowseShop={() => {
              setSelectedCategory('All');
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'wishlist' && (
          <WishlistPage
            onViewDetails={handleOpenDetailModal}
            onAskAI={handleConsultAIAboutProduct}
            onBrowseShop={() => {
              setSelectedCategory('All');
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCompare={() => {
              setCurrentView('compare');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'ai' && (
          <AIAssistantPage
            initialPrompt={aiInitialPrompt}
            contextProduct={aiContextProduct}
            onViewDetails={handleOpenDetailModal}
            onOpenCompare={() => {
              setCurrentView('compare');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductForModal}
        onClose={handleCloseDetailModal}
        onAskAI={handleConsultAIAboutProduct}
        onOpenCompare={() => {
          handleCloseDetailModal();
          setCurrentView('compare');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Global Toast Container */}
      <ToastContainer />

      {/* Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onNavigateAI={() => {
          setCurrentView('ai');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <WishlistProvider>
        <CompareProvider>
          <AppContent />
        </CompareProvider>
      </WishlistProvider>
    </ToastProvider>
  );
};

export default App;
