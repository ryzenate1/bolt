'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Plus, Trash2, Wallet, Clock, AlertCircle, 
  Edit, Check, X, Eye, EyeOff, Shield, History,
  ChevronRight, Star, Calendar, DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast-notification";
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion';

// Types
type PaymentMethod = {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  lastFour?: string;
  cardType?: 'Visa' | 'Mastercard' | 'Rupay' | 'Amex';
  upiId?: string;
  bankName?: string;
  walletType?: 'Paytm' | 'PhonePe' | 'GooglePay' | 'AmazonPay';
  isDefault: boolean;
  expiry?: string;
  holderName?: string;
  nickname?: string;
  addedDate: string;
  lastUsed?: string;
};

type Transaction = {
  id: string;
  paymentMethodId: string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  date: string;
  orderId: string;
  description: string;
  refunded?: boolean;
};

// Mock user context - replace with actual auth context
const useUser = () => {
  const [user, setUser] = useState({
    id: 'user_123',
    name: 'John Doe',
    email: 'john@example.com',
    isLoggedIn: true
  });
  return { user, setUser };
};

// Payment methods context/storage
const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulate API calls
  useEffect(() => {
    const loadData = async () => {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock payment methods
      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: "pm_1",
          type: "card",
          lastFour: "4242",
          cardType: "Visa",
          holderName: "John Doe",
          isDefault: true,
          expiry: "12/25",
          nickname: "My Visa Card",
          addedDate: "2024-01-15",
          lastUsed: "2024-05-20"
        },
        {
          id: "pm_2",
          type: "upi",
          upiId: "john@paytm",
          isDefault: false,
          nickname: "Paytm UPI",
          addedDate: "2024-02-10",
          lastUsed: "2024-05-18"
        },
        {
          id: "pm_3",
          type: "wallet",
          walletType: "PhonePe",
          isDefault: false,
          nickname: "PhonePe Wallet",
          addedDate: "2024-03-05"
        }
      ];

      // Mock transactions
      const mockTransactions: Transaction[] = [
        {
          id: "txn_1",
          paymentMethodId: "pm_1",
          amount: 1250,
          status: "success",
          date: "2024-05-20",
          orderId: "ORD_123",
          description: "Fresh Fish Order - King Fish, Sankara Fish"
        },
        {
          id: "txn_2",
          paymentMethodId: "pm_2",
          amount: 850,
          status: "success",
          date: "2024-05-18",
          orderId: "ORD_122",
          description: "Fresh Fish Order - Mathi Fish, Nethili Fish"
        },
        {
          id: "txn_3",
          paymentMethodId: "pm_1",
          amount: 2100,
          status: "failed",
          date: "2024-05-15",
          orderId: "ORD_121",
          description: "Premium Fish Combo"
        }
      ];

      setPaymentMethods(mockPaymentMethods);
      setTransactions(mockTransactions);
      setLoading(false);
    };

    loadData();
  }, []);

  const addPaymentMethod = async (method: Omit<PaymentMethod, 'id' | 'addedDate'>) => {
    const newMethod: PaymentMethod = {
      ...method,
      id: `pm_${Date.now()}`,
      addedDate: new Date().toISOString().split('T')[0]
    };
    setPaymentMethods(prev => [...prev, newMethod]);
    return newMethod;
  };

  const removePaymentMethod = async (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  const setDefaultPaymentMethod = async (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const updatePaymentMethod = async (id: string, updates: Partial<PaymentMethod>) => {
    setPaymentMethods(prev =>
      prev.map(method =>
        method.id === id ? { ...method, ...updates } : method
      )
    );
  };

  return {
    paymentMethods,
    transactions,
    loading,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    updatePaymentMethod
  };
};

// Add Payment Method Modal
const AddPaymentMethodModal = ({ isOpen, onClose, onAdd, type }: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (method: any) => void;
  type: 'card' | 'upi' | 'wallet';
}) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: '',
    upiId: '',
    walletType: 'Paytm',
    nickname: '',
    setAsDefault: false
  });
  const [showCvv, setShowCvv] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let paymentMethod: any = {
        type,
        isDefault: formData.setAsDefault,
        nickname: formData.nickname
      };

      if (type === 'card') {
        paymentMethod = {
          ...paymentMethod,
          lastFour: formData.cardNumber.slice(-4),
          cardType: getCardType(formData.cardNumber),
          expiry: `${formData.expiryMonth}/${formData.expiryYear}`,
          holderName: formData.holderName
        };
      } else if (type === 'upi') {
        paymentMethod = {
          ...paymentMethod,
          upiId: formData.upiId
        };
      } else if (type === 'wallet') {
        paymentMethod = {
          ...paymentMethod,
          walletType: formData.walletType
        };
      }

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      await onAdd(paymentMethod);
      
      showToast({
        message: "Your payment method has been successfully added.",
        type: 'success'
      });
      
      onClose();
      setFormData({
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        holderName: '',
        upiId: '',
        walletType: 'Paytm',
        nickname: '',
        setAsDefault: false
      });
    } catch (error) {
showToast({
        message: "Failed to add payment method. Please try again.",
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const getCardType = (number: string): 'Visa' | 'Mastercard' | 'Rupay' | 'Amex' => {
    const firstDigit = number.charAt(0);
    if (firstDigit === '4') return 'Visa';
    if (firstDigit === '5') return 'Mastercard';
    if (firstDigit === '6') return 'Rupay';
    if (firstDigit === '3') return 'Amex';
    return 'Visa';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              Add {type === 'card' ? 'Card' : type === 'upi' ? 'UPI' : 'Wallet'}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'card' && (
              <>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                      setFormData({...formData, cardNumber: value});
                    }}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="expiryMonth">Month</Label>
                    <Input
                      id="expiryMonth"
                      type="text"
                      placeholder="MM"
                      maxLength={2}
                      value={formData.expiryMonth}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setFormData({...formData, expiryMonth: value});
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiryYear">Year</Label>
                    <Input
                      id="expiryYear"
                      type="text"
                      placeholder="YY"
                      maxLength={2}
                      value={formData.expiryYear}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setFormData({...formData, expiryYear: value});
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <div className="relative">
                      <Input
                        id="cvv"
                        type={showCvv ? "text" : "password"}
                        placeholder="123"
                        maxLength={4}
                        value={formData.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setFormData({...formData, cvv: value});
                        }}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowCvv(!showCvv)}
                      >
                        {showCvv ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="holderName">Cardholder Name</Label>
                  <Input
                    id="holderName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.holderName}
                    onChange={(e) => setFormData({...formData, holderName: e.target.value})}
                    required
                  />
                </div>
              </>
            )}

            {type === 'upi' && (
              <div>
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  type="text"
                  placeholder="yourname@upi"
                  value={formData.upiId}
                  onChange={(e) => setFormData({...formData, upiId: e.target.value})}
                  required
                />
              </div>
            )}

            {type === 'wallet' && (
              <div>
                <Label htmlFor="walletType">Wallet Type</Label>
                <select
                  id="walletType"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.walletType}
                  onChange={(e) => setFormData({...formData, walletType: e.target.value})}
                  required
                >
                  <option value="Paytm">Paytm</option>
                  <option value="PhonePe">PhonePe</option>
                  <option value="GooglePay">Google Pay</option>
                  <option value="AmazonPay">Amazon Pay</option>
                </select>
              </div>
            )}

            <div>
              <Label htmlFor="nickname">Nickname (Optional)</Label>
              <Input
                id="nickname"
                type="text"
                placeholder="My primary card"
                value={formData.nickname}
                onChange={(e) => setFormData({...formData, nickname: e.target.value})}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="setAsDefault"
                checked={formData.setAsDefault}
                onChange={(e) => setFormData({...formData, setAsDefault: e.target.checked})}
                className="rounded border-gray-300"
              />
              <Label htmlFor="setAsDefault">Set as default payment method</Label>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700">
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Adding...
                  </>
                ) : (
                  'Add Payment Method'
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// Payment Method Card Component
const PaymentMethodCard = ({ method, onSetDefault, onRemove, onUpdate }: {
  method: PaymentMethod;
  onSetDefault: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<PaymentMethod>) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(method.nickname || '');
  const { showToast } = useToast();

  const getPaymentMethodIcon = (type: string, cardType?: string) => {
    switch (type) {
      case 'card':
        return (
          <div className={`p-2 rounded-lg ${
            cardType === 'Visa' ? 'bg-blue-100' :
            cardType === 'Mastercard' ? 'bg-red-100' :
            cardType === 'Rupay' ? 'bg-green-100' :
            'bg-purple-100'
          }`}>
            <CreditCard className={`h-5 w-5 ${
              cardType === 'Visa' ? 'text-blue-600' :
              cardType === 'Mastercard' ? 'text-red-600' :
              cardType === 'Rupay' ? 'text-green-600' :
              'text-purple-600'
            }`} />
          </div>
        );
      case 'upi':
        return (
          <div className="bg-orange-100 p-2 rounded-lg">
            <div className="h-5 w-5 flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#ea580c">
                <path d="M10.5 15H8v-3h2.5V9.5h3V12H16v3h-2.5v2.5h-3V15z"></path>
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"></path>
              </svg>
            </div>
          </div>
        );
      case 'wallet':
        return (
          <div className="bg-purple-100 p-2 rounded-lg">
            <Wallet className="h-5 w-5 text-purple-600" />
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 p-2 rounded-lg">
            <CreditCard className="h-5 w-5 text-gray-600" />
          </div>
        );
    }
  };

  const formatPaymentMethod = (method: PaymentMethod) => {
    switch (method.type) {
      case 'card':
        return `${method.cardType} •••• ${method.lastFour}`;
      case 'upi':
        return method.upiId || 'UPI ID';
      case 'wallet':
        return `${method.walletType} Wallet`;
      default:
        return 'Payment Method';
    }
  };

  const handleSaveNickname = () => {
    onUpdate(method.id, { nickname });
    setIsEditing(false);
    showToast({
      message: "Payment method nickname updated successfully.",
      type: 'success'
    });
  };

  const handleRemove = () => {
    if (method.isDefault) {
      showToast({
        message: "Cannot remove default payment method. Set another as default first.",
        type: 'error'
      });
      return;
    }
    
    onRemove(method.id);
    showToast({
      message: "Payment method removed successfully.",
      type: 'success'
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-4 flex-1">
          {getPaymentMethodIcon(method.type, method.cardType)}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-gray-900">
                {formatPaymentMethod(method)}
              </span>
              {method.isDefault && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Default
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              {method.type === 'card' && method.expiry && (
                <span>Expires {method.expiry}</span>
              )}
              {method.type === 'card' && method.holderName && (
                <>
                  <span>•</span>
                  <span>{method.holderName}</span>
                </>
              )}
              {method.lastUsed && (
                <>
                  <span>•</span>
                  <span>Last used {new Date(method.lastUsed).toLocaleDateString()}</span>
                </>
              )}
            </div>

            <div className="mt-2">
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Enter nickname"
                    className="text-sm h-8"
                  />
                  <Button size="sm" onClick={handleSaveNickname}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {method.nickname || 'No nickname'}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                    className="h-6 px-2"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!method.isDefault && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSetDefault(method.id)}
              className="text-red-600 hover:text-red-700"
            >
              Set as default
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Transaction History Component
const TransactionHistory = ({ transactions, paymentMethods }: {
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];
}) => {
  const getPaymentMethodName = (paymentMethodId: string) => {
    const method = paymentMethods.find(pm => pm.id === paymentMethodId);
    if (!method) return 'Unknown';
    
    switch (method.type) {
      case 'card':
        return `${method.cardType} •••${method.lastFour}`;
      case 'upi':
        return method.upiId;
      case 'wallet':
        return `${method.walletType} Wallet`;
      default:
        return 'Payment Method';
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <History className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No transactions yet</h3>
        <p className="mt-1 text-gray-500">Your transaction history will appear here</p>
        <Link href="/category/fish-combo" className="mt-6 inline-block">
          <Button className="bg-red-600 hover:bg-red-700">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <motion.div
          key={transaction.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${
              transaction.status === 'success' ? 'bg-green-100' :
              transaction.status === 'failed' ? 'bg-red-100' :
              'bg-yellow-100'
            }`}>
              {transaction.status === 'success' ? (
                <Check className={`h-5 w-5 text-green-600`} />
              ) : transaction.status === 'failed' ? (
                <X className={`h-5 w-5 text-red-600`} />
              ) : (
                <Clock className={`h-5 w-5 text-yellow-600`} />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">
                  {formatPrice(transaction.amount)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  transaction.status === 'success' ? 'bg-green-100 text-green-800' :
                  transaction.status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600">{transaction.description}</p>
              <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                <span>{getPaymentMethodName(transaction.paymentMethodId)}</span>
                <span>•</span>
                <span>{new Date(transaction.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>Order #{transaction.orderId}</span>
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </motion.div>
      ))}
    </div>
  );
};

// Main Payments Page Component
export default function PaymentsPage() {
  const { user } = useUser();
  const {
    paymentMethods,
    transactions,
    loading,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    updatePaymentMethod
  } = usePaymentMethods();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState<'card' | 'upi' | 'wallet'>('card');
  const [activeTab, setActiveTab] = useState<'methods' | 'history'>('methods');

  if (!user.isLoggedIn) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-16">
        <Shield className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h2>
        <p className="text-gray-600 mb-6">Please log in to manage your payment methods</p>
        <Link href="/login">
          <Button className="bg-red-600 hover:bg-red-700">
            Login to Continue
          </Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-gray-600">Manage your saved payment methods securely</p>
        </div>
        <Button 
          onClick={() => {
            setAddModalType('card');
            setShowAddModal(true);
          }}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Payment Method
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('methods')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            activeTab === 'methods' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Payment Methods
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            activeTab === 'history'
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Transaction History
        </button>
      </div>

      {activeTab === 'methods' ? (
        <div className="space-y-4">
          {paymentMethods.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No payment methods</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a payment method.</p>
              <div className="mt-6">
                <Button
                  onClick={() => {
                    setAddModalType('card');
                    setShowAddModal(true);
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {paymentMethods.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  method={method}
                  onSetDefault={setDefaultPaymentMethod}
                  onRemove={removePaymentMethod}
                  onUpdate={updatePaymentMethod}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <TransactionHistory 
          transactions={transactions} 
          paymentMethods={paymentMethods} 
        />
      )}

      <AddPaymentMethodModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addPaymentMethod}
        type={addModalType}
      />
    </div>
  );
}