"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Fish, Anchor, Shell, ShoppingCart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

// Define types for the intersection observer options
interface IntersectionObserverOptions {
  threshold?: number;
  triggerOnce?: boolean;
  root?: Element | null;
  rootMargin?: string;
}

// Define category and featured fish types
interface Category {
  id: string | number;
  name: string;
  image: string;
  slug: string;
  type: string;
  icon?: string;
  iconName?: string;
  isActive: boolean;
  description?: string;
  order?: number;
}

interface FeaturedFish {
  id: string | number;
  name: string;
  image: string;
  slug: string;
  type: string;
  description: string;
  featured: boolean;
  price: number;
  weight: string;
  discount: number;
  iconName?: string;
  icon?: React.ReactNode;
  isActive: boolean;
}

// Custom intersection observer hook for animation
const useIntersectionObserver = (options: IntersectionObserverOptions = {}) => {
  const { 
    threshold = 0, 
    triggerOnce = false,
    root = null,
    rootMargin = '0px'
  } = options;
  
  const ref = useRef<Element | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        
        if (entry.isIntersecting && triggerOnce && ref.current) {
          observer.unobserve(ref.current);
        }
      },
      { root, rootMargin, threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [root, rootMargin, threshold, triggerOnce]);

  return [ref, isIntersecting] as const;
};

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

// Fallback featured fish products
const fallbackFeaturedFish: FeaturedFish[] = [
  {
    id: 101,
    name: "Premium Fish Combo",
    image: "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?q=80&w=2070&auto=format&fit=crop",
    slug: "premium",
    type: "Premium",
    description: "Curated selection of premium fish varieties",
    featured: true,
    price: 999,
    weight: "1.2kg",
    discount: 10,
    icon: <Fish className="w-4 h-4" />,
    isActive: true
  },
  {
    id: 102,
    name: "Grilling Special",
    image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=2070&auto=format&fit=crop",
    slug: "grilling",
    type: "Combo",
    description: "Perfect for seafood barbecues and grilling",
    featured: true,
    price: 899,
    weight: "800g",
    discount: 15,
    icon: <Fish className="w-4 h-4" />,
    isActive: true
  },
  {
    id: 103,
    name: "Seafood Feast",
    image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=1974&auto=format&fit=crop",
    slug: "feast",
    type: "Combo",
    description: "Premium selection of mixed seafood",
    featured: true,
    price: 1299,
    weight: "1.5kg",
    discount: 8,
    icon: <Shell className="w-4 h-4" />,
    isActive: true
  },
  {
    id: 104,
    name: "Fresh Catch Box",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=2069&auto=format&fit=crop",
    slug: "fresh-catch",
    type: "Fresh",
    description: "Today's freshest catches from local fishermen",
    featured: true,
    price: 799,
    weight: "900g",
    discount: 12,
    icon: <Anchor className="w-4 h-4" />,
    isActive: true
  }
];

// Fallback categories
const fallbackCategories: Category[] = [
  {
    id: 1,
    name: "Vangaram Fish",
    image: "https://images.unsplash.com/photo-1534766438357-2b270dbd1b40?q=80&w=1974&auto=format&fit=crop",
    slug: "vangaram-fish",
    type: "Fish",
    icon: "Fish",
    isActive: true
  },
  {
    id: 2,
    name: "Sliced Vangaram",
    image: "https://images.unsplash.com/photo-1565680018093-ebb6b9ab5460?q=80&w=2070&auto=format&fit=crop",
    slug: "sliced-vangaram",
    type: "Fish",
    icon: "Fish",
    isActive: true
  },
  {
    id: 3,
    name: "Dried Fish",
    image: "https://images.unsplash.com/photo-1592483648224-61bf8287bc4c?q=80&w=2070&auto=format&fit=crop",
    slug: "dried-fish",
    type: "Dried Fish",
    icon: "Fish",
    isActive: true
  },
  {
    id: 4,
    name: "Jumbo Prawns",
    image: "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?q=80&w=2070&auto=format&fit=crop",
    slug: "jumbo-prawns",
    type: "Prawns",
    icon: "Shell",
    isActive: true
  },
  {
    id: 5,
    name: "Sea Prawns",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=1935&auto=format&fit=crop",
    slug: "sea-prawns",
    type: "Prawns",
    icon: "Shell",
    isActive: true
  },
  {
    id: 6,
    name: "Fresh Lobster",
    image: "https://images.unsplash.com/photo-1610540881356-76bd50e523d3?q=80&w=2070&auto=format&fit=crop",
    slug: "fresh-lobster",
    type: "Shellfish",
    icon: "Shell",
    isActive: true
  }
];

