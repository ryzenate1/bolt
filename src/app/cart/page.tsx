"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ChevronRight, PlusCircle, MapPin } from "lucide-react";
import TopPicks from "@/components/home/TopPicks";
import { useCart, CartItem } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/formatPrice';
import { AddressFormDialog } from "@/components/address/AddressFormDialog";
import { AddressCard } from "@/components/address/AddressCard";
import { Address } from "@/components/address/AddressFormDialog";

// Helper function to format price with currency symbol
const formatPriceWithSymbol = (price: number) => `₹${(price / 100).toFixed(2)}`;

// Main Cart component
export default function Cart() {
  // State hooks - must be called unconditionally at the top level
  const [isClient, setIsClient] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>();
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  
  // Get user data from auth context
  const { user, isAuthenticated } = useAuth();
  
  // Create a default address from user's profile if available
  const getDefaultAddress = useCallback((): Address | null => {
    if (!user?.defaultAddress) return null;
    
    return {
      id: user.defaultAddress.id,
      type: 'home' as const,
      name: user.defaultAddress.name,
      phoneNumber: '',
      address: user.defaultAddress.address,
      city: user.defaultAddress.city,
      state: user.defaultAddress.state,
      pincode: user.defaultAddress.pincode,
      isDefault: true,
      coordinates: { lat: 0, lng: 0 } // Default coordinates
    };
  }, [user?.defaultAddress]);
  
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  
  // Cart context hooks - called unconditionally
  const cartContext = useCart();
  
  // Destructure cart context values after the hook call
  const { 
    cart = [], 
    removeFromCart, 
    updateQuantity: contextUpdateQuantity, 
    getCartTotal,
    userLocation,
    deliveryFee,
    setUserLocation,
    calculateDeliveryFee
  } = cartContext;

  // Handle adding a new address
  const handleAddNewAddress = useCallback(() => {
    setEditingAddress(undefined);
    setIsAddressDialogOpen(true);
  }, []);
  
  // Handle address selection
  const handleSelectAddress = useCallback((address: Address) => {
    if (address && address.id) {
      setSelectedAddressId(address.id);
    }
  }, []);
  
  // Handle editing an address
  const handleEditAddress = useCallback((address: Address) => {
    setEditingAddress(address);
    setIsAddressDialogOpen(true);
  }, []);
  
  // Handle saving a new or updated address
  const handleSaveAddress = useCallback(async (address: Omit<Address, 'id'> & { id?: string }) => {
    const newAddress = {
      ...address,
      id: editingAddress?.id || `addr-${Date.now()}`,
    };
    
    let updatedAddresses;
    
    if (editingAddress) {
      updatedAddresses = savedAddresses.map(addr => 
        addr.id === editingAddress.id ? newAddress : addr
      );
    } else {
      updatedAddresses = [...savedAddresses, newAddress];
    }
    
    // If this is the only address or marked as default, set it as default
    if (updatedAddresses.length === 1 || newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === newAddress.id
      }));
      
      setSelectedAddressId(newAddress.id);
      
      const userLocationUpdate = {
        address: `${newAddress.address}, ${newAddress.city}, ${newAddress.state} - ${newAddress.pincode}`,
        coordinates: newAddress.coordinates || { lat: 0, lng: 0 },
        pincode: newAddress.pincode
      };
      
      setUserLocation?.(userLocationUpdate);
      
      // Recalculate delivery fee when address changes
      if (newAddress.coordinates) {
        try {
          await calculateDeliveryFee?.(userLocationUpdate);
        } catch (error) {
          console.error('Error calculating delivery fee:', error);
        }
      }
    }
    
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
    setIsAddressDialogOpen(false);
    setEditingAddress(undefined);
  }, [editingAddress, savedAddresses, setUserLocation, calculateDeliveryFee]);
  
  // Calculate derived state using useMemo to prevent unnecessary recalculations
  const { subtotal, isEligibleForFreeDelivery, finalDeliveryFee, discount, total } = useMemo(() => {
    const subtotalValue = getCartTotal?.() || 0;
    const isEligibleForFreeDeliveryValue = subtotalValue >= 50000; // ₹500 in paise
    const finalDeliveryFeeValue = isEligibleForFreeDeliveryValue ? 0 : (deliveryFee > 0 ? deliveryFee : 0);
    const discountValue = couponApplied ? Math.floor(subtotalValue * 0.1) : 0; // 10% discount for demo
    const totalValue = Math.max(0, subtotalValue - discountValue + finalDeliveryFeeValue);
    
    return {
      subtotal: subtotalValue,
      isEligibleForFreeDelivery: isEligibleForFreeDeliveryValue,
      finalDeliveryFee: finalDeliveryFeeValue,
      discount: discountValue,
      total: totalValue
    };
  }, [getCartTotal, deliveryFee, couponApplied]);
  
  // Format price helper (converts paise to rupees)
  const formatPrice = useCallback((price: number) => (price / 100).toFixed(2), []);
  
  // Update saved addresses when user's default address changes
  useEffect(() => {
    const defaultAddr = getDefaultAddress();
    if (defaultAddr && defaultAddr.id) {
      setSelectedAddressId(defaultAddr.id);
      setSavedAddresses([defaultAddr]);
    } else {
      setSelectedAddressId(null);
      setSavedAddresses([]);
    }
  }, [getDefaultAddress]);

  // Set isClient to true on mount
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Handle quantity update
  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    contextUpdateQuantity?.(itemId, newQuantity);
  }, [contextUpdateQuantity]);
  
  // Handle coupon application
  const applyCoupon = useCallback(() => {
    // Simple validation - in a real app, validate with the server
    if (couponCode.trim() === '') return;
    
    // For demo purposes, any non-empty code applies a 10% discount
    setCouponApplied(true);
  }, [couponCode]);
  
  // Get the selected address
  const selectedAddress = useMemo(() => {
    return savedAddresses.find(addr => addr.id === selectedAddressId) || null;
  }, [savedAddresses, selectedAddressId]);

  // Show loading state on server-side or before client-side hydration
  if (!isClient || typeof window === 'undefined') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tendercuts-red"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isAuthenticated && user?.name ? `Welcome back, ${user.name.split(' ')[0]}!` : 'Your Shopping Cart'}
        </h1>

        {cart.length > 0 ? (
          <div className="space-y-6">
            {/* Delivery Address Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Delivery Address</h2>
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddNewAddress}
                    className="text-tendercuts-red border-tendercuts-red hover:bg-tendercuts-red/10"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add New Address
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="text-tendercuts-red border-tendercuts-red hover:bg-tendercuts-red/10"
                  >
                    <Link href="/auth/login">Sign in to add address</Link>
                  </Button>
                )}
              </div>
              
              {isLocating && savedAddresses.length === 0 && (
                <div className="flex items-center text-gray-600 py-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-tendercuts-red mr-2"></div>
                  Locating you...
                </div>
              )}
              
              {locationError && (
                <div className="text-red-500 text-sm mb-4">{locationError}</div>
              )}
              
              <div className="space-y-4">
                {savedAddresses.map((address) => (
                  <div 
                    key={address.id} 
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedAddressId === address.id 
                        ? 'border-tendercuts-red bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSelectAddress(address)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-tendercuts-red mr-2" />
                          <span className="font-medium">{address.type}</span>
                          {address.isDefault && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-gray-700">
                          {address.name}, {address.address}, {address.city}, {address.state} - {address.pincode}
                        </p>
                        {address.phoneNumber && (
                          <p className="text-sm text-gray-500 mt-1">Phone: {address.phoneNumber}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-tendercuts-red hover:bg-red-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAddress(address);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
                
                {savedAddresses.length === 0 && !isLocating && (
                  <div className="text-center py-6 text-gray-500">
                    <p className="mb-2">No saved addresses found</p>
                    {isAuthenticated ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddNewAddress}
                        className="text-tendercuts-red border-tendercuts-red hover:bg-tendercuts-red/10"
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Add New Address
                      </Button>
                    ) : (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="text-tendercuts-red border-tendercuts-red hover:bg-tendercuts-red/10"
                      >
                        <Link href="/auth/login">Sign in to add address</Link>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Cart Items Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Your Order</h2>
              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <div key={item.id} className="py-4 flex items-center">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                      {item.src && (
                        <Image
                          src={item.src}
                          alt={item.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-tendercuts-red font-medium mt-1">
                        ₹{formatPrice(item.price)}
                      </p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                          className="text-gray-500 hover:text-gray-700 p-1"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="mx-2 w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          className="text-gray-500 hover:text-gray-700 p-1"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart?.(item.id)}
                      className="text-gray-400 hover:text-red-500 p-2"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Coupon Code */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex">
                  <Input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 rounded-r-none"
                  />
                  <Button
                    onClick={applyCoupon}
                    className="bg-tendercuts-red hover:bg-tendercuts-red/90 rounded-l-none"
                  >
                    Apply
                  </Button>
                </div>
                {couponApplied && (
                  <p className="text-green-600 text-sm mt-2">Coupon applied successfully!</p>
                )}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>
                      {isEligibleForFreeDelivery ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₹${formatPrice(finalDeliveryFee)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium text-lg pt-2 border-t border-gray-200 mt-2">
                    <span>Total</span>
                    <span>₹{formatPrice(total)}</span>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-tendercuts-red hover:bg-tendercuts-red/90 h-12 text-lg">
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 text-gray-300 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild className="bg-tendercuts-red hover:bg-tendercuts-red/90">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Address Form Dialog */}
      <AddressFormDialog
        open={isAddressDialogOpen}
        onOpenChange={setIsAddressDialogOpen}
        address={editingAddress}
        onSave={handleSaveAddress}
      />

      {/* Show Top Picks when cart is empty */}
      {cart.length === 0 && <TopPicks />}
    </div>
  );
}
