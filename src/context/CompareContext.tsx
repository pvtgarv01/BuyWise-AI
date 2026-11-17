import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types/product';
import { useToast } from './ToastContext';

interface CompareContextType {
  compareItems: Product[];
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  toggleCompare: (product: Product) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  count: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'buywise_ai_compare';
const MAX_COMPARE_ITEMS = 4;

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareItems, setCompareItems] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to read compare items from localStorage', e);
      return [];
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(compareItems));
    } catch (e) {
      console.error('Failed to save compare items to localStorage', e);
    }
  }, [compareItems]);

  const addToCompare = (product: Product): boolean => {
    if (compareItems.some((item) => item.id === product.id)) {
      return true;
    }
    if (compareItems.length >= MAX_COMPARE_ITEMS) {
      showToast(
        `Comparison table is limited to ${MAX_COMPARE_ITEMS} products at once. Remove one to add another.`,
        'warning',
        'Compare Limit'
      );
      return false;
    }
    setCompareItems((prev) => [...prev, product]);
    showToast(`Added "${product.name}" to comparison.`, 'success', 'Compare Ready');
    return true;
  };

  const removeFromCompare = (productId: string) => {
    const item = compareItems.find((p) => p.id === productId);
    setCompareItems((prev) => prev.filter((p) => p.id !== productId));
    if (item) {
      showToast(`Removed "${item.name}" from comparison.`, 'info');
    }
  };

  const toggleCompare = (product: Product) => {
    if (compareItems.some((item) => item.id === product.id)) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const isInCompare = (productId: string) => {
    return compareItems.some((item) => item.id === productId);
  };

  const clearCompare = () => {
    setCompareItems([]);
    showToast('Comparison list cleared.', 'info');
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        isInCompare,
        clearCompare,
        count: compareItems.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
