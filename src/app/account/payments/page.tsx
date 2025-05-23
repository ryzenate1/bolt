import { CreditCard, Plus, Trash2, Wallet, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type PaymentMethod = {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  lastFour?: string;
  cardType?: string;
  upiId?: string;
  bankName?: string;
  isDefault: boolean;
  expiry?: string;
};

export default function PaymentsPage() {
  // This would come from your context/API in a real app
  const paymentMethods: PaymentMethod[] = [
    {
      id: "1",
      type: "card",
      lastFour: "4242",
      cardType: "Visa",
      isDefault: true,
      expiry: "12/25"
    },
    {
      id: "2",
      type: "upi",
      upiId: "user@upi",
      isDefault: false
    }
  ];

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="h-5 w-5 text-tendercuts-red" />;
      case 'upi':
        return <div className="bg-tendercuts-red/10 p-1 rounded">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="#e53e3e">
            <path d="M10.5 15H8v-3h2.5V9.5h3V12H16v3h-2.5v2.5h-3V15z"></path>
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"></path>
          </svg>
        </div>;
      case 'netbanking':
        return <svg className="h-5 w-5 text-tendercuts-red" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
          <path d="M12.31 11.14c.38-.31.65-.76.65-1.24 0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5c0 .48.27.93.66 1.24-1.3.7-2.16 2.06-2.16 3.61v.5h6v-.5c0-1.55-.86-2.91-2.15-3.61z"></path>
        </svg>;
      case 'wallet':
        return <Wallet className="h-5 w-5 text-tendercuts-red" />;
      default:
        return <CreditCard className="h-5 w-5 text-tendercuts-red" />;
    }
  };

  const formatPaymentMethod = (method: PaymentMethod) => {
    switch (method.type) {
      case 'card':
        return `•••• •••• •••• ${method.lastFour}`;
      case 'upi':
        return method.upiId || 'UPI ID';
      case 'netbanking':
        return method.bankName || 'Net Banking';
      case 'wallet':
        return 'Wallet';
      default:
        return 'Payment Method';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Payment Methods</h1>
          <p className="text-gray-500">Manage your saved payment methods</p>
        </div>
        <Button className="bg-tendercuts-red hover:bg-tendercuts-red/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Payment Method
        </Button>
      </div>

      <div className="space-y-4 mb-8">
        {paymentMethods.map((method) => (
          <div key={method.id} className="bg-white rounded-lg shadow-sm border p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gray-50 rounded-lg">
                {getPaymentMethodIcon(method.type)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{formatPaymentMethod(method)}</span>
                  {method.isDefault && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                {method.type === 'card' && method.expiry && (
                  <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!method.isDefault && (
                <Button variant="ghost" size="sm" className="text-tendercuts-red">
                  Set as default
                </Button>
              )}
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Payment Method</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="border-2 border-gray-200 rounded-lg p-4 hover:border-tendercuts-red transition-colors flex flex-col items-center justify-center h-full">
            <div className="bg-tendercuts-red/10 p-3 rounded-full mb-2">
              <CreditCard className="h-6 w-6 text-tendercuts-red" />
            </div>
            <span className="font-medium">Credit/Debit Card</span>
          </button>
          
          <button className="border-2 border-gray-200 rounded-lg p-4 hover:border-tendercuts-red transition-colors flex flex-col items-center justify-center h-full">
            <div className="bg-tendercuts-red/10 p-3 rounded-full mb-2">
              <div className="h-6 w-6 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="#e53e3e">
                  <path d="M10.5 15H8v-3h2.5V9.5h3V12H16v3h-2.5v2.5h-3V15z"></path>
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"></path>
                </svg>
              </div>
            </div>
            <span className="font-medium">UPI</span>
          </button>
          
          <button className="border-2 border-gray-200 rounded-lg p-4 hover:border-tendercuts-red transition-colors flex flex-col items-center justify-center h-full">
            <div className="bg-tendercuts-red/10 p-3 rounded-full mb-2">
              <Wallet className="h-6 w-6 text-tendercuts-red" />
            </div>
            <span className="font-medium">Wallets</span>
          </button>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              For your security, we don't store your full card details. Your payment information is encrypted and securely processed by our payment partners.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <div className="text-center py-12">
          <Clock className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No transactions yet</h3>
          <p className="mt-1 text-gray-500">Your transaction history will appear here</p>
          <Link href="/category/fish-combo" className="mt-6 inline-block">
            <Button className="bg-tendercuts-red hover:bg-tendercuts-red/90">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
