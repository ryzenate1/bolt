"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Package, RefreshCw, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

// Define order type
interface Order {
  id: string;
  date: string;
  status: 'Delivered' | 'Processing' | 'Shipped';
  total: number;
  items: number;
}

// Mock orders for development
const mockOrders: Order[] = [
  // Empty for now - will show empty state
];

export default function MobileOrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  // Ensure user is redirected if not authenticated
  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      router.push('/auth/login?redirect=/account/orders');
    } else {
      // Simulate loading data
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tendercuts-red"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-md pb-20">
      <div className="sticky top-0 z-10 bg-white p-4 border-b flex items-center">
        <BackButton href="/account" />
        <h1 className="text-xl font-bold ml-4">My Orders</h1>
      </div>

      {mockOrders.length === 0 ? (
        <motion.div 
          className="flex flex-col items-center justify-center mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Package className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
          <p className="mt-1 text-gray-500 mb-6">You haven't placed any orders yet.</p>
          <Link href="/category/fish-combo">
            <Button className="bg-tendercuts-red hover:bg-tendercuts-red/90">
              Start Shopping
            </Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          className="space-y-4 mt-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {mockOrders.map((order, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Order #{order.id}</h3>
                      <p className="text-sm text-gray-500 mt-1">{order.date}</p>
                      <div className="flex items-center mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{order.total}</p>
                      <p className="text-xs text-gray-500 mt-1">{order.items} items</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                    <Button variant="outline" size="sm" className="text-xs">
                      Track Order
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs flex items-center">
                      View Details
                      <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
