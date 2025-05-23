'use client';

import { MapPin, Home, Briefcase, MapPinIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Address } from './AddressFormDialog';

type AddressCardProps = {
  address: Address;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
};

const getAddressTypeIcon = (type: string) => {
  switch (type) {
    case 'home':
      return <Home className="h-4 w-4 mr-1" />;
    case 'work':
      return <Briefcase className="h-4 w-4 mr-1" />;
    default:
      return <MapPinIcon className="h-4 w-4 mr-1" />;
  }
};

export function AddressCard({ address, isSelected, onSelect, onEdit }: AddressCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 transition-colors ${
        isSelected ? 'border-tendercuts-red' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start">
        <input
          id={`address-${address.id}`}
          type="radio"
          className="mt-1 h-4 w-4 text-tendercuts-red focus:ring-tendercuts-red"
          checked={isSelected}
          onChange={onSelect}
        />
        
        <div className="ml-3 flex-1">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <span className="font-medium text-gray-800 capitalize">
                {getAddressTypeIcon(address.type)}
                {address.type}
              </span>
              {address.isDefault && (
                <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                  Default
                </span>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-tendercuts-red hover:text-tendercuts-red/80 p-1 h-auto"
              onClick={onEdit}
            >
              Edit
            </Button>
          </div>
          
          <div className="mt-1 space-y-1">
            <p className="text-gray-600">{address.name}</p>
            <p className="text-gray-600">{address.phone}</p>
            <p className="text-gray-600">{address.addressLine1}</p>
            {address.addressLine2 && <p className="text-gray-600">{address.addressLine2}</p>}
            <div className="flex flex-wrap gap-x-2">
              {address.landmark && <span className="text-gray-600">{address.landmark},</span>}
              <span className="text-gray-600">{address.city},</span>
              <span className="text-gray-600">{address.state} - {address.pincode}</span>
            </div>
          </div>
          
          {isSelected && address.coordinates?.lat && address.coordinates?.lng && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <a
                href={`https://www.google.com/maps?q=${address.coordinates.lat},${address.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-tendercuts-red hover:text-tendercuts-red/80"
              >
                <MapPin className="h-4 w-4 mr-1" />
                View on Map
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
