'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingCart, AlertTriangle } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

// Fallback data in case API fails
const fallbackProducts = [
  {
    id: 'premium-combo',
    name: "Premium Fish Combo",
    image: "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?q=80&w=2070&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?q=80&w=2070&auto=format&fit=crop",
    slug: "premium",
    type: "Premium",
    description: "Curated selection of premium fish varieties",
    featured: true,
    price: 999,
    weight: "1.2kg",
    discount: 10,
    tag: "Premium"
  },
  {
    id: 'grilling-special',
    name: "Grilling Special",
    image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=2070&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=2070&auto=format&fit=crop",
    slug: "grilling",
    type: "Combo",
    description: "Perfect for seafood barbecues and grilling",
    featured: true,
    price: 899,
    weight: "800g",
    discount: 15,
    tag: "Best Seller"
  },
  {
    id: 'seafood-feast',
    name: "Seafood Feast",
    image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=1974&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=1974&auto=format&fit=crop",
    slug: "feast",
    type: "Combo",
    description: "Premium selection of mixed seafood",
    featured: true,
    price: 1299,
    weight: "1.5kg",
    discount: 8,
    tag: "Luxury"
  },
  {
    id: 'fresh-catch',
    name: "Fresh Catch Box",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=2069&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=2069&auto=format&fit=crop",
    slug: "fresh-catch",
    type: "Fresh",
    description: "Today's freshest catches from local fishermen",
    featured: true,
    price: 799,
    weight: "900g",
    discount: 12,
    tag: "Fresh"
  }
];

