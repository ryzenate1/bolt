"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AccountLayout } from "@/components/account/AccountLayout";
import { Button } from "@/components/ui/button";
import { Clock, Package, RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";
import MobileOrdersPage from "./mobile-page";

// Custom hook for media queries
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      setMatches(media.matches);
      
      const listener = (e: MediaQueryListEvent) => {
        setMatches(e.matches);
      };
      
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
    return undefined;
  }, [query]);

  return matches;
};

export default function OrdersPage() {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { user, isAuthenticated, loading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setIsRedirecting(true);
      router.push('/auth/login?redirect=/account/orders');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading state while checking authentication or redirecting
  if (loading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-tendercuts-red" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }
  
  // If authenticated and on mobile
  if (isMobile) {
    return <MobileOrdersPage />;
  }

  // Desktop version
  return (
    <AccountLayout title="My Orders">
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Orders</h1>
            <p className="text-gray-500">View and manage your orders</p>
          </div>
          <Link href="/category/fish-combo">
            <Button className="bg-tendercuts-red hover:bg-tendercuts-red/90">
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-gray-500">You haven't placed any orders yet.</p>
            <Link href="/category/fish-combo" className="mt-6 inline-block">
              <Button className="bg-tendercuts-red hover:bg-tendercuts-red/90">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
