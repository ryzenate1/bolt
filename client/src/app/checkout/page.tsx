'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CheckCircle, ChevronRight, CreditCard, Truck, Wallet, MapPin, Clock, Banknote } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

// Types
type CheckoutStep = 'address' | 'delivery' | 'payment' | 'review';

interface Address {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface DeliverySlot {
  id: string;
  display: string;
  available: boolean;
}

interface OrderSummary {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
}

// Mock data for delivery slots
const deliverySlots: DeliverySlot[] = [
  { id: 'morning', display: 'Morning (9 AM - 12 PM)', available: true },
  { id: 'afternoon', display: 'Afternoon (12 PM - 4 PM)', available: true },
  { id: 'evening', display: 'Evening (4 PM - 8 PM)', available: true },
];

// Payment methods
const paymentMethods = [
  { id: 'cod', name: 'Cash on Delivery', icon: <Wallet className="w-5 h-5" /> },
  { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'upi', name: 'UPI Payment', icon: <Truck className="w-5 h-5" /> },
];

const CheckoutPage = () => {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { cart: cartItems, getCartTotal } = useCart();
  const [isClient, setIsClient] = useState(false);
  
  // State for checkout steps
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('address');
  
  // Function to navigate between steps
  const goToStep = (step: CheckoutStep) => {
    setCheckoutStep(step);
  };
  
  // State for address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  
  // Handle address selection
  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
  };
  
  // State for delivery slots
  const [selectedDeliverySlot, setSelectedDeliverySlot] = useState<string | null>(null);
  
  // Handle delivery slot selection
  const handleDeliverySlotSelect = (slotId: string) => {
    setSelectedDeliverySlot(slotId);
  };
  
