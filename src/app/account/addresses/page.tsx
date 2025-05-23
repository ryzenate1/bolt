"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";
import Link from "next/link";
import dynamic from 'next/dynamic';

// Import the Address type if it exists, or define it here if not
interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

// Dynamically import the AddressCard component with SSR disabled
const AddressCard = dynamic<{ 
  address: Address; 
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}>(() => import('@/components/address/AddressCard').then(mod => ({ default: mod.AddressCard })), {
  ssr: false,
  loading: () => <div className="w-full h-40 bg-gray-100 rounded-lg animate-pulse"></div>
});

// Define the AddressFormDialog props interface
interface AddressFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: Address;
  onSave: (data: any) => void;
}

// Dynamically import the AddressFormDialog component with SSR disabled
const AddressFormDialog = dynamic<AddressFormDialogProps>(
  () => import('@/components/address/AddressFormDialog').then(mod => ({ default: mod.AddressFormDialog })),
  { 
    ssr: false,
    loading: () => null
  }
);

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "Home",
      address: "123 Main St, Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      isDefault: true,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined);

  const handleSaveAddress = (data: any) => {
    if (editingAddress) {
      // Update existing address
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id ? { ...data, id: editingAddress.id } : addr
      ));
    } else {
      // Add new address
      const newAddress = {
        ...data,
        id: Date.now().toString(),
        isDefault: addresses.length === 0 // Set as default if it's the first address
      };
      setAddresses([...addresses, newAddress]);
    }
    setIsDialogOpen(false);
    setEditingAddress(undefined);
  };

  const handleEdit = (id: string) => {
    const addressToEdit = addresses.find(addr => addr.id === id);
    if (addressToEdit) {
      setEditingAddress(addressToEdit);
      setIsDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Saved Addresses</h1>
          <p className="text-gray-500">Manage your delivery addresses</p>
        </div>
        <Button 
          className="bg-tendercuts-red hover:bg-tendercuts-red/90"
          onClick={() => {
            setEditingAddress(undefined);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Address
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div key={address.id} className="w-full">
            <AddressCard 
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          </div>
        ))}
      </div>

      {addresses.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <MapPin className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No saved addresses</h3>
          <p className="mt-1 text-gray-500">You haven't added any addresses yet.</p>
          <Button 
            className="mt-6 bg-tendercuts-red hover:bg-tendercuts-red/90"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Address
          </Button>
        </div>
      )}

      <AddressFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        address={editingAddress}
        onSave={handleSaveAddress}
      />
    </div>
  );
}