const FeaturedProducts = () => {
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const [featuredRef, isFeaturedVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Helper function to get image URL with fallback
  const getImageUrl = (product: any): string => {
    if (!product) return "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?q=80&w=2070&auto=format&fit=crop";
    
    // If imageUrl is directly available, use it
    if (product.imageUrl) return product.imageUrl;
    
    // If image is available, use it
    if (product.image) {
      // Check if image is a full URL or just a path
      if (product.image.startsWith('http')) {
        return product.image;
      } else {
        // For local images, ensure they have the correct path
        return product.image.startsWith('/') ? product.image : `/${product.image}`;
      }
    }
    
    // Default fallback image
    return "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?q=80&w=2070&auto=format&fit=crop";
  };

  useEffect(() => {
    setLoading(true);
    fetch('/api/featured-fish')
      .then(res => {
        if (!res.ok) {
          console.warn(`API returned status: ${res.status}`);
          throw new Error(`Failed to fetch featured fish (Status: ${res.status})`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Featured fish data received:", data);
        // Ensure data is always an array of active products
        if (Array.isArray(data) && data.length > 0) {
          const activeProducts = data.filter(product => product.isActive !== false);
          setProducts(activeProducts);
        } else if (data && typeof data === 'object') {
          // If it's an object with products inside
          const productsArray = Array.isArray(data.products) ? data.products : [];
          const activeProducts = productsArray.filter(product => product.isActive !== false);
          setProducts(activeProducts);
          if (productsArray.length === 0) {
            console.warn('No products found in data:', data);
          }
        } else {
          // Fallback to empty array
          console.warn('Unexpected data format from API, using fallback:', data);
          setProducts(fallbackProducts);
        }
      })
      .catch(err => {
        console.error('Error fetching featured fish:', err);
        setError('Failed to load featured products. Using fallback data.');
        setProducts(fallbackProducts); // Use fallback data on error
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Handle adding item to cart
  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: getImageUrl(product),
        quantity: 1,
        weight: product.weight || '500g',
        discount: product.discount || 0
      });
      
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Could not add item to cart. Please try again.");
    }
  };

  // Scroll functions for mobile horizontal scrolling
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Show loading state
  if (loading) {
    return (
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-600">Featured Seafood</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Loading featured products...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="bg-gray-200 h-52 w-full"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If there are no products to show after API call and fallbacks
  if (products.length === 0) {
    return (
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-600">Featured Seafood</h2>
          <p className="text-gray-600 mb-4">No featured products available at the moment.</p>
          <Link href="/category/seafood">
            <Button className="bg-blue-600 hover:bg-blue-700">
              View All Seafood
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12" ref={featuredRef as React.RefObject<HTMLElement>}>
      <div className="container mx-auto px-4">
        {error && (
          <div className="flex items-center gap-2 bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <p className="text-sm text-yellow-700">{error}</p>
          </div>
        )}
        
        <motion.div 
          className="mb-8"
          initial="hidden"
          animate={isFeaturedVisible ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-blue-600">Featured Seafood</h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto text-sm md:text-base">
            Discover our premium selection of fresh seafood, sourced sustainably and delivered to your doorstep within hours of catch.
          </p>
        </motion.div>
        
        {/* Mobile Navigation Controls */}
        {isMobile && products.length > 1 && (
          <div className="flex justify-between items-center mb-4 px-2">
            <button 
              onClick={scrollLeft}
              className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors shadow-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-sm text-gray-600">Swipe to explore</div>
            <button 
              onClick={scrollRight}
              className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors shadow-sm"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {/* Mobile Horizontal Scroll */}
        {isMobile ? (
          <div 
            ref={sliderRef}
            className="flex overflow-x-auto pb-6 hide-scrollbar snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <motion.div 
                key={product.id} 
                className="flex-shrink-0 w-[280px] mr-4 snap-start"
                variants={fadeInUp}
                initial="hidden"
                animate={isFeaturedVisible ? "visible" : "hidden"}
              >
                <Link href={`/fish/${product.slug || product.id}`} className="block h-full">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                    <div className="relative h-48 w-full bg-gray-100">
                      <Image 
                        src={getImageUrl(product)} 
                        alt={product.name} 
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        sizes="(max-width: 768px) 280px, 25vw"
                        priority={products.indexOf(product) <= 2} // Preload first 2 images
                      />
                      {product.discount > 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {product.discount}% OFF
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        {product.tag || product.type || 'Featured'}
                      </div>
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                      <div className="text-xs text-gray-500 mb-1">{product.weight || '~1kg'}</div>
                      <p className="text-gray-600 text-xs mb-3 line-clamp-2 flex-grow">
                        {product.description || 'Fresh seafood sourced from the ocean'}
                      </p>
                      <div className="flex justify-between items-center mt-auto">
                        <div className="flex items-baseline gap-1">
                          <span className="font-bold text-blue-600">₹{product.price}</span>
                          {product.discount > 0 && (
                            <span className="text-xs text-gray-500 line-through">
                              ₹{Math.round(product.price / (1 - product.discount/100))}
                            </span>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-3 py-1 text-xs"
                          onClick={(e) => handleAddToCart(e, product)}
                        >
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate={isFeaturedVisible ? "visible" : "hidden"}
          >
            {products.map((product) => (
              <motion.div 
                key={product.id} 
                className="h-full"
                variants={fadeInUp}
              >
                <Link href={`/fish/${product.slug || product.id}`} className="block h-full">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="relative h-52 w-full bg-gray-100">
                      <Image 
                        src={getImageUrl(product)} 
                        alt={product.name} 
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        priority={products.indexOf(product) <= 3} // Preload first 4 images
                      />
                      {product.discount > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                          {product.discount}% OFF
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                        {product.tag || product.type || 'Featured'}
                      </div>
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                      <div className="text-xs text-gray-500 mb-1">{product.weight || '~1kg'}</div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
                        {product.description || 'Fresh seafood sourced from the ocean'}
                      </p>
                      <div className="flex justify-between items-center mt-auto">
                        <div className="flex items-baseline gap-1">
                          <span className="font-bold text-blue-600">₹{product.price}</span>
                          {product.discount > 0 && (
                            <span className="text-xs text-gray-500 line-through">
                              ₹{Math.round(product.price / (1 - product.discount/100))}
                            </span>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={(e) => handleAddToCart(e, product)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