  // State for payment
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  
  // State for order processing
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form data for new address
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    name: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });
  
  // Order summary
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    subtotal: 0,
    discount: 0,
    deliveryFee: 40,
    total: 0
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle address form submission
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.phoneNumber || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // In a real app, you would save this to your backend
    const newAddress: Address = {
      ...formData,
      id: Date.now().toString(),
    };
    
    // Update saved addresses
    const updatedAddresses = [...savedAddresses, newAddress];
    setSavedAddresses(updatedAddresses);
    setSelectedAddress(newAddress);
    setShowAddressForm(false);
    
    // Save to localStorage (temporary solution)
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
    
    // Reset form
    setFormData({
      name: '',
      phoneNumber: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    });
    
    toast.success('Address saved successfully');
  };

  // Update order summary when cart changes
  useEffect(() => {
    if (isClient) {
      const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const finalDeliveryFee = cartTotal > 500 ? 0 : 49; // Assuming 49 is the default delivery fee
      
      setOrderSummary(prev => ({
        ...prev,
        subtotal: cartTotal,
        deliveryFee: finalDeliveryFee,
        total: cartTotal + finalDeliveryFee - prev.discount
      }));
    }
  }, [cartItems, isClient]);

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
    
    // Load saved addresses from localStorage or API
    const loadSavedAddresses = async () => {
      try {
        // Replace with actual API call to fetch saved addresses
        const saved = localStorage.getItem('savedAddresses');
        if (saved) {
          const parsed = JSON.parse(saved);
          setSavedAddresses(parsed);
          
          // Set default address if available
          const defaultAddress = parsed.find((addr: Address) => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddress(defaultAddress);
          }
        }
      } catch (error) {
        console.error('Error loading saved addresses:', error);
      }
    };
    
    loadSavedAddresses();
  }, []);

  // Handle hydration and authentication
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [authLoading, isAuthenticated, router]);

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedDeliverySlot || !paymentMethod) {
      toast.error('Please complete all checkout steps');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Replace with actual order placement logic
      // For now, simulate success and redirect
      toast.success('Order placed successfully!');
      router.push('/order-confirmation'); // Or some other success page
      
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast.error('An error occurred while placing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Format price helper
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate order summary
  const calculateOrderSummary = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 500 ? 0 : 49;
    const discount = orderSummary.discount;
    const total = subtotal + deliveryFee - discount;

    return { subtotal, deliveryFee, discount, total };
  };

  const { subtotal, deliveryFee, discount, total } = calculateOrderSummary();

  // Handle step navigation with type safety
  const handleNextStep = () => {
    switch (checkoutStep) {
      case 'address':
        if (selectedAddress) goToStep('delivery');
        break;
      case 'delivery':
        if (selectedDeliverySlot) goToStep('payment');
        break;
      case 'payment':
        goToStep('review');
        break;
      case 'review':
        // Handle order placement
        handlePlaceOrder();
        break;
    }
  };

  // Render the checkout steps
  const renderStepContent = () => {
    switch (checkoutStep) {
      case 'address':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Delivery Address</h2>
              
              {savedAddresses.length > 0 && (
                <div className="space-y-4 mb-6">
                  <h3 className="font-medium">Saved Addresses</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {savedAddresses.map((address) => (
                      <div 
                        key={address.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedAddress?.id === address.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleAddressSelect(address)}
                      >
                        <div className="flex items-start">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{address.name}</h4>
                              {address.isDefault && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">Phone: {address.phoneNumber}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  <span>+ Add New Address</span>
                </button>

                {showAddressForm && (
                  <form onSubmit={handleAddressSubmit} className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          required
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Complete Address *
                        </label>
                        <Input
                          id="address"
                          name="address"
                          type="text"
                          required
                          value={formData.address}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <Input
                          id="city"
                          name="city"
                          type="text"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State *
                        </label>
                        <Input
                          id="state"
                          name="state"
                          type="text"
                          required
                          value={formData.state}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                          Pincode *
                        </label>
                        <Input
                          id="pincode"
                          name="pincode"
                          type="text"
                          required
                          value={formData.pincode}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          id="isDefault"
                          name="isDefault"
                          type="checkbox"
                          checked={formData.isDefault}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                          Set as default address
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddressForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save Address</Button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={() => handleNextStep()}
                disabled={!selectedAddress}
              >
                Continue to Delivery
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 'delivery':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Choose Delivery Slot</h2>
              <div className="space-y-4">
                <h3 className="font-medium">Available Time Slots</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {deliverySlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => handleDeliverySlotSelect(slot.id)}
                      disabled={!slot.available}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        selectedDeliverySlot === slot.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${!slot.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${
                          selectedDeliverySlot === slot.id 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-gray-300'
                        }`}>
                          {selectedDeliverySlot === slot.id && (
                            <CheckCircle className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{slot.display}</p>
                          {!slot.available && (
                            <p className="text-xs text-red-500 mt-1">Not available</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCheckoutStep('address')}
              >
                Back
              </Button>
              <Button 
                onClick={() => handleNextStep()}
                disabled={!selectedDeliverySlot}
              >
                Continue to Payment
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Select Payment Method</h2>
              
              <Tabs defaultValue="online" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="online" onClick={() => setPaymentMethod('online')}>
                    Online Payment
                  </TabsTrigger>
                  <TabsTrigger value="cod" onClick={() => setPaymentMethod('cod')}>
                    Cash on Delivery
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="online" className="mt-6">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="font-medium">Credit/Debit Card</span>
                      </div>
                      <div className="mt-4 space-y-3">
                        <Input placeholder="Card Number" className="w-full" />
                        <div className="grid grid-cols-2 gap-3">
                          <Input placeholder="MM/YY" />
                          <Input placeholder="CVV" />
                        </div>
                        <Input placeholder="Name on Card" />
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center">
                        <Wallet className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="font-medium">UPI</span>
                      </div>
                      <div className="mt-4">
                        <Input placeholder="Enter UPI ID" className="w-full" />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="cod" className="mt-6">
                  <div className="border rounded-lg p-6 text-center">
                    <Truck className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Pay with Cash on Delivery</h3>
                    <p className="text-gray-600 mb-4">
                      Pay when you receive your order
                    </p>
                    <p className="text-sm text-gray-500">
                      An additional ₹20 will be charged for cash payment
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCheckoutStep('delivery')}
              >
                Back
              </Button>
              <Button 
                onClick={() => handleNextStep()}
                disabled={!paymentMethod}
              >
                Review Order
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Review Your Order</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Delivery Address</h3>
                  <div className="border rounded-lg p-4">
                    <p className="font-medium">{selectedAddress?.name}</p>
                    <p className="text-gray-600">{selectedAddress?.address}</p>
                    <p className="text-gray-600">
                      {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.pincode}
                    </p>
                    <p className="text-gray-600">Phone: {selectedAddress?.phoneNumber}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Delivery Slot</h3>
                  <div className="border rounded-lg p-4">
                    {deliverySlots.find(slot => slot.id === selectedDeliverySlot)?.display || 'Not selected'}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Payment Method</h3>
                  <div className="border rounded-lg p-4">
                    {paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Order Summary</h3>
                  <div className="border rounded-lg p-4 space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 bg-gray-100 rounded-md overflow-hidden">
                            <Image 
                              src={item.src} 
                              alt={item.name} 
                              width={48} 
                              height={48}
                              className="object-cover h-full w-full"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium">₹{item.price * item.quantity}</p>
                      </div>
                    ))}

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span>-₹{discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                        <span>Total</span>
                        <span>₹{total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCheckoutStep('payment')}
              >
                Back
              </Button>
              <Button 
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? 'Placing Order...' : 'Place Order'}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
        
        {/* Checkout Progress */}
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${s <= checkoutStep ? 'bg-blue-600 text-white' : 'border-gray-300 text-gray-400'}`}>
                {s < checkoutStep ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 4 && (
                <div className={`w-full h-1 ${s < checkoutStep ? 'bg-blue-600' : 'bg-gray-300'}`} style={{ width: '50px' }}></div>
              )}
            </div>
          ))}
        </div>
        
        {/* Step 1: Delivery Address */}
        {checkoutStep === 1 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-blue-600" />
              <h2 className="text-xl font-semibold">Delivery Address</h2>
            </div>
            
            <div className="space-y-4">
              {/* Mock addresses - in a real app, these would come from the user's saved addresses */}
              {[1, 2].map((id) => (
                <div 
                  key={id} 
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedAddress?.id === String(id) ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                  onClick={() => setSelectedAddress(String(id))}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Home</p>
                      <p className="text-sm text-gray-600 text-sm mt-1">123 Main Street, Apartment 4B</p>
                      <p className="text-sm text-gray-600">Chennai, Tamil Nadu 600001</p>
                      <p className="text-sm text-gray-600 mt-2">Phone: +91 98765 43210</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAddress(String(id));
                      }}
                    >
                      Deliver Here <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => router.push('/account/addresses?redirect=/checkout')}
              >
                + Add New Address
              </Button>
            </div>
          </div>
        )}
        
        {/* Step 2: Delivery Time */}
        {checkoutStep === 2 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-blue-600" />
              <h2 className="text-xl font-semibold">Delivery Time</h2>
            </div>
            
            <div className="space-y-3">
              {deliverySlots.map((slot) => (
                <div 
                  key={slot.id} 
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedDeliverySlot === slot.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                  onClick={() => setSelectedDeliverySlot(slot.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Clock className="text-blue-600 w-5 h-5" />
                      <span>{slot.display}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDeliverySlot(slot.id);
                      }}
                    >
                      Select <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCheckoutStep(1)}
              >
                Back
              </Button>
            </div>
          </div>
        )}
        
        {/* Step 3: Payment Method */}
        {checkoutStep === 3 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="text-blue-600" />
              <h2 className="text-xl font-semibold">Payment Method</h2>
            </div>
            
            <div className="space-y-3">
              {['online', 'cod'].map((method) => (
                <div 
                  key={method} 
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === method ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                  onClick={() => setPaymentMethod(method)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      {method === 'online' ? (
                        <>
                          <CreditCard className="text-blue-600 w-5 h-5" />
                          <span>Online Payment (Card/UPI/Netbanking)</span>
                        </>
                      ) : (
                        <>
                          <Truck className="text-blue-600 w-5 h-5" />
                          <span>Cash on Delivery</span>
                        </>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPaymentMethod(method);
                      }}
                    >
                      Select <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCheckoutStep(2)}
              >
                Back
              </Button>
            </div>
          </div>
        )}
        
        {/* Step 4: Order Review */}
        {checkoutStep === 4 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Order Review</h2>
            
            <div className="space-y-6">
              {/* Order Items */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Items ({cartItems.length})</h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-100">
                        <Image 
                          src={item.src} 
                          alt={item.name} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.type} • {item.netWeight}</p>
                        <div className="flex justify-between mt-1">
                          <p className="text-sm">{item.quantity} × {formatPrice(item.price)}</p>
                          <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Delivery Details */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-700 mb-3">Delivery Details</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Home</p>
                      <p className="text-sm text-gray-600 text-sm mt-1">123 Main Street, Apartment 4B</p>
                      <p className="text-sm text-gray-600">Chennai, Tamil Nadu 600001</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <p className="text-sm text-gray-600">{deliverySlots.find(s => s.id === selectedDeliverySlot)?.display}</p>
                  </div>
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-700 mb-3">Payment Method</h3>
                <div className="flex items-center gap-2">
                  {paymentMethod === 'online' ? (
                    <>
                      <CreditCard className="w-5 h-5 text-gray-500" />
                      <p className="text-sm text-gray-600">Online Payment</p>
                    </>
                  ) : (
                    <>
                      <Truck className="w-5 h-5 text-gray-500" />
                      <p className="text-sm text-gray-600">Cash on Delivery</p>
                    </>
                  )}
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-700 mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-sm">{formatPrice(subtotal)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Delivery Fee</p>
                    <p className="text-sm">{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</p>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600">Discount</p>
                      <p className="text-sm text-green-600">-{formatPrice(discount)}</p>
                    </div>
                  )}
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <p>Total</p>
                    <p className="text-blue-600">{formatPrice(total)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCheckoutStep(3)}
              >
                Back
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isProcessing}
                onClick={handlePlaceOrder}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </div>
        )}
        
        {/* Order Summary (fixed for all steps) */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-600">Subtotal ({cartItems.length} items)</p>
              <p>{formatPrice(subtotal)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Delivery Fee</p>
              <p>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</p>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <p className="text-gray-600">Discount</p>
                <p className="text-green-600">-{formatPrice(discount)}</p>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <p>Total</p>
              <p className="text-blue-600">{formatPrice(total)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
