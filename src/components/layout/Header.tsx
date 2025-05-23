"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, User, ShoppingCart, Menu, X, Edit2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

// Simple toast function for user feedback
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-md text-white ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
};

const Header = () => {
  const [location, setLocation] = useState("Fetching your location...");
  const [isLoading, setIsLoading] = useState(true);
  const [tempLocation, setTempLocation] = useState("");
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { getCartItemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

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
      showToast("Location not supported by your browser", 'error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();
          
          const address = data.display_name?.split(',').slice(0, 3).join(',') || "Unknown location";
          setLocation(address);
          localStorage.setItem('userLocation', address);
          showToast("Location updated successfully");
        } catch (error) {
          console.error('Error fetching location:', error);
          setLocation("Unable to fetch location");
          showToast("Unable to fetch location. Please enter it manually.", 'error');
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocation("Location access denied");
        setIsLoading(false);
        showToast("Please enable location access or enter your location manually.", 'error');
      }
    );
  };

  const handleLocationSave = () => {
    if (tempLocation.trim()) {
      setLocation(tempLocation);
      localStorage.setItem('userLocation', tempLocation);
      setShowLocationDialog(false);
      showToast("Location updated successfully");
    }
  };

  const handleEditClick = () => {
    setTempLocation(location);
    setShowLocationDialog(true);
  };

  // Update tempLocation when dialog opens
  useEffect(() => {
    if (showLocationDialog) {
      setTempLocation(location);
    }
  }, [showLocationDialog, location]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 h-28 flex items-center justify-between">
        {/* Logo - Extra large size */}
        <Link href="/" className="flex items-center h-full py-4">
          <Image
            src="/images/logo.png"
            alt="TenderCuts"
            width={360}
            height={144}
            className="h-full w-auto object-contain"
            priority
          />
        </Link>

        {/* Location Selector */}
        <div className="hidden md:flex items-center space-x-2 text-sm ml-4">
          <div className="flex flex-col">
            <span className="text-gray-500 text-xs">Your Location</span>
            <div className="flex items-center group">
              {isLoading ? (
                <Loader2 className="h-4 w-4 text-tendercuts-red mr-2 animate-spin" />
              ) : (
                <MapPin size={16} className="text-tendercuts-red mr-1 flex-shrink-0" />
              )}
              <span className="text-gray-700 truncate max-w-[200px]">{location}</span>
              <button 
                onClick={handleEditClick}
                className="ml-2 text-tendercuts-red hover:text-tendercuts-red-dark transition-colors"
                title="Change location"
              >
                <Edit2 size={16} />
              </button>
            </div>
          </div>
        </div>
          
        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for products..."
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? (
            <Link href="/account" className="flex flex-col items-center text-sm text-gray-700 hover:text-tendercuts-red transition-colors">
              <User className="h-5 w-5 mb-1" />
              <span>Hi, {user?.name?.split(' ')[0] || 'User'}</span>
            </Link>
          ) : (
            <Link href="/auth/login" className="flex flex-col items-center text-sm text-gray-700 hover:text-tendercuts-red transition-colors">
              <User className="h-5 w-5 mb-1" />
              <span>Account</span>
            </Link>
          )}
          <Link 
            href="/cart"
            className="relative p-2 text-gray-700 hover:text-tendercuts-red transition-colors"
          >
            <ShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-tendercuts-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {getCartItemCount()}
            </span>
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 text-gray-700"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-4">
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

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for products..."
                className="pl-10 w-full"
              />
            </div>

            {/* Navigation Links */}
            <div className="space-y-2 pt-2">
              <Link 
                href="/auth/login" 
                className="flex items-center p-2 text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                <User size={20} className="mr-3" />
                <span>Login / Sign Up</span>
              </Link>
              <Link 
                href="/cart"
                onClick={() => setShowMobileMenu(false)}
                className="w-full flex items-center p-2 text-gray-700 hover:bg-gray-50 rounded-md text-left"
              >
                <ShoppingCart size={20} className="mr-3" />
                <span>My Cart</span>
                <span className="ml-auto bg-tendercuts-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{getCartItemCount()}</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Location Dialog */}
      {showLocationDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium mb-4">Change Location</h3>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter your location"
                value={tempLocation}
                onChange={(e) => setTempLocation(e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setShowLocationDialog(false)}
                >
                  Cancel
                </Button>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={getCurrentLocation}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <MapPin className="h-4 w-4 mr-2" />
                    )}
                    Use Current Location
                  </Button>
                  <Button 
                    onClick={handleLocationSave}
                    disabled={!tempLocation.trim()}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
