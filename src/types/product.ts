export type ProductCategory = 
  | 'Electronics'
  | 'Fashion'
  | 'Home & Kitchen'
  | 'Beauty'
  | 'Sports'
  | 'Books';

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  image: string;
  images?: string[];
  description: string;
  shortDescription: string;
  features: string[];
  specifications: Record<string, string>;
  pros: string[];
  cons: string[];
  tags: string[];
  aiMatchScore: number; // 0-100
  aiHighlights: string;
  badge?: 'Best Seller' | 'Editor Choice' | 'Top Rated' | 'AI Pick' | 'Trending';
  reviews?: ProductReview[];
}

export type SortOption = 
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'ai-score-desc'
  | 'reviews-desc';

export interface FilterState {
  searchQuery: string;
  category: ProductCategory | 'All';
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  sortBy: SortOption;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedProducts?: Product[];
  comparisonProducts?: Product[];
  actionPrompt?: string;
}
