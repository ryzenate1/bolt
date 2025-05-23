'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the Fish interface (consistent with other pages)
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

export interface CartItem extends Fish {
  quantity: number;
}

interface UserLocation {
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  pincode?: string;
}

interface CartContextType {
  cart: CartItem[];
  userLocation: UserLocation | null;
  deliveryFee: number;
  setUserLocation: (location: UserLocation | null) => void;
  calculateDeliveryFee: (location: UserLocation) => Promise<number>;
  addToCart: (fish: Fish, quantity: number) => void;
  removeFromCart: (fishId: string) => void;
  updateQuantity: (fishId: string, newQuantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

// Shop location coordinates (you'll need to set your shop's actual coordinates)
const SHOP_LOCATION = {
  lat: 12.9716,  // Example: Chennai coordinates
  lng: 80.0387
};

// Base delivery fee in INR
const BASE_DELIVERY_FEE = 40;

// Maximum distance in kilometers for free delivery
const FREE_DELIVERY_THRESHOLD = 5;

// Delivery fee per kilometer beyond free threshold
const FEE_PER_KM = 10;

// Maximum delivery radius in kilometers
const MAX_DELIVERY_DISTANCE = 15;

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  
  // Function to calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos((lat1 * Math.PI) / 180) * 
      Math.cos((lat2 * Math.PI) / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };

  // Calculate delivery fee based on distance
  const calculateDeliveryFee = async (location: UserLocation): Promise<number> => {
    if (!location.coordinates) {
      return BASE_DELIVERY_FEE; // Default fee if no coordinates
    }

    const distance = calculateDistance(
      SHOP_LOCATION.lat,
      SHOP_LOCATION.lng,
      location.coordinates.lat,
      location.coordinates.lng
    );

    // If beyond maximum delivery distance
    if (distance > MAX_DELIVERY_DISTANCE) {
      return -1; // Indicates delivery not available
    }

    // Free delivery within threshold
    if (distance <= FREE_DELIVERY_THRESHOLD) {
      return 0;
    }

    // Calculate fee based on distance beyond free threshold
    const distanceBeyondThreshold = distance - FREE_DELIVERY_THRESHOLD;
    return Math.ceil(distanceBeyondThreshold * FEE_PER_KM);
  };

  // Update delivery fee when user location changes
  useEffect(() => {
    if (userLocation) {
      calculateDeliveryFee(userLocation).then(fee => {
        setDeliveryFee(fee !== -1 ? fee : BASE_DELIVERY_FEE);
      });
    } else {
      setDeliveryFee(BASE_DELIVERY_FEE);
    }
  }, [userLocation]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem('tendercutsCart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tendercutsCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (fish: Fish, quantity: number) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === fish.id);
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        return [...prevCart, { ...fish, quantity }];
      }
    });
    // setIsCartOpen(true); // Optionally open cart on add
  };

  const removeFromCart = (fishId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== fishId));
  };

  const updateQuantity = (fishId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(fishId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === fishId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        userLocation,
        deliveryFee,
        setUserLocation,
        calculateDeliveryFee,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
