"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AccountLayout } from "@/components/account/AccountLayout";
import MobileAccountPage from "./mobile-page";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { ImprovedEditProfileDialog } from "@/components/account/ImprovedEditProfileDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Lock, User as UserIcon } from "lucide-react";

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

export default function AccountPage() {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { user, isAuthenticated, loading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [editField, setEditField] = useState<'name' | 'email' | 'phoneNumber' | 'password' | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setIsRedirecting(true);
      router.push('/auth/login?redirect=/account');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle edit button clicks
  const handleEdit = (field: 'name' | 'email' | 'phoneNumber' | 'password') => {
    setEditField(field);
    setIsDialogOpen(true);
  };

  // If not mounted yet, return null to prevent hydration errors
  if (!isMounted) return null;
  
  // Render mobile layout on small screens
  if (isMobile) {
    return <MobileAccountPage />;
  }
  
  // Render desktop layout on larger screens
  return (
    <AccountLayout 
      title="My Account" 
      description="View and manage your account information"
    >
      <div className="space-y-6">
        {/* Personal Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center mb-3 sm:mb-0">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <UserIcon className="h-5 w-5 text-tendercuts-red" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="font-medium">{user?.name || "Not provided"}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-tendercuts-red border-red-200 hover:bg-red-50"
                onClick={() => handleEdit('name')}
              >
                Edit
              </Button>
            </div>

            {/* Email */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center mb-3 sm:mb-0">
                <div className="bg-red-50 p-2 rounded-full mr-3">
                  <Mail className="h-5 w-5 text-tendercuts-red" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <p className="font-medium">{user?.email || "Not provided"}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-tendercuts-red border-red-200 hover:bg-red-50"
                onClick={() => handleEdit('email')}
              >
                Edit
              </Button>
            </div>

            {/* Phone */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center mb-3 sm:mb-0">
                <div className="bg-red-50 p-2 rounded-full mr-3">
                  <Phone className="h-5 w-5 text-tendercuts-red" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <p className="font-medium">+91 {user?.phoneNumber || "XXXXXXXXXX"}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-tendercuts-red border-red-200 hover:bg-red-50"
                onClick={() => handleEdit('phoneNumber')}
              >
                Edit
              </Button>
            </div>

            {/* Password */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center mb-3 sm:mb-0">
                <div className="bg-red-50 p-2 rounded-full mr-3">
                  <Lock className="h-5 w-5 text-tendercuts-red" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Password</p>
                  <p className="font-medium">••••••••</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-tendercuts-red border-red-200 hover:bg-red-50"
                onClick={() => handleEdit('password')}
              >
                Change
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Activity Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Login</p>
                  <p className="font-medium">Today, 3:45 PM</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-500">Account Created</p>
                  <p className="font-medium">May 15, 2025</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Dialog */}
      {editField && (
        <ImprovedEditProfileDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          fieldToEdit={editField}
        />
      )}
    </AccountLayout>
  );
}
