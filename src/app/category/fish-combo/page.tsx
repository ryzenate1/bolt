'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';
import { useCart } from '../../../context/CartContext';
import { ShoppingCart, Heart, Plus, Minus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Fish {
  id: string;
  name: string;
  src: string;
  type: string;
  price: number;
  omega3: number;
  protein: number;
  calories: number;
  benefits: string[];
  bestFor: string[];
  rating: number;
}


const FishCard = ({ fish }: { fish: Fish }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart: contextAddToCart } = useCart(); // Renamed to avoid conflict if a local addToCart existed

  const increment = () => setQuantity(prev => Math.min(prev + 1, 10));
  const decrement = () => setQuantity(prev => Math.max(prev - 1, 1));

  const fishSlug = fish.name.toLowerCase().replace(/\s+/g, '-');
  return (
    <Link href={`/fish/${fishSlug}`} className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="cursor-pointer">
        {/* Fish Image */}
        <div className="relative h-48 w-full">
          <Image
            src={fish.src}
            alt={fish.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Type Badge */}
          <div className="absolute top-2 right-2 bg-tendercuts-red text-white text-xs font-medium px-2 py-1 rounded">
            {fish.type}
          </div>
          {/* Favorite Button */}
          <button 
            className="absolute top-2 left-2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Add to favorites logic here
            }}
          >
            <Heart className="w-4 h-4 text-gray-700" />
          </button>
        </div>
        {/* Fish Details */}
        <div className="p-4">
          {/* Fish Name and Rating */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{fish.name}</h3>
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-sm font-medium text-gray-800">{fish.rating}</span>
            </div>
          </div>
          
          {/* Price and Nutrition Info */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-bold text-blue-600">₹{fish.price}</span>
            <div className="flex items-center space-x-2 bg-gray-50 px-2 py-1 rounded">
              <span className="text-xs font-medium text-gray-700">
                {fish.omega3}g Ω3 • {fish.protein}g protein • {fish.calories} cal
              </span>
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="mt-4">
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    decrement();
                  }}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 py-2 w-12 text-center font-medium text-gray-900 border-x border-gray-100">
                  {quantity}
                </span>
                <button 
                  className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    increment();
                  }}
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              {/* Add to Cart Button */}
              <button 
                className="flex-1 bg-tendercuts-red hover:bg-tendercuts-red/90 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.preventDefault(); // Prevent Link navigation
                  contextAddToCart(fish, quantity);
                  // You might want to add user feedback here, e.g., a toast notification
                }}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const fishData: Fish[] = [
  { 
    id: 'paal-sura',
    name: "Paal Sura", 
    src: "/images/fishes picss/Paal-sura.jpg",
    type: "Freshwater Fish",
    price: 450,
    omega3: 1.2,
    protein: 22,
    calories: 120,
    benefits: ["Rich in protein", "High in Omega-3", "Low in calories"],
    bestFor: ["Fry", "Curry", "Grill"],
    rating: 4.5
  },
  { 
    id: 'big-paarai',
    name: "Big Paarai Fish", 
    src: "/images/fishes picss/big-paarai-fish.jpg",
    type: "Saltwater Fish",
    price: 580,
    omega3: 1.8,
    protein: 24,
    calories: 130,
    benefits: ["High in protein", "Rich in vitamins", "Great for grilling"],
    bestFor: ["Grill", "Fry", "Bake"],
    rating: 4.3
  },
  {
    id: 'kalava',
    name: "Kalava",
    src: "/images/fishes picss/kalava.jpg",
    type: "Saltwater Fish",
    price: 520,
    omega3: 2.1,
    protein: 26,
    calories: 140,
    benefits: ["High in Omega-3", "Rich in minerals", "Low in mercury"],
    bestFor: ["Fry", "Curry", "Bake"],
    rating: 4.5
  },
  {
    id: 'karuva-vaval',
    name: "Karuva Vaval",
    src: "/images/fishes picss/karuva-vaval.jpg",
    type: "Saltwater Fish",
    price: 480,
    omega3: 1.5,
    protein: 23,
    calories: 125,
    benefits: ["Rich in protein", "Good for heart health", "Low in fat"],
    bestFor: ["Fry", "Curry"],
    rating: 4.2
  },
  {
    id: 'katla',
    name: "Katla",
    src: "/images/fishes picss/katla.jpg",
    type: "Freshwater Fish",
    price: 350,
    omega3: 1.1,
    protein: 20,
    calories: 115,
    benefits: ["High in protein", "Rich in vitamins", "Low in calories"],
    bestFor: ["Curry", "Fry"],
    rating: 4.0
  },
  {
    id: 'koduva',
    name: "Koduva",
    src: "/images/fishes picss/koduva.jpg",
    type: "Saltwater Fish",
    price: 580,
    omega3: 2.3,
    protein: 27,
    calories: 145,
    benefits: ["Rich in Omega-3", "High in protein", "Great for grilling"],
    bestFor: ["Grill", "Fry", "Bake"],
    rating: 4.6
  },
  {
    id: 'kola-fish',
    name: "Kola Fish",
    src: "/images/fishes picss/kola-fish.jpg",
    type: "Saltwater Fish",
    price: 420,
    omega3: 1.3,
    protein: 21,
    calories: 118,
    benefits: ["Rich in protein", "Low in fat", "High in vitamins"],
    bestFor: ["Fry", "Curry"],
    rating: 4.1
  },
  {
    id: 'mathi-fish',
    name: "Mathi Fish",
    src: "/images/fishes picss/mathi-fish.jpg",
    type: "Saltwater Fish",
    price: 320,
    omega3: 1.7,
    protein: 18,
    calories: 105,
    benefits: ["Rich in Omega-3", "High in protein", "Low in calories"],
    bestFor: ["Fry", "Curry", "Grill"],
    rating: 4.2
  },
  {
    id: 'nethili',
    name: "Nethili",
    src: "/images/fishes picss/nethili.jpg",
    type: "Saltwater Fish",
    price: 350,
    omega3: 1.6,
    protein: 20,
    calories: 118,
    benefits: ["High in calcium", "Rich in protein", "Low in fat"],
    bestFor: ["Fry", "Curry", "Roast"],
    rating: 4.3
  },
  {
    id: 'paarai-fish',
    name: "Paarai Fish",
    src: "/images/fishes picss/paarai-fish.jpg",
    type: "Saltwater Fish",
    price: 480,
    omega3: 1.4,
    protein: 22,
    calories: 125,
    benefits: ["High in protein", "Rich in Omega-3", "Low in calories"],
    bestFor: ["Fry", "Grill", "Curry"],
    rating: 4.4
  },
  {
    id: 'red-snapper',
    name: "Red Snapper",
    src: "/images/fishes picss/red-snapper.jpg",
    type: "Saltwater Fish",
    price: 620,
    omega3: 2.0,
    protein: 26,
    calories: 140,
    benefits: ["High in protein", "Rich in vitamins", "Great for grilling"],
    bestFor: ["Grill", "Bake", "Fry"],
    rating: 4.7
  },
  {
    id: 'shankara-fish',
    name: "Shankara Fish",
    src: "/images/fishes picss/shankara-fish.jpg",
    type: "Saltwater Fish",
    price: 580,
    omega3: 2.1,
    protein: 27,
    calories: 145,
    benefits: ["Rich in Omega-3", "High in protein", "Great for grilling"],
    bestFor: ["Grill", "Fry", "Bake"],
    rating: 4.6
  },
  {
    id: 'sheela-fish',
    name: "Sheela Fish",
    src: "/images/fishes picss/sheela-fish.jpg",
    type: "Saltwater Fish",
    price: 550,
    omega3: 2.0,
    protein: 26,
    calories: 140,
    benefits: ["High in protein", "Rich in Omega-3", "Great for grilling"],
    bestFor: ["Grill", "Fry", "Bake"],
    rating: 4.5
  },
  {
    id: 'small-koduva',
    name: "Small Koduva",
    src: "/images/fishes picss/small-koduva.jpg",
    type: "Saltwater Fish",
    price: 350,
    omega3: 1.8,
    protein: 24,
    calories: 130,
    benefits: ["Rich in Omega-3", "High in protein", "Great for frying"],
    bestFor: ["Fry", "Curry", "Grill"],
    rating: 4.3
  },
  {
    id: 'tuna-fish',
    name: "Tuna Fish",
    src: "/images/fishes picss/tuna-fish.jpg",
    type: "Saltwater Fish",
    price: 680,
    omega3: 2.5,
    protein: 29,
    calories: 150,
    benefits: ["Very high in protein", "Rich in Omega-3", "Great for steaks"],
    bestFor: ["Grill", "Steak", "Sushi"],
    rating: 4.8
  },
  {
    id: 'tuna-slices',
    name: "Tuna Slices",
    src: "/images/fishes picss/tuna-slices.jpg",
    type: "Saltwater Fish",
    price: 650,
    omega3: 2.4,
    protein: 28,
    calories: 145,
    benefits: ["High in protein", "Rich in Omega-3", "Perfect for sushi"],
    bestFor: ["Sushi", "Sashimi", "Grill"],
    rating: 4.7
  },
  {
    id: 'white-vaval',
    name: "White Vaval",
    src: "/images/fishes picss/white-vaval.jpg",
    type: "Saltwater Fish",
    price: 420,
    omega3: 1.3,
    protein: 21,
    calories: 118,
    benefits: ["Rich in protein", "Low in fat", "High in vitamins"],
    bestFor: ["Fry", "Curry", "Grill"],
    rating: 4.1
  },
  {
    id: 'yellow-parai',
    name: "Yellow Parai",
    src: "/images/fishes picss/yellow-parai.jpg",
    type: "Saltwater Fish",
    price: 490,
    omega3: 1.5,
    protein: 22,
    calories: 125,
    benefits: ["High in protein", "Rich in Omega-3", "Low in calories"],
    bestFor: ["Fry", "Grill", "Bake"],
    rating: 4.4
  },
];

export default function FishComboPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Kadal Thunai
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Fresh Seafood Selection</h1>
          <p className="text-gray-600">Premium quality seafood delivered fresh to your doorstep</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {fishData.map((fish) => (
            <FishCard 
              key={fish.id} 
              fish={fish} 
               
            />
          ))}
        </div>
      </main>

      {/* Notification */}
      
    </div>
  );
}
