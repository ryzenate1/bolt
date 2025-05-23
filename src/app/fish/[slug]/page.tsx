'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronLeft, Heart, Share2, Star, Minus, Plus, ShoppingCart, Clock, Zap, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming you have this
import { useCart } from '../../../context/CartContext';

// Define the Fish interface (same as in fish-combo/page.tsx)
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
  description?: string; // Optional description
  isPopular?: boolean; // Optional
  serves?: string; // e.g., "2-3 people"
  netWeight?: string; // e.g., "500g"
  grossWeight?: string; // e.g., "750g"
}

// Sample fish data (You should ideally fetch this from a CMS or database)
// For now, let's use a slightly expanded version of the fishData from fish-combo
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
    benefits: ["Rich in protein", "High in Omega-3", "Low in calories", "Good for brain development"],
    bestFor: ["Fry", "Curry", "Grill", "Steam"],
    rating: 4.5,
    description: "Paal Sura, also known as Milk Shark, is a delicacy in many coastal regions. Its tender meat and mild flavor make it versatile for various culinary preparations. It's particularly favored for its soft texture once cooked.",
    isPopular: true,
    serves: "2-3 people",
    netWeight: "Approx. 450-550g",
    grossWeight: "Approx. 600-700g"
  },
  {
    id: 'big-paarai-fish', // Slug should match this
    name: "Big Paarai Fish",
    src: "/images/fishes picss/big-paarai-fish.jpg",
    type: "Saltwater Fish",
    price: 580,
    omega3: 1.8,
    protein: 24,
    calories: 130,
    benefits: ["High in protein", "Rich in vitamins", "Great for grilling", "Supports heart health"],
    bestFor: ["Grill", "Fry", "Bake", "Curry"],
    rating: 4.3,
    description: "Big Paarai, or Malabar Trevally, is known for its firm texture and delicious taste. It's a popular choice for grilling and tandoori preparations due to its ability to hold flavors well.",
    isPopular: false,
    serves: "3-4 people",
    netWeight: "Approx. 700-800g",
    grossWeight: "Approx. 900-1000g"
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
    benefits: ["High in Omega-3", "Rich in minerals", "Low in mercury", "Boosts immunity"],
    bestFor: ["Fry", "Curry", "Bake", "Steamed"],
    rating: 4.7,
    description: "Kalava, or Grouper, is a prized fish for its flaky white meat and mild, sweet flavor. It's highly versatile and can be cooked in numerous ways, from simple fries to elaborate curries.",
    isPopular: true,
    serves: "2-3 people",
    netWeight: "Approx. 480-520g",
    grossWeight: "Approx. 650-750g"
  },
  {
    id: 'vangaram-fish', // Example from your URL
    name: "Vangaram Fish",
    src: "/images/fish/vangaram.jpg", // Assuming this path is correct
    type: "Saltwater Fish",
    price: 620,
    omega3: 2.5,
    protein: 25,
    calories: 150,
    benefits: ["Excellent source of lean protein", "Rich in Omega-3 fatty acids", "Contains Vitamin D and B12"],
    bestFor: ["Grilling", "Pan-Frying", "Curry"],
    rating: 4.8,
    description: "Vangaram, also known as King Mackerel or Seer Fish, is a popular table fish in South India. It has a firm texture and a rich, slightly oily flavor, making it ideal for steaks and curries.",
    isPopular: true,
    serves: "3-4 people",
    netWeight: "Approx. 500g (steaks)",
    grossWeight: "Approx. 700g (whole)"
  }
  // Add other fish from your fish-combo/page.tsx here, ensuring 'id' matches the slug generation
];

interface FishPageProps {
  params: {
    slug: string;
  };
}

const FishDetailPage: React.FC<FishPageProps> = ({ params }) => {
  const { slug } = params;
  const [fish, setFish] = useState<Fish | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart: contextAddToCart } = useCart();

  useEffect(() => {
    const foundFish = fishData.find(f => f.id === slug);
    setFish(foundFish || null);
    setIsLoading(false);
  }, [slug]);

  const increment = () => setQuantity(prev => Math.min(prev + 1, 10));
  const decrement = () => setQuantity(prev => Math.max(prev - 1, 1));

  const handleAddToCart = () => {
    if (!fish) return;
    contextAddToCart(fish, quantity);
    // Optionally, add user feedback here (e.g., toast notification)
    // console.log(`Added ${quantity} of ${fish.name} to cart via context.`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading fish details...</p>
      </div>
    );
  }

  if (!fish) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Fish not found</h1>
        <Link href="/" className="text-tendercuts-blue hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  // Helper to render star rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <>
        {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
        {/* Add half star logic if needed, or keep it simple */}
        {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />)}
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/category/fish-combo" className="inline-flex items-center text-tendercuts-blue mb-6 group">
        <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to Fish Combos
      </Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Image Section */}
          <div className="md:w-1/2 p-6">
            <div className="relative h-96 rounded-lg overflow-hidden shadow-md">
              <Image
                alt={fish.name}
                src={fish.src}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {fish.isPopular && (
                <div className="absolute top-4 right-4 bg-tendercuts-blue text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                  Popular
                </div>
              )}
            </div>
            <div className="mt-4 flex space-x-3">
              <Button variant="outline" size="icon" className="rounded-full hover:bg-gray-100">
                <Heart className="w-5 h-5 text-gray-600" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-gray-100">
                <Share2 className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          </div>

          {/* Details Section */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <div className="mb-3">
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-tendercuts-blue rounded-full">
                  {fish.type}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{fish.name}</h1>
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-3">
                  {renderStars(fish.rating)}
                </div>
                <span className="text-sm text-gray-600">({fish.rating.toFixed(1)} stars)</span>
              </div>
              <p className="text-3xl font-extrabold text-tendercuts-blue mb-4">₹{fish.price.toFixed(2)}</p>
              
              {fish.description && (
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">{fish.description}</p>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm mb-6 bg-gray-50 p-4 rounded-lg">
                <div><strong>Serves:</strong> {fish.serves || 'N/A'}</div>
                <div><strong>Net Wt:</strong> {fish.netWeight || 'N/A'}</div>
                <div><strong>Gross Wt:</strong> {fish.grossWeight || 'N/A'}</div>
                <div><strong>Protein:</strong> {fish.protein}g</div>
                <div><strong>Omega-3:</strong> {fish.omega3}g</div>
                <div><strong>Calories:</strong> {fish.calories} cal</div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-auto">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={decrement}
                    className="px-4 py-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-5 py-2.5 text-center font-medium text-gray-900 w-16">
                    {quantity}
                  </span>
                  <button
                    onClick={increment}
                    className="px-4 py-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1 bg-tendercuts-orange hover:bg-tendercuts-orange/90 text-white font-semibold py-3"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
              <div className="text-xs text-gray-500 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-green-500" />
                Typically delivered in 60-90 minutes
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="p-6 border-t border-gray-200">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-green-600" />
                Health Benefits
              </h3>
              <ul className="space-y-1.5 text-sm text-gray-600 list-disc list-inside">
                {fish.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-orange-500" />
                Best For
              </h3>
              <div className="flex flex-wrap gap-2">
                {fish.bestFor.map((method, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FishDetailPage;
