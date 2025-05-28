'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, MapPin, X, Home, Briefcase, MapPinned } from 'lucide-react';
import { motion } from 'framer-motion';
import { BackButton } from '@/components/ui/back-button';

export interface Address {
  id?: string;
  type?: 'home' | 'work' | 'other';
  name: string;
  phoneNumber?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface AddressFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (address: Omit<Address, 'id'>) => void;
  address?: Address;
}

export const AddressFormDialog = ({ open, onOpenChange, onSave, address }: AddressFormDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | undefined>(
    address?.coordinates
  );
  const [step, setStep] = useState(1);
  const [addressType, setAddressType] = useState<'home' | 'work' | 'other'>(address?.type || 'home');

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<Omit<Address, 'id'>>({    
    defaultValues: {
      type: 'home',
      name: '',
      phoneNumber: '',
      address: '',
      city: '',
      state: 'Tamil Nadu',
      pincode: '',
      isDefault: false,
      coordinates: { lat: 0, lng: 0 },
      ...address
    }
  });

  const handleMapClick = (e: any) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setSelectedLocation({ lat, lng });
      
      // You could add reverse geocoding here to fill address fields
      console.log(`Selected location: ${lat}, ${lng}`);
      
      // Close the map modal
      setShowMap(false);
    }
  };

  const onSubmit = async (data: Omit<Address, 'id'>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave({
        ...data,
        coordinates: selectedLocation,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      const { id, ...rest } = address;
      reset({
        ...rest,
        address: rest.address || '',
        phoneNumber: rest.phoneNumber || '',
        type: rest.type || 'home',
      });
      if (rest.coordinates) {
        setSelectedLocation(rest.coordinates);
      }
    } else {
      reset({
        type: 'home',
        name: '',
        phoneNumber: '',
        address: '',
        city: '',
        state: 'Tamil Nadu',
        pincode: '',
        isDefault: false,
      });
      setSelectedLocation(undefined);
    }
  }, [address, open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg md:max-w-xl">
        <DialogHeader className="relative">
          {step > 1 && (
            <div className="absolute left-0 top-0">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => setStep(step - 1)}
                className="text-gray-500 hover:text-tendercuts-red"
              >
                <X className="h-4 w-4 mr-1" /> Back
              </Button>
            </div>
          )}
          <DialogTitle>{address ? 'Edit Address' : 'Add New Address'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <p className="text-gray-500">Choose address type</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {[{ type: 'home', icon: Home, label: 'Home' }, 
                  { type: 'work', icon: Briefcase, label: 'Work' }, 
                  { type: 'other', icon: MapPinned, label: 'Other' }].map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div 
                      key={item.type}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setAddressType(item.type as 'home' | 'work' | 'other');
                        setValue('type', item.type as 'home' | 'work' | 'other');
                        setStep(2);
                      }}
                      className={`cursor-pointer flex flex-col items-center justify-center p-4 rounded-lg border-2 ${addressType === item.type ? 'border-tendercuts-red bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <Icon className={`h-8 w-8 mb-2 ${addressType === item.type ? 'text-tendercuts-red' : 'text-gray-400'}`} />
                      <span className={`text-sm font-medium ${addressType === item.type ? 'text-tendercuts-red' : 'text-gray-700'}`}>{item.label}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  className="w-full"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <Input
                  id="phoneNumber"
                  placeholder="10-digit mobile number"
                  className="w-full"
                  {...register('phoneNumber', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit phone number',
                    },
                  })}
                />
                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
              </div>
              
              <Button 
                type="button" 
                onClick={() => setStep(3)} 
                className="w-full bg-tendercuts-red hover:bg-tendercuts-red/90"
              >
                Continue
              </Button>
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <button
                    type="button"
                    onClick={() => setShowMap(true)}
                    className="text-xs text-tendercuts-red hover:text-tendercuts-red/80 flex items-center"
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    Use map
                  </button>
                </div>
                <Input
                  id="address"
                  placeholder="House/Flat No., Building, Street"
                  className="w-full"
                  {...register('address', { required: 'Address is required' })}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <Input
                    id="city"
                    placeholder="City"
                    className="w-full"
                    {...register('city', { required: 'City is required' })}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Pincode</label>
                  <Input
                    id="pincode"
                    placeholder="6-digit pincode"
                    className="w-full"
                    {...register('pincode', { 
                      required: 'Pincode is required',
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: 'Please enter a valid 6-digit pincode',
                      },
                    })}
                  />
                  {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">State</label>
                <Input
                  id="state"
                  placeholder="State"
                  className="w-full"
                  defaultValue="Tamil Nadu"
                  {...register('state', { required: 'State is required' })}
                />
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
              </div>

              <div className="flex items-center pt-2">
                <input
                  id="isDefault"
                  type="checkbox"
                  className="h-4 w-4 text-tendercuts-red focus:ring-tendercuts-red rounded"
                  {...register('isDefault')}
                />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                  Set as default address
                </label>
              </div>
            </motion.div>
          )}
          
          <DialogFooter className="mt-6">
            {step === 3 && (
              <Button type="submit" className="w-full bg-tendercuts-red hover:bg-tendercuts-red/90" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Address'
                )}
              </Button>
            )}
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
