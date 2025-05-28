'use client';

import React, { useState, useEffect } from 'react';
import { useCart, CartItem } from '@/context/CartContext';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Heart, 
  ArrowLeft, 
  Package,
  MapPin,
  Clock,
  Truck,
  Tag,
  Gift,
  Share2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const CartPage = () => {
  const {
    cart,
    savedForLater,
    isLoading,
    error,
    userLocation,
    deliveryFee,
    deliverySlots,
    selectedDeliverySlot,
    addToCart,
    removeFromCart,
    updateQuantity,
    saveForLater,
    moveToCart,
    removeFromSaved,
    applyCoupon,
    removeCoupon,
    clearCart,
    getCartSummary,
    getCartItemCount,
    shareCart,
    updateNote,
    toggleGiftWrap,
    setSelectedDeliverySlot,
    checkout
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const [savedForLaterState, setSavedForLaterState] = useState<CartItem[]>([]);
  const [deliverySlotsState, setDeliverySlotsState] = useState<Array<{id: string; display: string; available: boolean}>>([]);

  const cartSummary = getCartSummary();
  const itemCount = getCartItemCount();

  // Handle coupon application
  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      const success = applyCoupon(couponCode.trim().toUpperCase());
      if (success) {
        setAppliedCouponCode(couponCode.trim().toUpperCase());
        setShowCouponInput(false);
        setCouponCode('');
      }
    }
  };

  // Handle coupon removal
  const handleRemoveCoupon = () => {
    removeCoupon();
    setAppliedCouponCode('');
  };

  // Handle note update
  const handleUpdateNote = (itemId: string) => {
    updateNote(itemId, noteText);
    setShowNoteInput(null);
    setNoteText('');
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (!user) {
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent(window.location.pathname);
      window.location.href = `/login?returnUrl=${returnUrl}`;
      return;
    }

    // Basic validation
    if (cart.length === 0) {
      setError('Your cart is empty. Please add items before checking out.');
      return;
    }

    if (!userLocation?.pincode) {
      setError('Please add a delivery address before checking out.');
      return;
    }

    if (!selectedDeliverySlot) {
      setError('Please select a delivery slot before checking out.');
      return;
    }

    try {
      setIsCheckingOut(true);
      setError(null);
      
      // In a real app, you would integrate with a payment gateway here
      // For demo purposes, we'll use a mock payment method
      const paymentMethod = {
        type: 'card',
        cardNumber: '4242 4242 4242 4242', // Test card number
        expiry: '12/25',
        cvv: '123',
        name: 'Test User'
      };

      const result = await checkout(paymentMethod);
      
      if (result.success) {
        setCheckoutSuccess(true);
        // Show success message and redirect to order confirmation
        setTimeout(() => {
          // In a real app, redirect to order confirmation page
          window.location.href = `/order-confirmation?orderId=${result.orderId}`;
        }, 2000);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to process your order. Please try again.');
      
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Handle share cart
  const handleShareCart = async () => {
    const success = await shareCart();
    if (!success) {
      // Fallback for browsers without share API
      alert('Cart link copied to clipboard!');
    }
  };

  // Empty cart state
  if (cart.length === 0 && savedForLater.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Link 
              href="/products"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">{itemCount} items in your cart</p>
          </div>
          <button
            onClick={handleShareCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Share Cart"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Success Display */}
        {checkoutSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-green-700">Order placed successfully!</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Cart Items */}
            {cart.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Cart Items</h2>
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex gap-4">
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={item.src}
                            alt={item.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 mb-1">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">{item.type}</p>
                              {item.serves && (
                                <p className="text-sm text-gray-500">Serves: {item.serves}</p>
                              )}
                            </div>
                            <p className="text-lg font-semibold text-gray-900">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-600">₹{item.price.toFixed(2)} each</p>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-4 mt-4">
                            <button
                              onClick={() => saveForLater(item.id)}
                              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                            >
                              <Heart className="w-4 h-4" />
                              Save for later
                            </button>
                            <button
                              onClick={() => {
                                if (showNoteInput === item.id) {
                                  handleUpdateNote(item.id);
                                } else {
                                  setShowNoteInput(item.id);
                                  setNoteText(item.note || '');
                                }
                              }}
                              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-700"
                            >
                              <Package className="w-4 h-4" />
                              {item.note ? 'Edit note' : 'Add note'}
                            </button>
                            <button
                              onClick={() => toggleGiftWrap(item.id, !item.isGiftWrapped)}
                              className={`flex items-center gap-2 text-sm ${
                                item.isGiftWrapped ? 'text-green-600' : 'text-gray-600'
                              }`}
                            >
                              <Gift className="w-4 h-4" />
                              Gift wrap
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                          
                          {/* Note Input */}
                          {showNoteInput === item.id && (
                            <div className="mt-4">
                              <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Add a note for this item..."
                                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={2}
                              />
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={() => handleUpdateNote(item.id)}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                                >
                                  Save Note
                                </button>
                                <button
                                  onClick={() => {
                                    setShowNoteInput(null);
                                    setNoteText('');
                                  }}
                                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                          
                          {/* Display existing note */}
                          {item.note && showNoteInput !== item.id && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700">Note: {item.note}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Saved for Later */}
            {savedForLater.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900">Saved for Later</h2>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {savedForLater.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex gap-4">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={item.src}  
                            alt={item.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{item.type}</p>
                          <p className="text-lg font-semibold text-gray-900 mt-2">
                            ₹{item.price.toFixed(2)}
                          </p>
                          
                          <div className="flex gap-4 mt-3">
                            <button
                              onClick={() => moveToCart(item.id)}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Move to Cart
                            </button>
                            <button
                              onClick={() => removeFromSaved(item.id)}
                              className="text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cart.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-6">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                </div>
                
                <div className="p-6 space-y-4">
                  {/* Delivery Info */}
                  {userLocation && (
                    <div className="flex gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Delivery to</p>
                        <p className="text-sm text-gray-600">{userLocation.address}</p>
                        <p className="text-sm text-gray-600">
                          {userLocation.pincode} • {userLocation.deliveryTime}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Delivery Slot Selection */}
                  {deliverySlots.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Select Delivery Slot
                      </label>
                      <select
                        value={selectedDeliverySlot || ''}
                        onChange={(e) => setSelectedDeliverySlot(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Choose a time slot</option>
                        {deliverySlots.slice(0, 6).map((slot) => (
                          <option key={slot.id} value={slot.id} disabled={!slot.available}>
                            {slot.display} {!slot.available && '(Unavailable)'}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {/* Coupon Code */}
                  <div>
                    {!showCouponInput && !appliedCouponCode ? (
                      <button
                        onClick={() => setShowCouponInput(true)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <Tag className="w-4 h-4" />
                        Apply Coupon Code
                      </button>
                    ) : showCouponInput ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleApplyCoupon}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                          >
                            Apply
                          </button>
                          <button
                            onClick={() => {
                              setShowCouponInput(false);
                              setCouponCode('');
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm text-green-700 font-medium">
                          Coupon {appliedCouponCode} applied
                        </span>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Price Breakdown */}
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                      <span className="text-gray-900">₹{cartSummary.subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="text-gray-900">
                        {cartSummary.deliveryFee === 0 ? 'Free' : `₹${cartSummary.deliveryFee.toFixed(2)}`}
                      </span>
                    </div>
                    
                    {cartSummary.tax > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="text-gray-900">₹{cartSummary.tax.toFixed(2)}</span>
                      </div>
                    )}
                    
                    {cartSummary.discount && cartSummary.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount</span>
                        <span className="text-green-600">-₹{cartSummary.discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-200">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">₹{cartSummary.total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut || !selectedDeliverySlot || isLoading}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isCheckingOut ? 'Processing...' : `Proceed to Checkout • ₹${cartSummary.total.toFixed(2)}`}
                  </button>
                  
                  {!selectedDeliverySlot && (
                    <p className="text-sm text-amber-600 text-center">
                      Please select a delivery slot to continue
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;