'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, MapPin, X } from 'lucide-react';

export type Address = {
  id?: string;
  type: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
};

type AddressFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (address: Omit<Address, 'id'>) => void;
  initialData?: Address;
};

export function AddressFormDialog({ open, onOpenChange, onSave, initialData }: AddressFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    initialData?.coordinates || null
  );

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<Omit<Address, 'id'>>({
    defaultValues: {
      type: 'home',
      name: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      landmark: '',
      city: '',
      state: 'Tamil Nadu',
      pincode: '',
      isDefault: false,
      coordinates: { lat: 0, lng: 0 },
      ...initialData
    }
  });

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setValue('coordinates', { lat, lng });
    setShowMap(false);
    // You could add reverse geocoding here to fill address fields
  };

  const onSubmit = (data: Omit<Address, 'id'>) => {
    onSave({
      ...data,
      coordinates: selectedLocation || { lat: 0, lng: 0 }
    });
  };

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setSelectedLocation(initialData.coordinates);
    } else {
      reset();
      setSelectedLocation(null);
    }
  }, [initialData, open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Address' : 'Add New Address'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
              <div className="flex gap-4">
                {(['home', 'work', 'other'] as const).map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="radio"
                      className="h-4 w-4 text-tendercuts-red focus:ring-tendercuts-red"
                      {...register('type', { required: true })}
                      value={type}
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <Input
                {...register('name', { required: 'Name is required' })}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <Input
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Please enter a valid 10-digit phone number'
                  }
                })}
                placeholder="Enter phone number"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <button
                  type="button"
                  onClick={() => setShowMap(true)}
                  className="text-sm text-tendercuts-red hover:text-tendercuts-red/80 flex items-center"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  {selectedLocation ? 'Change location' : 'Pin on map'}
                </button>
              </div>
              <Input
                {...register('addressLine1', { required: 'Address is required' })}
                placeholder="House/Flat No, Building Name"
              />
              {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1.message}</p>}
            </div>

            <div className="md:col-span-2">
              <Input
                {...register('addressLine2')}
                placeholder="Area, Street, Sector, Village"
                className="mt-2"
              />
            </div>

            <div className="md:col-span-2">
              <Input
                {...register('landmark')}
                placeholder="Landmark (Optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
              <Input
                {...register('pincode', {
                  required: 'Pincode is required',
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: 'Please enter a valid 6-digit pincode'
                  }
                })}
                placeholder="Pincode"
              />
              {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <Input
                {...register('city', { required: 'City is required' })}
                placeholder="City"
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <Input
                {...register('state', { required: 'State is required' })}
                placeholder="State"
              />
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
            </div>

            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="default-address"
                className="h-4 w-4 text-tendercuts-red focus:ring-tendercuts-red"
                {...register('isDefault')}
              />
              <label htmlFor="default-address" className="ml-2 text-sm text-gray-700">
                Set as default address
              </label>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Address'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      {/* Map Dialog */}
      <Dialog open={showMap} onOpenChange={setShowMap}>
        <DialogContent className="max-w-4xl h-[80vh] p-0">
          <div className="h-full flex flex-col">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Select Location</h3>
              <button
                onClick={() => setShowMap(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 relative">
              {/* Google Maps will be rendered here */}
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-tendercuts-red mx-auto mb-2" />
                  <p className="font-medium">Map will be displayed here</p>
                  <p className="text-sm text-gray-500 mt-1">Click on the map to select a location</p>
                </div>
              </div>
              
              {/* This is where you'd integrate Google Maps */}
              {/* <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={selectedLocation || { lat: 13.0827, lng: 80.2707 }} // Default to Chennai
                zoom={15}
                onClick={(e) => {
                  if (e.latLng) {
                    handleLocationSelect(e.latLng.lat(), e.latLng.lng());
                  }
                }}
              >
                {selectedLocation && (
                  <Marker
                    position={{
                      lat: selectedLocation.lat,
                      lng: selectedLocation.lng,
                    }}
                  />
                )}
              </GoogleMap> */}
            </div>
            <div className="border-t p-4 flex justify-end">
              <Button
                type="button"
                onClick={() => setShowMap(false)}
                disabled={!selectedLocation}
              >
                Confirm Location
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
