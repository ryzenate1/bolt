"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Eye, ChevronLeft, ChevronRight, TrendingUp, ThumbsUp } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { getRecommendedFish } from "@/lib/recommendations";
import { formatPrice } from "@/lib/formatPrice";
import { motion, AnimatePresence } from "framer-motion";

interface TopPicksProps {
  title?: string;
}

// Custom hook for media query
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      setMatches(media.matches);
      
      const listener = () => setMatches(media.matches);
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
    return undefined;
  }, [query]);
  
  return matches;
};

const TopPicks = ({ title = "Our Top Picks" }: TopPicksProps) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState<{[key: string]: boolean}>({});
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    budget: 3,
    tastePreference: 3,
    cookingMethod: 'all',
    healthFocus: 3
  });
  
  // For mobile slider
  const sliderRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Scroll functions for mobile slider
  const scrollLeft = () => {
    if (sliderRef.current) {
      const newPosition = Math.max(0, scrollPosition - 200);
      sliderRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };
  
  const scrollRight = () => {
    if (sliderRef.current) {
      const maxScroll = sliderRef.current.scrollWidth - sliderRef.current.clientWidth;
      const newPosition = Math.min(maxScroll, scrollPosition + 200);
      sliderRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const recommended = getRecommendedFish(preferences);
      setRecommendations(recommended);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [preferences]);
  
  // Track scroll position for slider controls
  useEffect(() => {
    const handleScroll = () => {
      if (sliderRef.current) {
        setScrollPosition(sliderRef.current.scrollLeft);
      }
    };
    
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', handleScroll);
      return () => slider.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  // Handle adding to cart with loading state
  const handleAddToCart = (fish: any) => {
    setIsAdding(prev => ({ ...prev, [fish.id]: true }));
    
    // Simulate network delay for better UX feedback
    setTimeout(() => {
      addToCart(fish, 1);
      toast.success(`${fish.name} added to cart`, { 
        duration: 3000,
        description: "Great choice! This item is now in your cart.",
        action: {
          label: "View Cart",
          onClick: () => window.location.href = "/cart"
        }
      });
      setIsAdding(prev => ({ ...prev, [fish.id]: false }));
    }, 600);
  };

  // Handle adding to wishlist
  const handleAddToWishlist = (fish: any) => {
    toast.success(`${fish.name} added to wishlist`, {
      duration: 3000,
      description: "You can view your saved items in your wishlist."
    });
  };

  if (loading) {
    return (
      <div className="my-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
        {isMobile ? (
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-40 bg-gray-100 rounded-lg animate-pulse aspect-[3/4]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg animate-pulse aspect-[3/4]"></div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="my-6" data-component-name="TopPicks">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <div className="flex items-center mt-2 md:mt-0">
          {isMobile && (
            <div className="flex mr-4 space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 w-8 p-0 rounded-full"
                onClick={scrollLeft}
                disabled={scrollPosition <= 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 w-8 p-0 rounded-full"
                onClick={scrollRight}
                disabled={sliderRef.current ? scrollPosition >= sliderRef.current.scrollWidth - sliderRef.current.clientWidth - 10 : false}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          <select 
            className="text-sm border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-tendercuts-blue/50"
            value={preferences.cookingMethod}
            onChange={(e) => setPreferences({...preferences, cookingMethod: e.target.value})}
          >
            <option value="all">All Cooking Methods</option>
            <option value="fry">Fry</option>
            <option value="grill">Grill</option>
            <option value="curry">Curry</option>
            <option value="steam">Steam</option>
            <option value="bake">Bake</option>
          </select>
        </div>
      </div>

      {isMobile ? (
        <div 
          ref={sliderRef}
          className="flex overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {recommendations.map((fish) => (
            <div 
              key={fish.id} 
              className="flex-shrink-0 w-40 snap-start mr-4 group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-square">
                <Link href={`/fish/${fish.slug}`} className="block w-full h-full">
                  <img
                    src={fish.image}
                    alt={fish.name}
                    className="object-cover group-hover:scale-105 transition-transform duration-500 w-full h-full"
                    loading="lazy"
                  />
                </Link>
                
                {fish.popular && (
                  <div className="absolute top-2 right-2 bg-tendercuts-blue text-white text-xs font-bold px-2 py-1 rounded-full">
                    Popular
                  </div>
                )}
              </div>
              
              <div className="p-3 flex-grow flex flex-col justify-between">
                <div className="p-4 flex-grow flex flex-col">
                  <Link href={`/fish/${fish.slug}`} className="block mb-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-tendercuts-red transition-colors line-clamp-2 min-h-[2.5rem]">{fish.name}</h3>
                  </Link>
                  
                  <div className="text-sm text-gray-500 mb-2">{fish.weight}</div>
                  
                  <div className="mt-auto pt-2 flex items-center justify-between border-t border-gray-100">
                    <div className="flex flex-col">
                      <span className="font-bold text-tendercuts-red">{formatPrice(fish.price, 'en-IN')}</span>
                      {fish.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">{formatPrice(fish.originalPrice, 'en-IN')}</span>
                      )}
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="bg-tendercuts-red hover:bg-tendercuts-red-dark text-white shadow-sm"
                      onClick={() => handleAddToCart(fish)}
                      disabled={isAdding[fish.id]}
                    >
                      {isAdding[fish.id] ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      ) : (
                        <ShoppingCart className="h-4 w-4 mr-1" />
                      )}
                      {isAdding[fish.id] ? '' : 'Add'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {recommendations.map((fish, index) => (
            <div 
              key={fish.id} 
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative overflow-hidden">
                <div className="relative aspect-square">
                  <Link href={`/fish/${fish.slug}`}>
                    <img
                      src={fish.image}
                      alt={fish.name}
                      className="object-cover group-hover:scale-105 transition-transform duration-500 img-zoom"
                      style={{ position: 'absolute', height: '100%', width: '100%', inset: 0 }}
                    />
                  </Link>
                  
                  {fish.popular && (
                    <div className="group-hover:opacity-100 absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full transition-all duration-300 opacity-90 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>Popular</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="rounded-full w-10 h-10 bg-white/90 hover:bg-white/80 icon-scale shadow-sm"
                      onClick={() => handleAddToWishlist(fish)}
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Link 
                      href={`/fish/${fish.slug}`}
                      className="rounded-full w-10 h-10 bg-white/90 hover:bg-white/80 flex items-center justify-center transition-transform hover:scale-105 shadow-sm"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              
                <div className="p-4 flex-grow flex flex-col">
                  <Link href={`/fish/${fish.slug}`} className="block mb-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-tendercuts-red transition-colors line-clamp-2 min-h-[2.5rem]">{fish.name}</h3>
                  </Link>
                  
                  <div className="text-sm text-gray-500 mb-2">{fish.weight}</div>
                  
                  <div className="mt-auto pt-2 flex items-center justify-between border-t border-gray-100">
                    <div className="flex flex-col">
                      <span className="font-bold text-tendercuts-red">{formatPrice(fish.price, 'en-IN')}</span>
                      {fish.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">{formatPrice(fish.originalPrice, 'en-IN')}</span>
                      )}
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="bg-tendercuts-red hover:bg-tendercuts-red-dark text-white shadow-sm"
                      onClick={() => handleAddToCart(fish)}
                      disabled={isAdding[fish.id]}
                    >
                      {isAdding[fish.id] ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      ) : (
                        <ShoppingCart className="h-4 w-4 mr-1" />
                      )}
                      {isAdding[fish.id] ? '' : 'Add'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopPicks;
