"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AccountLayout } from "@/components/account/AccountLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Edit, Trash, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast-notification";
import MobileAddressesPage from "./mobile-page";
import { AddressFormDialog, Address } from "@/components/account/AddressFormDialog";

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

// Mock addresses for development
const mockAddresses: Address[] = [
  {
    id: "1",
    name: "Home",
    address: "123 Main Street, Apartment 4B",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600001",
    isDefault: true
  },
  {
    id: "2",
    name: "Office",
    address: "456 Business Park, Tower 2, Floor 5",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600002",
    isDefault: false
  }
];

export default function AddressesPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [addresses, setAddresses] = useState(mockAddresses);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Handle hydration mismatch by only rendering after component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(address => ({
      ...address,
      isDefault: address.id === id
    })));
    
    showToast({
      message: "Default address updated successfully",
      type: "success"
    });
  };

  const handleDeleteAddress = (id: string | undefined) => {
    if (!id) return;
    
    setAddresses(addresses.filter(address => address.id !== id));
    
    showToast({
      message: "Address deleted successfully",
      type: "success"
    });
  };
  
  const handleEditAddress = (address: Address) => {
    // Make a deep copy of the address to avoid reference issues
    setAddressToEdit({...address});
    setIsAddingAddress(true);
  };
  
  const handleSaveAddress = (address: Address) => {
    if (addressToEdit) {
      // Update existing address
      setAddresses(addresses.map(a => 
        a.id === address.id ? address : a
      ));
      
      showToast({
        message: "Address updated successfully",
        type: "success"
      });
    } else {
      // Add new address
      // If this is the first address or marked as default, make it the default
      if (addresses.length === 0 || address.isDefault) {
        // Make this address the default and ensure no other address is default
        setAddresses([
          ...addresses.map(a => ({ ...a, isDefault: false })),
          { ...address, isDefault: true }
        ]);
      } else {
        // Just add the new address
        setAddresses([...addresses, address]);
      }
      
      showToast({
        message: "New address added successfully",
        type: "success"
      });
    }
    
    // Reset the editing state
    setAddressToEdit(null);
  };

  // If not mounted yet, return null to prevent hydration errors
  if (!isMounted) return null;
  
  // Render mobile layout on small screens
  if (isMobile) {
    return (
      <MobileAddressesPage 
        addresses={addresses} 
        setAddresses={setAddresses}
        isAddingAddress={isAddingAddress}
        setIsAddingAddress={setIsAddingAddress}
        addressToEdit={addressToEdit}
        setAddressToEdit={setAddressToEdit}
        onSaveAddress={handleSaveAddress}
      />
    );
  }
  
  // Render desktop layout on larger screens
  return (
    <AccountLayout 
      title="Saved Addresses" 
      description="Manage your delivery addresses"
    >
      <div className="space-y-6">
        {/* Add Address Button */}
        <div className="flex justify-end">
          <Button 
            onClick={() => setIsAddingAddress(true)}
            className="bg-tendercuts-red hover:bg-tendercuts-red-dark"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Address
          </Button>
        </div>

        {addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address, index) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={`overflow-hidden ${address.isDefault ? 'border-red-300 bg-red-50' : ''}`}>
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 text-tendercuts-red mr-2" />
                          <h3 className="font-medium">{address.name}</h3>
                        </div>
                        {address.isDefault && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-tendercuts-red">
                            Default
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-3 text-gray-600">
                        <p>{address.address}</p>
                        <p>{address.city}, {address.state} - {address.pincode}</p>
                      </div>
                    </div>
                    
                    <div className="border-t px-4 py-3 bg-gray-50 flex justify-between">
                      <div className="space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditAddress(address)}
                        >
                          <Edit className="h-4 w-4 mr-1" aria-hidden="true" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                      
                      {!address.isDefault && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-tendercuts-red"
                          onClick={() => handleSetDefault(address.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Set as Default
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="bg-gray-100 p-3 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No addresses saved</h3>
              <p className="text-gray-500 mt-1">Add a new address to get started</p>
              <Button 
                className="mt-6 bg-tendercuts-red hover:bg-tendercuts-red-dark"
                onClick={() => setIsAddingAddress(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Address
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Address Form Dialog */}
      <AddressFormDialog
        open={isAddingAddress}
        onOpenChange={(open) => {
          setIsAddingAddress(open);
          if (!open) setAddressToEdit(null);
        }}
        addressToEdit={addressToEdit}
        onSave={handleSaveAddress}
      />
    </AccountLayout>
  );
}
