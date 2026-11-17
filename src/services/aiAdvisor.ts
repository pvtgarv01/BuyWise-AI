import { Product } from '../types/product';
import { SAMPLE_PRODUCTS } from '../data/products';

export interface AIAdvisorResponse {
  message: string;
  suggestedProducts?: Product[];
  comparisonProducts?: Product[];
  actionPrompt?: string;
}

export function processAdvisorQuery(query: string, currentContextProduct?: Product): AIAdvisorResponse {
  const normalized = query.toLowerCase().trim();

  // If user is asking specifically about a product they are viewing
  if (currentContextProduct && (normalized.includes('this') || normalized.includes('worth it') || normalized.includes('should i buy') || normalized.includes('spec') || normalized.includes('detail'))) {
    return {
      message: `Here is my assessment of the **${currentContextProduct.name}**:\n\n` +
        `• **Match Score:** ${currentContextProduct.aiMatchScore}% based on high customer satisfaction (${currentContextProduct.rating}/5 from ${currentContextProduct.reviewCount.toLocaleString()} reviews).\n` +
        `• **Key Strengths:** ${currentContextProduct.pros.join(', ')}.\n` +
        `• **Trade-offs:** ${currentContextProduct.cons.join(', ')}.\n` +
        `• **Verdict:** ${currentContextProduct.aiHighlights}\n\n` +
        `Listed at $${currentContextProduct.price}${currentContextProduct.originalPrice ? ` (discounted from $${currentContextProduct.originalPrice})` : ''} in our ${currentContextProduct.category} collection.`,
      suggestedProducts: [currentContextProduct],
      actionPrompt: 'Would you like to compare it with alternative items in this category?'
    };
  }

  // 1. Budget extraction
  let maxBudget: number | null = null;
  const budgetMatch = normalized.match(/(?:under|less than|below|budget of|max(?:imum)?)\s*\$?(\d+)/i);
  if (budgetMatch && budgetMatch[1]) {
    maxBudget = parseInt(budgetMatch[1], 10);
  }

  // 2. Category matching
  let matchedCategory: string | null = null;
  if (normalized.includes('electronic') || normalized.includes('tech') || normalized.includes('gadget') || normalized.includes('headphone') || normalized.includes('monitor') || normalized.includes('keyboard')) {
    matchedCategory = 'Electronics';
  } else if (normalized.includes('fashion') || normalized.includes('cloth') || normalized.includes('jacket') || normalized.includes('sweater') || normalized.includes('sunglasses') || normalized.includes('wear')) {
    matchedCategory = 'Fashion';
  } else if (normalized.includes('kitchen') || normalized.includes('home') || normalized.includes('coffee') || normalized.includes('espresso') || normalized.includes('air fryer') || normalized.includes('vacuum') || normalized.includes('cook')) {
    matchedCategory = 'Home & Kitchen';
  } else if (normalized.includes('beauty') || normalized.includes('skincare') || normalized.includes('serum') || normalized.includes('hair') || normalized.includes('face') || normalized.includes('cream')) {
    matchedCategory = 'Beauty';
  } else if (normalized.includes('sport') || normalized.includes('running') || normalized.includes('shoe') || normalized.includes('fitness') || normalized.includes('dumbbell') || normalized.includes('workout') || normalized.includes('yoga')) {
    matchedCategory = 'Sports';
  } else if (normalized.includes('book') || normalized.includes('read') || normalized.includes('habit') || normalized.includes('system') || normalized.includes('psychology') || normalized.includes('learn')) {
    matchedCategory = 'Books';
  }

  // 3. Comparison query detection
  if (normalized.includes('compare') || normalized.includes('versus') || normalized.includes(' vs ') || normalized.includes('difference between')) {
    let itemsToCompare: Product[] = [];
    SAMPLE_PRODUCTS.forEach((p) => {
      const pKeywords = [p.name.toLowerCase(), p.brand.toLowerCase(), ...p.tags];
      if (pKeywords.some((k) => normalized.includes(k.toLowerCase()))) {
        if (!itemsToCompare.some(item => item.id === p.id)) {
          itemsToCompare.push(p);
        }
      }
    });

    if (itemsToCompare.length < 2 && matchedCategory) {
      itemsToCompare = SAMPLE_PRODUCTS.filter((p) => p.category === matchedCategory).slice(0, 2);
    } else if (itemsToCompare.length < 2) {
      itemsToCompare = SAMPLE_PRODUCTS.slice(0, 2);
    }

    const p1 = itemsToCompare[0];
    const p2 = itemsToCompare[1];

    return {
      message: `Here is a side-by-side comparison between **${p1.name}** ($${p1.price}) and **${p2.name}** ($${p2.price}):\n\n` +
        `• **${p1.name}**: Rated ${p1.rating}/5. Strengths include ${p1.pros.slice(0, 2).join(' and ')}.\n` +
        `• **${p2.name}**: Rated ${p2.rating}/5. Strengths include ${p2.pros.slice(0, 2).join(' and ')}.\n\n` +
        `**BuyWise Recommendation:** Choose the **${p1.aiMatchScore >= p2.aiMatchScore ? p1.name : p2.name}** if you prioritize overall match score (${Math.max(p1.aiMatchScore, p2.aiMatchScore)}%), or choose **${p1.price <= p2.price ? p1.name : p2.name}** for greater cost efficiency.`,
      comparisonProducts: [p1, p2],
      actionPrompt: 'You can open the full Comparison Matrix to view all detailed specifications side-by-side.'
    };
  }

  // 4. Keyword scoring search
  const scoredProducts = SAMPLE_PRODUCTS.map((prod) => {
    let score = 0;
    const prodText = `${prod.name} ${prod.brand} ${prod.category} ${prod.description} ${prod.shortDescription} ${prod.tags.join(' ')}`.toLowerCase();

    // Word matching
    const queryTokens = normalized.split(/\s+/).filter((t) => t.length > 2);
    queryTokens.forEach((token) => {
      if (prodText.includes(token)) score += 15;
      if (prod.name.toLowerCase().includes(token)) score += 25;
      if (prod.brand.toLowerCase().includes(token)) score += 20;
      if (prod.tags.some((tag) => tag.toLowerCase().includes(token))) score += 20;
    });

    if (matchedCategory && prod.category === matchedCategory) {
      score += 30;
    }

    if (maxBudget !== null) {
      if (prod.price <= maxBudget) {
        score += 25;
      } else {
        score -= 50; // penalize exceeding budget
      }
    }

    if (normalized.includes('best') || normalized.includes('top') || normalized.includes('highest rated')) {
      score += prod.rating * 10;
    }

    return { product: prod, score };
  });

  const matchingResults = scoredProducts
    .filter((sp) => sp.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((sp) => sp.product);

  if (matchingResults.length > 0) {
    const topPicks = matchingResults.slice(0, 3);
    const primary = topPicks[0];

    let budgetComment = '';
    if (maxBudget) {
      budgetComment = ` within your target budget of $${maxBudget}`;
    }

    return {
      message: `I analyzed the BuyWise catalog and identified ${topPicks.length} top options${budgetComment}:\n\n` +
        `**Top Recommendation: ${primary.name}**\n` +
        `• **Price:** $${primary.price} ${primary.originalPrice ? `~~$${primary.originalPrice}~~` : ''}\n` +
        `• **Customer Rating:** ${primary.rating}/5 ★ (${primary.reviewCount.toLocaleString()} reviews)\n` +
        `• **Why it's selected:** ${primary.aiHighlights}\n\n` +
        `Check out the product card below to inspect full specifications, add it to your wishlist, or compare.`,
      suggestedProducts: topPicks,
      actionPrompt: 'Ask me to compare these or refine your budget or specific feature requirements.'
    };
  }

  // Default helpful overview if query is broad or general greeting
  if (normalized.includes('hi') || normalized.includes('hello') || normalized.includes('hey') || normalized.length < 5) {
    return {
      message: `Hello! I am your **BuyWise AI Shopping Advisor**.\n\n` +
        `I can help you:\n` +
        `• Find products matched to your precise budget (e.g. *"Show me headphones under $300"*)\n` +
        `• Explore top recommendations across **Electronics, Fashion, Home & Kitchen, Beauty, Sports, and Books**\n` +
        `• Compare items side-by-side with objective spec analysis\n` +
        `• Detail pros, cons, and customer sentiments for any item\n\n` +
        `What category or product are you shopping for today?`,
      suggestedProducts: [SAMPLE_PRODUCTS[0], SAMPLE_PRODUCTS[4], SAMPLE_PRODUCTS[10]],
      actionPrompt: 'Try clicking one of the suggested shopping prompt chips below.'
    };
  }

  // Fallback with top-rated items across catalog
  const topOverall = [...SAMPLE_PRODUCTS].sort((a, b) => b.aiMatchScore - a.aiMatchScore).slice(0, 3);
  return {
    message: `I couldn't find an exact match for "${query}" in our current sample catalog, but here are our top-rated recommendations across popular categories that offer the highest customer satisfaction and value:`,
    suggestedProducts: topOverall,
    actionPrompt: 'You can search for categories like Electronics, Coffee Makers, Skincare, Running Shoes, or Books.'
  };
}
