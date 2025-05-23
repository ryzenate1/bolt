"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Mock product data - in a real app, you would fetch this from an API
const allProducts = [
  {
    id: 1,
    name: "Chicken Curry Cut (Skin Off) - 1 Kg",
    image: "/images/products/chicken-curry-cut.jpeg",
    price: 309,
    category: "chicken",
    slug: "chicken-curry-cut-skin-off-1kg",
  },
  {
    id: 2,
    name: "Chicken Breast Boneless",
    image: "/images/products/chicken-breast-boneless.webp",
    price: 154,
    category: "chicken",
    slug: "chicken-breast-boneless",
  },
  {
    id: 3,
    name: "Premium - Curry Cut (Skin Off) Without Liver",
    image: "/images/products/premium-curry-cut.webp",
    price: 158,
    category: "chicken",
    slug: "premium-curry-cut-skin-off-without-liver",
  },
  {
    id: 4,
    name: "Premium - Curry Cut (Skin On) Without Liver",
    image: "/images/products/premium-curry-cut-skin.webp",
    price: 149,
    category: "chicken",
    slug: "premium-curry-cut-skin-on-without-liver",
  },
  {
    id: 5,
    name: "Sardine - Mathi",
    image: "/images/products/sardine.webp",
    price: 129,
    category: "seafood",
    slug: "sardine-mathi",
  },
  {
    id: 6,
    name: "Prawns Medium - Deshelled",
    image: "/images/products/prawns.webp",
    price: 215,
    category: "seafood",
    slug: "prawns-medium-deshelled",
  },
];

// Mock category data - in a real app, you would fetch this from an API
const categories = [
  { id: 1, name: "Chicken", slug: "chicken" },
  { id: 2, name: "Mutton", slug: "mutton" },
  { id: 3, name: "Seafood", slug: "seafood" },
  { id: 4, name: "Ready to Cook", slug: "ready-to-cook" },
  { id: 5, name: "Biryani", slug: "biryani" },
  { id: 6, name: "Snacks", slug: "snacks" },
];

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchResults, setSearchResults] = useState<typeof allProducts>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }

    // Focus input when overlay opens
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }

    // Prevent scrolling when overlay is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    // Search function with debounce
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        setIsLoading(true);
        // Simulate API call delay
        setTimeout(() => {
          const filtered = allProducts.filter((product) => {
            if (activeTab !== "all" && product.category !== activeTab) {
              return false;
            }
            return product.name.toLowerCase().includes(searchTerm.toLowerCase());
          });
          setSearchResults(filtered);
          setIsLoading(false);
        }, 500);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, activeTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // Add to recent searches
    const updatedSearches = [
      searchTerm,
      ...recentSearches.filter(s => s !== searchTerm)
    ].slice(0, 5);

    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

    // Navigate to search results page (in a real app)
    // router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    onClose();
  };

  const handleProductClick = (slug: string) => {
    router.push(`/product/${slug}`);
    onClose();
  };

  const handleCategoryClick = (slug: string) => {
    router.push(`/category/${slug}`);
    onClose();
  };

  const handleRecentSearchClick = (term: string) => {
    setSearchTerm(term);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="bg-white w-full max-h-screen overflow-y-auto animate-in fade-in slide-in-from-top duration-300">
        <div className="container mx-auto px-4 py-4">
          {/* Search Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Search</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="relative mb-6">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 pl-12 pr-4 rounded-lg border-gray-300 w-full focus:border-tendercuts-red focus:ring-tendercuts-red"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            {searchTerm && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchTerm("")}
              >
                <X size={16} />
              </Button>
            )}
          </form>

          {/* Recent Searches */}
          {!searchTerm && recentSearches.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Recent Searches</h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-tendercuts-red hover:underline"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRecentSearchClick(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Filter Tabs (only show when searching) */}
          {searchTerm && (
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <TabsList className="w-full overflow-x-auto flex flex-nowrap justify-start">
                <TabsTrigger value="all" className="flex-shrink-0">All</TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.slug}
                    className="flex-shrink-0"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}

          {/* Loading State */}
          {isLoading && searchTerm && (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-tendercuts-red" />
            </div>
          )}

          {/* Search Results */}
          {!isLoading && searchTerm && searchResults.length > 0 && (
            <div className="space-y-4 mb-6 animate-in fade-in duration-300">
              <h3 className="text-sm font-medium text-gray-700">
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{searchTerm}"
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 cursor-pointer group"
                    onClick={() => handleProductClick(product.slug)}
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="font-medium text-gray-800 group-hover:text-tendercuts-red transition-colors line-clamp-2">
                      {product.name}
                    </h4>
                    <p className="text-gray-800 font-semibold mt-2">₹{product.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!isLoading && searchTerm && searchResults.length === 0 && (
            <div className="text-center py-10 animate-in fade-in duration-300">
              <div className="mb-4 text-gray-400">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any products matching "{searchTerm}"
              </p>
              <p className="text-sm text-gray-500">
                Try checking your spelling or using different keywords
              </p>
            </div>
          )}

          {/* Popular Categories (shown when no search) */}
          {!searchTerm && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Categories</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-center cursor-pointer"
                    onClick={() => handleCategoryClick(category.slug)}
                  >
                    <h4 className="font-medium text-gray-800">{category.name}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
