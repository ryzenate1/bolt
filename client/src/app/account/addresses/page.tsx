"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function AddressesPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.push('/auth/login?redirect=/account/addresses/improved');
      } else if (!isRedirecting) {
        // Only redirect once
        setIsRedirecting(true);
        router.push('/account/addresses/improved');
      }
    }
  }, [isAuthenticated, loading, router, isRedirecting]);

  // Show loading state while redirecting
  if (loading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-tendercuts-red" />
          <p className="text-gray-600">Loading your addresses...</p>
        </div>
      </div>
    );
  }

  // Fallback in case of any issues with redirection
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">Unable to load addresses. Please try again.</p>
        <Button onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
    </div>
  );
}
