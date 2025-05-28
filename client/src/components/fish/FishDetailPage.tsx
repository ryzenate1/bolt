'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft, Heart, Share2, Star, Minus, Plus, ShoppingCart, Clock, Zap, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useAnimatedInView, fadeInUp, fadeIn, slideInLeft, slideInRight } from '@/hooks/useAnimatedInView';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import { AnimatedElement, AnimatedHeading, AnimatedCard } from '@/components/ui/animated-element';

// Define the Fish interface
export interface Fish {
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
  description?: string;
  isPopular?: boolean;
  serves?: string;
  netWeight?: string;
  grossWeight?: string;
  originalPrice?: number;
}

interface FishDetailPageProps {
  fish: Fish;
  backLink?: string;
  backLinkText?: string;
}

const FishDetailPage: React.FC<FishDetailPageProps> = ({ 
  fish, 
  backLink = "/category/fish-combo", 
  backLinkText = "Back to Fish Combos" 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();

  const increment = () => setQuantity(prev => Math.min(prev + 1, 10));
  const decrement = () => setQuantity(prev => Math.max(prev - 1, 1));

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    // Simulate a small delay for better UX
    setTimeout(() => {
      addToCart(fish, quantity);
      toast.success(`${fish.name} added to cart`);
      setIsAddingToCart(false);
    }, 600);
  };

  // Helper to render star rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <>
        {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
        {halfStar && <Star key="half" className="w-5 h-5 text-yellow-400 fill-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />)}
      </>
    );
  };

  return (
    <ResponsiveContainer maxWidth="2xl" className="py-8" as="main" data-component-name="FishDetailPage">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link href={backLink} className="inline-flex items-center text-tendercuts-blue mb-6 group">
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          {backLinkText}
        </Link>
      </motion.div>

      <AnimatedCard 
        className="overflow-hidden" 
        animation={fadeIn}
      >
        <div className="md:flex">
          {/* Image Section */}
          <AnimatedElement 
            className="md:w-1/2 p-6" 
            animation={slideInLeft}
          >
            <div className="relative h-80 sm:h-96 rounded-lg overflow-hidden shadow-md">
              <Image
                alt={fish.name}
                src={fish.src}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
              {fish.isPopular && (
                <motion.div 
                  className="absolute top-4 right-4 bg-tendercuts-blue text-white text-xs font-bold px-3 py-1.5 rounded-full shadow"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  Popular
                </motion.div>
              )}
            </div>
            <div className="mt-4 flex space-x-3">
              <Button variant="outline" size="icon" className="rounded-full hover:bg-gray-100 transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-gray-100 transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          </AnimatedElement>

          {/* Details Section */}
          <AnimatedElement 
            className="md:w-1/2 p-6 md:border-l border-gray-100" 
            animation={slideInRight}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0">
              <div>
                <AnimatedHeading 
                  className="text-2xl md:text-3xl font-bold text-gray-900"
                  delay={0.1}
                >
                  {fish.name}
                </AnimatedHeading>
                <p className="text-gray-500 mt-1">{fish.type}</p>
              </div>
              <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-full self-start">
                <span className="font-medium text-gray-800 mr-1">{fish.rating}</span>
                <div className="flex">
                  {renderStars(fish.rating)}
                </div>
              </div>
            </div>

            <AnimatedElement className="mt-6" delay={0.2}>
              <div className="text-3xl font-bold text-tendercuts-red">₹{fish.price}</div>
              {fish.originalPrice && (
                <div className="mt-1 flex items-center">
                  <span className="text-gray-500 line-through mr-2">₹{fish.originalPrice}</span>
                  <span className="text-green-600 text-sm font-medium">
                    {Math.round(((fish.originalPrice - fish.price) / fish.originalPrice) * 100)}% off
                  </span>
                </div>
              )}
            </AnimatedElement>

            <AnimatedElement className="mt-6 space-y-4" delay={0.3}>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-tendercuts-blue" />
                <span>Delivery in 90 minutes</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Zap className="w-4 h-4 mr-2 text-tendercuts-blue" />
                <span>Freshly cut and cleaned</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ShieldCheck className="w-4 h-4 mr-2 text-tendercuts-blue" />
                <span>Hygienically handled</span>
              </div>
            </AnimatedElement>

            {/* Nutrition Info */}
            <AnimatedElement 
              className="mt-6 grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg" 
              delay={0.4}
            >
              <div className="text-center">
                <div className="text-lg font-semibold text-tendercuts-blue">{fish.protein}g</div>
                <div className="text-xs text-gray-500">Protein</div>
              </div>
              <div className="text-center border-x border-gray-200">
                <div className="text-lg font-semibold text-tendercuts-blue">{fish.omega3}g</div>
                <div className="text-xs text-gray-500">Omega-3</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-tendercuts-blue">{fish.calories}</div>
                <div className="text-xs text-gray-500">Calories</div>
              </div>
            </AnimatedElement>

            {/* Weight Info */}
            {(fish.netWeight || fish.grossWeight || fish.serves) && (
              <AnimatedElement className="mt-6 flex flex-wrap gap-4" delay={0.5}>
                {fish.netWeight && (
                  <div className="bg-gray-100 px-3 py-1.5 rounded-full text-sm">
                    <span className="font-medium">Net:</span> {fish.netWeight}
                  </div>
                )}
                {fish.grossWeight && (
                  <div className="bg-gray-100 px-3 py-1.5 rounded-full text-sm">
                    <span className="font-medium">Gross:</span> {fish.grossWeight}
                  </div>
                )}
                {fish.serves && (
                  <div className="bg-gray-100 px-3 py-1.5 rounded-full text-sm">
                    <span className="font-medium">Serves:</span> {fish.serves}
                  </div>
                )}
              </AnimatedElement>
            )}

            {/* Add to Cart Section */}
            <AnimatedElement className="mt-8" delay={0.6}>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:items-center">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={decrement}
                    className="px-3 py-2 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-600 transition-colors"
                    aria-label="Decrease quantity"
                    disabled={isAddingToCart}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 w-12 text-center font-medium text-gray-900 border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={increment}
                    className="px-3 py-2 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-600 transition-colors"
                    aria-label="Increase quantity"
                    disabled={isAddingToCart}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className="sm:ml-4 flex-1 bg-tendercuts-red hover:bg-tendercuts-red/90 text-white py-2 px-4"
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>
            </AnimatedElement>
            <div className="text-xs text-gray-500 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-green-500" />
              Typically delivered in 60-90 minutes
            </div>
          </AnimatedElement>
        </div>

        {/* Description Section */}
        {fish.description && (
          <AnimatedElement 
            className="p-6 border-t border-gray-100"
            delay={0.2}
          >
            <AnimatedHeading 
              className="text-xl font-semibold text-gray-900 mb-4"
              level={2}
            >
              Description
            </AnimatedHeading>
            <p className="text-gray-600 leading-relaxed">{fish.description}</p>
          </AnimatedElement>
        )}

        {/* Benefits Section */}
        {fish.benefits && fish.benefits.length > 0 && (
          <AnimatedElement 
            className="p-6 border-t border-gray-100"
            delay={0.3}
          >
            <AnimatedHeading 
              className="text-xl font-semibold text-gray-900 mb-4"
              level={2}
            >
              Health Benefits
            </AnimatedHeading>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              {fish.benefits.map((benefit, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (index * 0.1) }}
                >
                  {benefit}
                </motion.li>
              ))}
            </ul>
          </AnimatedElement>
        )}

        {/* Best For Section */}
        {fish.bestFor && fish.bestFor.length > 0 && (
          <AnimatedElement 
            className="p-6 border-t border-gray-100"
            delay={0.4}
          >
            <AnimatedHeading 
              className="text-xl font-semibold text-gray-900 mb-4"
              level={2}
            >
              Best For
            </AnimatedHeading>
            <div className="flex flex-wrap gap-2">
              {fish.bestFor.map((item, index) => (
                <motion.span 
                  key={index} 
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + (index * 0.1) }}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </AnimatedElement>
        )}
      </AnimatedCard>
    </ResponsiveContainer>
  );
};

export default FishDetailPage;
