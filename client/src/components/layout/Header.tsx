"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, User, ShoppingCart, Menu, X, Edit2, Loader2, Heart, LogOut, Home, Package, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { fishNames, findFishByTerm, getClosestFishMatch, FishNameEntry } from "@/data/fishNames";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

interface CategoryLink {
  id: string;
  name: string;
  slug: string;
  // Add other relevant fields if needed by UI, e.g., icon
}

const Header = () => {
  const [location, setLocation] = useState("Fetching your location...");
  const [isLoading, setIsLoading] = useState(true);
  const [tempLocation, setTempLocation] = useState("");
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const { getCartItemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileNavCategories, setMobileNavCategories] = useState<CategoryLink[]>([]);
  
  // Comprehensive product data including categories and fish combos
  const sampleProducts = [
    // Fish Categories
    { id: 1, name: "Vangaram Fish", price: 899, image: "/images/fish/vangaram.jpg", category: "fish", type: "category", slug: "/category/vangaram-fish" },
    { id: 2, name: "Sliced Vangaram", price: 699, image: "/images/fish/sliced-vangaram.jpg", category: "fish", type: "category", slug: "/category/sliced-vangaram" },
    { id: 3, name: "Dried Fish", price: 299, image: "/images/fish/dried-vangaram.webp", category: "dried fish", type: "category", slug: "/category/dried-fish" },
    { id: 4, name: "Fish Combo", price: 999, image: "/images/fish/fish-combo.jpg", category: "combo", type: "category", slug: "/category/fish-combo" },
    { id: 5, name: "Premium Fish", price: 1299, image: "/images/fish/premium-fish.jpg", category: "premium", type: "category", slug: "/category/premium-fish" },
    
    // Individual Fish Products
    { id: 6, name: "Paal Sura", price: 599, image: "/images/fishes picss/Paal-sura.jpg", category: "freshwater fish", type: "product", slug: "/fish/paal-sura" },
    { id: 7, name: "Tiger Prawns", price: 699, image: "/images/products/prawns.jpg", category: "seafood", type: "product", slug: "/fish/tiger-prawns" },
    { id: 8, name: "Rohu Fish", price: 299, image: "/images/products/rohu.jpg", category: "fish", type: "product", slug: "/fish/rohu" },
    { id: 9, name: "Tuna Steak", price: 599, image: "/images/products/tuna.jpg", category: "fish", type: "product", slug: "/fish/tuna-steak" },
    { id: 10, name: "Crab", price: 499, image: "/images/products/crab.jpg", category: "seafood", type: "product", slug: "/fish/crab" },
    { id: 11, name: "Pomfret", price: 399, image: "/images/products/pomfret.jpg", category: "fish", type: "product", slug: "/fish/pomfret" },
    { id: 17, name: "Fresh Squid (Kanava)", price: 499, image: "/images/fishes picss/squid.jpg", category: "seafood", type: "product", slug: "/fish/squid" },
    { id: 18, name: "Cuttlefish (Kanava)", price: 520, image: "/images/fishes picss/cuttlefish.jpg", category: "seafood", type: "product", slug: "/fish/cuttlefish" },
    
    // Fish Combos
    { id: 12, name: "Weekend Fish Combo", price: 1299, image: "/images/combos/weekend-combo.jpg", category: "combo", type: "combo", slug: "/combo/weekend-fish" },
    { id: 13, name: "Family Fish Pack", price: 1599, image: "/images/combos/family-pack.jpg", category: "combo", type: "combo", slug: "/combo/family-fish" },
    { id: 14, name: "Premium Seafood Mix", price: 1899, image: "/images/combos/premium-mix.jpg", category: "combo", type: "combo", slug: "/combo/premium-seafood" },
  ];

  // Get location from localStorage on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setLocation(savedLocation);
      setIsLoading(false);
    } else {
      setLocation("Set your location");
      setIsLoading(false);
    }
  }, []);

  const getCurrentLocation = () => {
    setIsLoading(true);
    if (!navigator.geolocation) {
      setLocation("Location not supported");
      setIsLoading(false);
      toast.error("Location not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real app, we would use reverse geocoding here
        // For demo, we'll just use coordinates
        const coords = `${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`;
        setLocation(coords);
        localStorage.setItem('userLocation', coords);
        setIsLoading(false);
        setShowLocationDialog(false);
        toast.success("Location updated successfully");
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocation("Location access denied");
        setIsLoading(false);
        toast.error("Could not access your location");
      }
    );
  };

  const handleEditClick = () => {
    setTempLocation(location);
    setShowLocationDialog(true);
  };

  const handleLocationSave = () => {
    if (tempLocation.trim()) {
      setLocation(tempLocation.trim());
      localStorage.setItem('userLocation', tempLocation.trim());
      setShowLocationDialog(false);
      toast.success("Location updated successfully");
    }
  };

  // Close search results and user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle search results
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node) && 
          searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      
      // Handle user dropdown
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        // Don't close if the click was on the user button (that's handled separately)
        const userButton = document.getElementById('user-dropdown-button');
        if (!userButton || !userButton.contains(event.target as Node)) {
          setShowUserDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when search is shown
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // State for "Did you mean" suggestions
  const [didYouMean, setDidYouMean] = useState<string | null>(null);

  // Calculate string similarity (Levenshtein distance)
  const getLevenshteinDistance = (a: string, b: string): number => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    // Initialize matrix
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    // Fill matrix
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        const cost = a[j - 1] === b[i - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // deletion
          matrix[i][j - 1] + 1,      // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }

    return matrix[b.length][a.length];
  };

  // Find closest match for a query
  const findClosestMatch = (query: string, threshold = 3): string | null => {
    if (!query || query.length < 3) return null;
    
    let closestMatch = null;
    let minDistance = Infinity;
    
    // Create a set of all searchable terms
    const searchTerms = new Set<string>();
    
    sampleProducts.forEach(product => {
      // Add product name and individual words from name
      searchTerms.add(product.name.toLowerCase());
      product.name.toLowerCase().split(' ').forEach(word => {
        if (word.length > 3) searchTerms.add(word);
      });
      
      // Add category
      searchTerms.add(product.category.toLowerCase());
      
      // Add type if exists
      if (product.type) searchTerms.add(product.type.toLowerCase());
    });
    
    // Find closest match
    searchTerms.forEach(term => {
      const distance = getLevenshteinDistance(query, term);
      if (distance < minDistance && distance <= threshold && term !== query) {
        minDistance = distance;
        closestMatch = term;
      }
    });
    
    return closestMatch;
  };

  // Enhanced search with multilingual fish name matching
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      setIsSearching(true);
      setDidYouMean(null); // Reset suggestion on new search
      
      // Simulate API call with setTimeout
      const timer = setTimeout(() => {
        const query = searchQuery.toLowerCase().trim();
        
        // First, check if the query matches any fish names in our database
        const matchingFish = findFishByTerm(query);
        
        // Initialize results arrays
        const exactResults = [];
        const fuzzyResults = [];
        const fishRelatedResults = [];
        
        // If we found matching fish in our database, prioritize fish-related products
        const isFishRelatedSearch = matchingFish.length > 0;
        
        // Process each product
        for (const product of sampleProducts) {
          const productName = product.name.toLowerCase();
          const productCategory = product.category.toLowerCase();
          const productType = product.type ? product.type.toLowerCase() : '';
          
          // For fish-related searches, prioritize fish products
          const isFishProduct = 
            productCategory.includes('fish') || 
            productCategory === 'seafood' || 
            productCategory === 'combo';
          
          // Exact matches
          if (
            productName.includes(query) || 
            productCategory.includes(query) || 
            productType.includes(query)
          ) {
            // If this is a fish-related search and this is a fish product, prioritize it
            if (isFishRelatedSearch && isFishProduct) {
              exactResults.unshift(product); // Add to beginning of exact results
            } else {
              exactResults.push(product);
            }
            continue;
          }
          
          // Check if this product matches any of our fish database entries
          let isMatchingFishProduct = false;
          
          // For each matching fish, check if this product contains that fish name
          for (const fish of matchingFish) {
            if (
              productName.includes(fish.english.toLowerCase()) || 
              fish.tanglish.some(term => productName.includes(term.toLowerCase())) ||
              // Check if the product name includes the fish name in parentheses (like "Squid (Kanava)")
              productName.includes(`(${fish.tanglish[0]})`) ||
              // Check if the product name includes any of the alternate names
              (fish.alternateNames && fish.alternateNames.some(alt => productName.toLowerCase().includes(alt.toLowerCase())))
            ) {
              isMatchingFishProduct = true;
              break;
            }
          }
          
          // If this product matches our fish database but wasn't an exact match for the query
          if (isMatchingFishProduct) {
            fishRelatedResults.push(product);
            continue;
          }
          
          // Fuzzy matches - check if any word in the product name is similar
          const productWords = productName.split(' ');
          const queryWords = query.split(' ');
          
          let isFuzzyMatch = false;
          
          for (const productWord of productWords) {
            if (productWord.length < 3) continue; // Skip short words
            
            for (const queryWord of queryWords) {
              if (queryWord.length < 3) continue; // Skip short words
              
              const distance = getLevenshteinDistance(productWord, queryWord);
              if (distance <= 2) { // Allow up to 2 character differences
                isFuzzyMatch = true;
                break;
              }
            }
            
            if (isFuzzyMatch) break;
          }
          
          if (isFuzzyMatch) {
            // Prioritize fish products in fuzzy matches too
            if (isFishProduct) {
              fuzzyResults.unshift(product);
            } else {
              fuzzyResults.push(product);
            }
          }
        }
        
        // Combine results with priority: exact matches, fish-related matches, then fuzzy matches
        const combinedResults = [...exactResults, ...fishRelatedResults, ...fuzzyResults];
        
        // If no results, find closest match for "Did you mean" suggestion from our fish database
        if (combinedResults.length === 0) {
          const closestMatch = getClosestFishMatch(query);
          if (closestMatch) {
            setDidYouMean(closestMatch);
          }
        }
        
        setSearchResults(combinedResults);
        setShowSearchResults(true);
        setIsSearching(false);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setDidYouMean(null);
    }
  }, [searchQuery]);

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, we would navigate to search results page
      toast.success(`Searching for: ${searchQuery}`);
      // Don't reset search after submission to keep results visible
      setShowSearchResults(false);
    }
  };
  
  // Handle product click with navigation
  const handleProductClick = (product: any) => {
    // Navigate to the appropriate page based on product type
    const { id, type, slug } = product;
    
    if (slug) {
      // In a real app, this would use Next.js router to navigate
      window.location.href = slug;
    } else {
      toast.success(`Navigating to product ${id}`);
    }
    
    setShowSearchResults(false);
    setSearchQuery("");
  };

  // Fetch categories for mobile nav
  useEffect(() => {
    const fetchNavCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) {
          console.error("Failed to fetch categories for nav");
          return;
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          // Select top 4-6 active categories for quick links, or adjust as needed
          setMobileNavCategories(
            data
              .filter((cat: any) => cat.isActive)
              .slice(0, 6) // Show up to 6 categories
              .map((cat: any) => ({ id: cat.id, name: cat.name, slug: cat.slug }))
          );
        }
      } catch (error) {
        console.error("Error fetching nav categories:", error);
      }
    };
    fetchNavCategories();
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50" data-component-name="Header">
      <div className="container mx-auto px-4 py-3" data-component-name="Header">
        <div className="flex items-center justify-between" data-component-name="Header">
          {/* Logo - Responsive size */}
          <Link href="/" className="flex items-center h-full py-1 sm:py-2">
            <Image
              src="/images/logo.png"
              alt="TenderCuts"
              width={180}
              height={72}
              className="h-full w-auto object-contain max-h-12 sm:max-h-14 md:max-h-16 transition-transform hover:scale-105 duration-300"
              priority
            />
          </Link>

          {/* Desktop Search Bar */}
          <div className={`hidden md:flex items-center flex-1 max-w-md mx-6 ${showSearch ? 'opacity-100' : 'opacity-100'}`}>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search for fish, crab..."
                className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300 focus:border-tendercuts-red focus:ring-1 focus:ring-tendercuts-red"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-component-name="_c"
              />
              <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2">
                {isSearching ? (
                  <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 text-gray-400" />
                )}
              </button>
              
              {/* Live Search Results */}
              {showSearchResults && searchResults.length > 0 && (
                <div 
                  ref={searchResultsRef}
                  className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg overflow-hidden z-50 max-h-96 overflow-y-auto"
                >
                  <div className="p-2 border-b border-gray-100">
                    <p className="text-sm text-gray-500">Found {searchResults.length} results for "{searchQuery}"</p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {searchResults.map(product => (
                      <div 
                        key={product.id}
                        className="p-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center"
                        onClick={() => handleProductClick(product)}
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 mr-3">
                          {product.image ? (
                            <div className="w-full h-full relative">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                <circle cx="9" cy="9" r="2"></circle>
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{product.name}</p>
                          <div className="flex items-center">
                            <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                            {product.type && (
                              <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-600 capitalize">{product.type}</span>
                            )}
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="font-bold text-tendercuts-red">₹{product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {showSearchResults && searchResults.length === 0 && searchQuery.trim().length > 1 && (
                <div 
                  ref={searchResultsRef}
                  className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg overflow-hidden z-50"
                >
                  <div className="p-4 text-center">
                    <p className="text-gray-500">No results found for "{searchQuery}"</p>
                    
                    {didYouMean && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-600 mb-2">Did you mean:</p>
                        <button
                          onClick={() => setSearchQuery(didYouMean)}
                          className="px-3 py-1.5 bg-red-50 text-tendercuts-red rounded-full text-sm font-medium hover:bg-red-100 transition-colors"
                        >
                          {didYouMean}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Location Selector */}
          <div className="hidden md:flex items-center space-x-2 text-sm">
            <div 
              className="flex items-center cursor-pointer shadow-subtle hover:shadow-card rounded-md px-2 py-1 transition-all duration-300" 
              onClick={() => setShowLocationDialog(true)}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 text-tendercuts-red animate-spin" />
              ) : (
                <div className="text-tendercuts-red">
                  <MapPin className="h-5 w-5" />
                </div>
              )}
              <div className="ml-1">
                <p className="text-xs text-gray-500">Deliver to</p>
                <p className="text-sm font-medium truncate max-w-[120px] md:max-w-[200px]">{location}</p>
              </div>
              <div>
                <Edit2 className="h-3.5 w-3.5 ml-1 text-gray-400 transition-transform hover:scale-110" />
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  id="user-dropdown-button"
                  className="p-2 text-gray-700 hover:text-tendercuts-red transition-colors rounded-full hover:bg-gray-100 flex items-center"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  aria-expanded={showUserDropdown}
                  aria-haspopup="true"
                >
                  <User className="h-5 w-5" />
                </button>
                {showUserDropdown && (
                  <div 
                    ref={userDropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 transition-all duration-200 ease-in-out"
                  >
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium">{user?.name || 'My Account'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                    </div>
                    <Link 
                      href="/account" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      <span>My Profile</span>
                    </Link>
                    <Link 
                      href="/account/orders" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      <span>My Orders</span>
                    </Link>
                    <Link 
                      href="/account/loyalty" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      <span>Loyalty Points</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                        toast.success('Logged out successfully');
                      }}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/auth/login"
                className="p-2 text-gray-700 hover:text-tendercuts-red transition-colors rounded-full hover:bg-gray-100 flex items-center"
              >
                <User className="h-5 w-5" />
              </Link>
            )}
            
            <Link 
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-tendercuts-red transition-colors rounded-full hover:bg-gray-100"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5 transition-transform hover:scale-110 duration-300" />
              <span className="absolute -top-1 -right-1 bg-tendercuts-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getCartItemCount()}
              </span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden flex items-center justify-center h-10 w-10 focus:outline-none focus:ring-2 focus:ring-tendercuts-red/50 rounded-full"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? (
              <X className="h-6 w-6 transition-transform duration-300 rotate-90" />
            ) : (
              <Menu className="h-6 w-6 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-white shadow-lg fixed top-14 sm:top-16 left-0 right-0 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] overflow-y-auto z-50">
            <div className="container mx-auto px-4 py-4 space-y-4">
              {/* Search Bar for Mobile */}
              <form onSubmit={handleSearchSubmit} className="relative">
                {isSearching ? (
                  <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
                ) : (
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                )}
                <Input 
                  type="text" 
                  placeholder="Search for fish, crab..." 
                  className="pl-10 pr-4 py-2 w-full rounded-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-tendercuts-red/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-component-name="_c"
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
                
                {/* Mobile Search Results */}
                {showSearchResults && searchResults.length > 0 && (
                  <div 
                    className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto"
                  >
                    <div className="p-2 border-b border-gray-100">
                      <p className="text-sm text-gray-500">Found {searchResults.length} results</p>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {searchResults.map(product => (
                        <div 
                          key={product.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center"
                          onClick={() => handleProductClick(product)}
                        >
                          <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 mr-3">
                            {product.image ? (
                              <div className="w-full h-full relative">
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                  <circle cx="9" cy="9" r="2"></circle>
                                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{product.name}</p>
                            <div className="flex items-center">
                              <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                              {product.type && (
                                <span className="ml-1.5 px-1 py-0.5 text-xs rounded bg-gray-100 text-gray-600 capitalize">{product.type}</span>
                              )}
                            </div>
                          </div>
                          <div className="ml-2">
                            <p className="font-bold text-tendercuts-red text-sm">₹{product.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </form>

              {/* Location */}
              <div className="flex items-center p-2 border-b">
                <MapPin size={16} className="text-tendercuts-red mr-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Deliver to</p>
                  <button 
                    onClick={handleEditClick}
                    className="text-left w-full text-gray-700 font-medium"
                  >
                    {isLoading ? 'Loading...' : location}
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2 pt-2">
                {isAuthenticated ? (
                  <>
                    <Link 
                      href="/account" 
                      className="flex items-center p-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <User size={20} className="mr-3" />
                      <span>My Account</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowMobileMenu(false);
                        toast.success('Logged out successfully');
                      }}
                      className="w-full flex items-center p-2 text-gray-700 hover:bg-gray-50 rounded-md text-left transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link 
                    href="/auth/login" 
                    className="flex items-center p-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <User size={20} className="mr-3" />
                    <span>Login / Sign Up</span>
                  </Link>
                )}
                <Link 
                  href="/cart"
                  onClick={() => setShowMobileMenu(false)}
                  className="w-full flex items-center p-2 text-gray-700 hover:bg-gray-50 rounded-md text-left transition-colors"
                >
                  <ShoppingCart size={20} className="mr-3" />
                  <span>My Cart</span>
                  <span className="ml-auto bg-tendercuts-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{getCartItemCount()}</span>
                </Link>
                
                {/* Quick Navigation Links - Now Dynamic */}
                <div className="border-t mt-4 pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Categories</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Link 
                      href="/"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center p-2 text-gray-700 hover:bg-gray-50 rounded-md text-sm transition-colors"
                    >
                      <span>Home</span>
                    </Link>
                    {/* Dynamic Category Links */}
                    {mobileNavCategories.map(cat => (
                      <Link 
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        onClick={() => setShowMobileMenu(false)}
                        className="flex items-center p-2 text-gray-700 hover:bg-gray-50 rounded-md text-sm transition-colors truncate"
                      >
                        <span>{cat.name}</span>
                      </Link>
                    ))}
                     <Link 
                        href="/account/orders"
                        onClick={() => setShowMobileMenu(false)}
                        className="flex items-center p-2 text-gray-700 hover:bg-gray-50 rounded-md text-sm transition-colors"
                      >
                        <span>My Orders</span>
                      </Link>
                      {/* Add other static quick links if needed, e.g., All Fish if it's a separate page */}
                       <Link 
                        href="/fish" // Assuming /fish still shows ALL fish products from all categories
                        onClick={() => setShowMobileMenu(false)}
                        className="flex items-center p-2 text-gray-700 hover:bg-gray-50 rounded-md text-sm transition-colors"
                      >
                        <span>All Fish</span>
                      </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Location Dialog */}
        {showLocationDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Set Delivery Location</h3>
                <button onClick={() => setShowLocationDialog(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter your location</label>
                <Input 
                  type="text" 
                  value={tempLocation} 
                  onChange={(e) => setTempLocation(e.target.value)}
                  placeholder="Enter area, street name..."
                  className="w-full focus:ring-2 focus:ring-tendercuts-red/50"
                />
              </div>
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={isLoading}
                  className="flex items-center transition-transform hover:scale-105"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4 mr-2" />
                  )}
                  Use current location
                </Button>
                
                <Button
                  onClick={handleLocationSave}
                  disabled={!tempLocation.trim()}
                  className="transition-transform hover:scale-105 bg-tendercuts-red hover:bg-tendercuts-red/90"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