const Categories = () => {
  const router = useRouter();
  const { addToCart } = useCart();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [categoriesRef, isCategoriesVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });
  
  // Categories display settings
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredFish, setFeaturedFish] = useState<FeaturedFish[]>([]);
  const [visibleCategories, setVisibleCategories] = useState<number>(6); // Show fewer initially
  const [showAll, setShowAll] = useState<boolean>(false);
  
  // Scroll positions for mobile
  const categoriesSliderRef = useRef<HTMLDivElement>(null);
  const featuredSliderRef = useRef<HTMLDivElement>(null);
  
  // Helper function to get image URL with fallback
  const getImageUrl = (item: Category | FeaturedFish | null): string => {
    if (!item) return "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?q=80&w=2070&auto=format&fit=crop";
    
    // If image is available, use it
    if (item.image) {
      // Check if image is a full URL or just a path
      if (item.image.startsWith('http')) {
        return item.image;
      } else {
        // For local images, ensure they have the correct path
        return item.image.startsWith('/') ? item.image : `/${item.image}`;
      }
    }
    
    // Fallback to a default image based on type
    if (item.type?.toLowerCase().includes('fish')) {
      return "https://images.unsplash.com/photo-1534766438357-2b270dbd1b40?q=80&w=1974&auto=format&fit=crop";
    } else if (item.type?.toLowerCase().includes('prawn')) {
      return "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?q=80&w=2070&auto=format&fit=crop";
    } else if (item.type?.toLowerCase().includes('crab')) {
      return "https://images.unsplash.com/photo-1559187575-5f89cedf009b?q=80&w=2071&auto=format&fit=crop";
    } else {
      return "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?q=80&w=2070&auto=format&fit=crop";
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        console.log("Fetching categories from API...");
        const res = await fetch('/api/categories');
        
        if (!res.ok) {
          console.warn(`API returned status: ${res.status}`);
          throw new Error(`Failed to fetch categories (Status: ${res.status})`);
        }
        
        const data = await res.json();
        console.log("Categories received:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          const activeCategories = data.filter(cat => cat.isActive !== false) as Category[];
          setCategories(activeCategories);
          console.log("Active categories set:", activeCategories.length);
        } else {
          console.warn("Empty or invalid data received from API, using fallback");
          setCategories(fallbackCategories);
        }
      } catch (err) {
        console.error("Error loading categories:", err);
        setError('Could not load categories from API, using fallback data');
        setCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        console.log("Fetching featured fish from API...");
        const res = await fetch('/api/featured-fish');
        
        if (!res.ok) {
          console.warn(`API returned status: ${res.status}`);
          throw new Error(`Failed to fetch featured fish (Status: ${res.status})`);
        }
        
        const data = await res.json();
        console.log("Featured fish received:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          const activeFeaturedFish = data.filter(fish => fish.isActive !== false) as FeaturedFish[];
          setFeaturedFish(activeFeaturedFish);
        } else {
          console.warn("Empty or invalid featured fish data, using fallback");
          setFeaturedFish(fallbackFeaturedFish);
        }
      } catch (err) {
        console.error("Error loading featured fish:", err);
        setFeaturedFish(fallbackFeaturedFish);
      }
    };
    
    fetchFeaturedProducts();
  }, []);

  const toggleShowAll = () => {
    setShowAll(!showAll);
    if (!showAll) {
      setVisibleCategories(categories.length);
    } else {
      setVisibleCategories(6);
    }
  };

  const getIconComponent = (iconName: string | undefined) => {
    if (!iconName) return <Fish className="w-4 h-4" />;
    
    switch (iconName.toLowerCase()) {
      case 'fish':
        return <Fish className="w-4 h-4" />;
      case 'anchor':
        return <Anchor className="w-4 h-4" />;
      case 'shell':
        return <Shell className="w-4 h-4" />;
      default:
        if (iconName.toLowerCase().includes('crab') || iconName.toLowerCase().includes('prawn')) {
          return <Shell className="w-4 h-4" />;
        }
        return <Fish className="w-4 h-4" />;
    }
  };

  // Scroll functions for mobile
  const scrollLeft = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref && ref.current) {
      ref.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref && ref.current) {
      ref.current.scrollBy({ left: 240, behavior: 'smooth' });
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

  // Display featured fish first, then categories
  return (
    <section className="space-y-4 mt-3 mb-4" ref={categoriesRef as React.RefObject<HTMLElement>}>
      {error && (
        <div className="flex items-center gap-2 bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-3 rounded">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
          <p className="text-sm text-yellow-700">{error}</p>
        </div>
      )}
      
      {/* Featured Fish Collection */}
      <motion.div
        initial="hidden"
        animate={isCategoriesVisible ? "visible" : "hidden"}
        variants={fadeInUp}
        className="mb-4"
      >
        <div className="flex flex-col space-y-1 mb-3">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Featured Fish Collection</h2>
          <p className="text-sm text-gray-600">Premium seafood curated by our fishery experts</p>
        </div>
        
        {/* Mobile Navigation Controls for Featured Fish */}
        {isMobile && featuredFish.length > 2 && (
          <div className="flex justify-between items-center mb-3">
            <button 
              onClick={() => scrollLeft(featuredSliderRef)}
              className="p-2 rounded-full bg-white shadow-md text-blue-600 hover:bg-blue-50"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-500">Swipe to explore</span>
            <button 
              onClick={() => scrollRight(featuredSliderRef)}
              className="p-2 rounded-full bg-white shadow-md text-blue-600 hover:bg-blue-50"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {/* Featured Fish Mobile Slider */}
        {isMobile ? (
          <div 
            ref={featuredSliderRef}
            className="flex overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredFish.slice(0, 4).map((fish) => (
              <motion.div 
                key={fish.id} 
                className="flex-shrink-0 w-[280px] mr-4 snap-start"
                variants={fadeInUp}
              >
                <Link href={`/fish/${fish.slug || fish.id}`} className="block">
                  <div className="overflow-hidden rounded-xl shadow-md h-full bg-white hover:shadow-lg transition-all duration-300">
                    <div className="relative h-44">
                      <Image 
                        src={getImageUrl(fish)}
                        alt={fish.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                      {fish.discount > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                          {fish.discount}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{fish.name}</h3>
                        <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                          {getIconComponent(fish.iconName || fish.type)}
                          <span>{fish.type}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-xs line-clamp-2 mb-2">
                        {fish.description || `Fresh ${fish.name} with premium quality`}
                      </p>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-baseline gap-1">
                          <span className="font-bold text-blue-600">₹{fish.price}</span>
                          {fish.discount > 0 && (
                            <span className="text-xs text-gray-500 line-through">
                              ₹{Math.round(fish.price / (1 - fish.discount/100))}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{fish.weight}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {featuredFish.slice(0, 4).map((fish) => (
              <motion.div 
                key={fish.id} 
                variants={fadeInUp}
                className="group"
              >
                <Link href={`/fish/${fish.slug || fish.id}`} className="block">
                  <div className="overflow-hidden rounded-xl shadow-md h-full bg-white hover:shadow-lg transition-all duration-300">
                    <div className="relative h-48 md:h-52">
                      <Image 
                        src={getImageUrl(fish)}
                        alt={fish.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                      {fish.discount > 0 && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                          {fish.discount}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{fish.name}</h3>
                        <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                          {getIconComponent(fish.iconName || fish.type)}
                          <span>{fish.type}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {fish.description || `Fresh ${fish.name} with premium quality`}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-baseline gap-1">
                          <span className="font-bold text-blue-600">₹{fish.price}</span>
                          {fish.discount > 0 && (
                            <span className="text-xs text-gray-500 line-through">
                              ₹{Math.round(fish.price / (1 - fish.discount/100))}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{fish.weight}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
      
      {/* Shop by Category */}
      <motion.div
        initial="hidden"
        animate={isCategoriesVisible ? "visible" : "hidden"}
        variants={fadeInUp}
        className="mt-2"
      >
        <div className="flex flex-col space-y-2 mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
          <p className="text-gray-600">Explore our wide range of seafood categories</p>
        </div>
        
        {/* Mobile Navigation Controls for Categories */}
        {isMobile && categories.length > 2 && (
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={() => scrollLeft(categoriesSliderRef)}
              className="p-2 rounded-full bg-white shadow-md text-blue-600 hover:bg-blue-50"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-500">Swipe to explore</span>
            <button 
              onClick={() => scrollRight(categoriesSliderRef)}
              className="p-2 rounded-full bg-white shadow-md text-blue-600 hover:bg-blue-50"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {loading ? (
          // Skeleton loading UI for categories
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl h-40 md:h-48"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Categories Mobile Slider */}
            {isMobile ? (
              <div 
                ref={categoriesSliderRef}
                className="flex overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {categories.slice(0, visibleCategories).map((category) => (
                  <motion.div 
                    key={category.id} 
                    className="flex-shrink-0 w-[160px] mr-4 snap-start"
                    variants={fadeInUp}
                  >
                    <Link href={`/category/${category.slug || category.id}`} className="block">
                      <div className="overflow-hidden rounded-xl shadow-md bg-white">
                        <div className="relative h-28">
                          <Image 
                            src={getImageUrl(category)}
                            alt={category.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="transition-transform hover:scale-105 duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                        <div className="p-3">
                          <div className="flex items-center gap-1.5">
                            {getIconComponent(category.iconName || category.type)}
                            <h3 className="font-medium text-gray-900 text-sm line-clamp-1">{category.name}</h3>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                variants={staggerContainer}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              >
                {categories.slice(0, visibleCategories).map((category) => (
                  <motion.div 
                    key={category.id} 
                    variants={fadeInUp}
                    className="group"
                  >
                    <Link href={`/category/${category.slug || category.id}`} className="block">
                      <div className="relative overflow-hidden rounded-xl shadow-md bg-white hover:shadow-lg transition-all duration-300">
                        <div className="relative h-44 md:h-52">
                          <Image 
                            src={getImageUrl(category)}
                            alt={category.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-white/20 rounded-full">
                              {getIconComponent(category.iconName || category.type)}
                            </div>
                            <h3 className="font-medium text-lg">{category.name}</h3>
                          </div>
                          <div className="mt-1 text-sm text-white/80 line-clamp-1">{category.type || 'Fresh Seafood'}</div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {categories.length > 6 && (
              <div className="text-center mt-6">
                <Button 
                  onClick={toggleShowAll} 
                  variant="outline" 
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  {showAll ? "Show Less" : "Show All Categories"}
                </Button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </section>
  );
};

export default Categories;
