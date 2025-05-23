"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { getRecommendedFish } from "@/lib/recommendations";

import { formatPrice } from "@/lib/formatPrice";

interface TopPicksProps {
  title?: string;
}

const TopPicks = ({ title = "Our Top Picks" }: TopPicksProps) => {
  const { addToCart } = useCart();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    budget: 3,
    tastePreference: 3,
    cookingMethod: 'all',
    healthFocus: 3
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const recommended = getRecommendedFish(preferences);
      setRecommendations(recommended);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [preferences]);

  if (loading) {
    return (
      <div className="my-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg animate-pulse aspect-[3/4]"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="my-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Our Top Picks</h2>
        <div className="mt-2 md:mt-0">
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
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {recommendations.map((fish) => {
          const price = 200 + (fish.price * 50);
          const formattedPrice = formatPrice(price);
          
          return (
            <div key={fish.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col">
              <div className="relative aspect-square">
                <Link href={`/fish/${fish.slug}`}>
                  <Image
                    src={fish.image}
                    alt={fish.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33.33vw, 25vw"
                  />
                </Link>
                {fish.name.toLowerCase().includes('vangaram') && (
                  <div className="absolute top-2 right-2 bg-tendercuts-blue text-white text-xs font-bold px-2 py-1 rounded-full">
                    Popular
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="rounded-full w-10 h-10 bg-white/90 hover:bg-white/80"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // TODO: Add to wishlist
                    }}
                  >
                    <Heart className="w-4 h-4 text-tendercuts-blue" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="rounded-full w-10 h-10 bg-white/90 hover:bg-white/80"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // TODO: Quick view
                    }}
                  >
                    <Eye className="w-4 h-4 text-tendercuts-blue" />
                  </Button>
                </div>
              </div>
              <div className="p-3 flex flex-col flex-grow">
                <Link href={`/fish/${fish.slug}`} className="flex-grow">
                  <h3 className="font-medium text-gray-800 group-hover:text-tendercuts-blue transition-colors line-clamp-2 mb-2">
                    {fish.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-tendercuts-red">
                      {formatPrice(fish.price)}
                    </p>
                    <span className="text-xs text-gray-500">
                      {fish.type}
                    </span>
                  </div>
                </Link>
                <div className="mt-3">
                  <Button 
                    size="sm"
                    variant="outline"
                    className="w-full h-8 text-xs flex items-center justify-center gap-1 bg-tendercuts-red hover:bg-tendercuts-red-dark text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      const cartItem = {
                        ...fish,
                        id: fish.id.toString(), // Ensure ID is a string
                        src: fish.image, // Map image to src
                        price: fish.price * 100, // Convert to paise for proper currency handling
                        benefits: [], // Add required fields
                        bestFor: fish.bestFor || [],
                        calories: 0, // Default values for required fields
                        omega3: fish.omega3 || 0,
                        protein: 0,
                        rating: 0,
                        type: fish.type || 'Fish'
                      };
                      addToCart(cartItem, 1);
                      toast.success(`${fish.name} added to cart`);
                    }}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopPicks;
