'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, ShoppingCart, User, MenuSquare } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { getCartItemCount } = useCart();
  const [cartCount, setCartCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Update cart count whenever it changes
  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(getCartItemCount());
    };
    
    // Initial update
    updateCartCount();
    
    // Set up an interval to check for cart updates
    const intervalId = setInterval(updateCartCount, 1000);
    
    return () => clearInterval(intervalId);
  }, [getCartItemCount]);
  
  // Handle scroll behavior - hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Only update when scrolled more than 10px to avoid small movements
      if (Math.abs(currentScrollY - lastScrollY) < 10) return;
      
      setIsVisible(currentScrollY <= lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Handle search submission with debounce for efficiency
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setIsSearchOpen(false);
      setSearchTerm('');
    }
  };
  
  // Fish data for search suggestions
  const fishCategories = [
    { name: 'Fresh Fish', url: '/category/fish-combo?type=fresh' },
    { name: 'Premium Fish', url: '/category/fish-combo?type=premium' },
    { name: 'Fish Combos', url: '/category/fish-combo' },
    { name: 'Today\'s Special', url: '/category/fish-combo?special=true' }
  ];
  
  // Common fish types for suggestions
  const popularFish = [
    { name: 'Vangaram Fish', url: '/fish/vangaram-fish' },
    { name: 'Sankara Fish', url: '/fish/sankara-fish' },
    { name: 'Paal Sura', url: '/fish/paal-sura' },
    { name: 'Mathi Fish', url: '/fish/mathi-fish' },
    { name: 'King Fish', url: '/fish/king-fish' }
  ];

  // Define interface for nav items
  interface NavItem {
    name: string;
    href?: string;
    icon: React.ElementType;
    badge?: number | null;
    isAction?: boolean;
    action?: () => void;
    id?: string; // Add optional id for unique identification
  }

  // Use the proper auth context with user data
  const { isAuthenticated, user } = useAuth();
  
  // Add a state to track auth status changes
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Update login state when auth changes
  useEffect(() => {
    setIsLoggedIn(isAuthenticated && !!user);
    console.log('Auth state in MobileNav:', { isAuthenticated, user });
  }, [isAuthenticated, user]);

  const navItems: NavItem[] = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Categories', href: '/category/fish-combo', icon: MenuSquare },
    { name: 'Cart', href: '/cart', icon: ShoppingCart, badge: cartCount > 0 ? cartCount : null },
    { 
      name: 'Search', 
      action: () => setIsSearchOpen(true),
      icon: Search,
      isAction: true,
      id: 'mobile-search' // Add unique ID for search
    },
    { 
      name: 'Account', 
      href: isLoggedIn ? '/account' : '/auth/login?redirect=/account', 
      icon: User 
    },
  ];

  // Generate a unique key for each nav item
  const getNavItemKey = (item: NavItem, index: number) => {
    if (item.isAction && item.id) return item.id;
    return item.href || `nav-item-${index}`;
  };

  // Don't show on larger screens
  return (
    <AnimatePresence mode="wait">
      {/* Navigation Bar */}
      {isVisible && (
        <motion.div 
          key="mobile-nav-bar"
          className="fixed bottom-0 left-0 z-50 w-full bg-white border-t border-gray-200 md:hidden shadow-lg"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid h-full grid-cols-5 py-2">
            {navItems.map((item, index) => {
              const isActive = item.href ? pathname === item.href : false;
              
              // Different rendering for action items vs link items
              if (item.isAction) {
                return (
                  <button
                    key={getNavItemKey(item, index)}
                    onClick={item.action}
                    className={cn(
                      "flex flex-col items-center justify-center relative",
                      "text-gray-500 hover:text-blue-600"
                    )}
                  >
                    <div className="flex flex-col items-center justify-center text-xs">
                      <item.icon className="w-6 h-6 transition-all" />
                      {item.badge && (
                        <motion.span 
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full"
                        >
                          {item.badge > 99 ? '99+' : item.badge}
                        </motion.span>
                      )}
                    </div>
                    <span className="text-xs mt-1 font-medium transition-colors text-gray-500">
                      {item.name}
                    </span>
                  </button>
                );
              }
              
              // Regular link items
              return (
                <Link
                  key={getNavItemKey(item, index)}
                  href={item.href!}
                  className={cn(
                    "flex flex-col items-center justify-center",
                    isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
                  )}
                >
                  <div className="flex flex-col items-center justify-center text-xs">
                    <item.icon className={cn(
                      "w-6 h-6 transition-all",
                      isActive ? "scale-110 text-blue-600" : "scale-100"
                    )} />
                    {item.badge && (
                      <motion.span 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full"
                      >
                        {item.badge > 99 ? '99+' : item.badge}
                      </motion.span>
                    )}
                  </div>
                  <span className={cn(
                    "text-xs mt-1 font-medium transition-colors",
                    isActive ? "text-blue-600" : "text-gray-500"
                  )}>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <motion.div 
          key="search-overlay"
          className="fixed inset-0 z-50 flex items-start justify-center pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            // Close when clicking outside the search box
            if ((e.target as HTMLElement).classList.contains('overlay-backdrop')) {
              setIsSearchOpen(false);
            }
          }}
        >
          <motion.div 
            className="bg-white w-11/12 max-w-md rounded-xl overflow-hidden shadow-lg border border-gray-200"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-3 bg-tendercuts-red text-white flex justify-between items-center">
              <h3 className="text-base font-semibold">Search Kadal Thunai</h3>
              <button 
                className="text-white p-1 rounded-full hover:bg-white/20 transition-colors"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for fish, combos & more..."
                  className="w-full p-4 pl-12 pr-12 border-none focus:ring-2 focus:ring-tendercuts-red/30 focus:border-tendercuts-red text-gray-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                  style={{ color: '#333333' }}
                />
                {searchTerm && (
                  <button 
                    type="button"
                    className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                    onClick={() => setSearchTerm('')}
                    aria-label="Clear search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                    </svg>
                  </button>
                )}
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-tendercuts-red text-white p-2 rounded-full hover:bg-tendercuts-red-dark"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
            
            {/* Quick search suggestions */}
            <div className="p-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Categories</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {fishCategories.map((category, index) => (
                  <Link
                    key={`category-${index}`}
                    href={category.url}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-1.5 px-3 rounded-full transition-colors"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              
              <h4 className="text-sm font-medium text-gray-500 mb-3">Popular Fish</h4>
              <div className="flex flex-wrap gap-2">
                {popularFish.map((fish, index) => (
                  <Link
                    key={`fish-${index}`}
                    href={fish.url}
                    className="bg-tendercuts-red/10 hover:bg-tendercuts-red/20 text-tendercuts-red text-sm py-1.5 px-3 rounded-full transition-colors"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    {fish.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Invisible backdrop for closing */}
          <div className="absolute inset-0 -z-10 overlay-backdrop" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
