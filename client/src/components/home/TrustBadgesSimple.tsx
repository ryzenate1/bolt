'use client';

import React from 'react';
import { Fish, Anchor, Waves, Shield, Clock, Tag } from 'lucide-react';

// Simple fallback component for when the main TrustBadges component fails
const TrustBadgesSimple = () => {
  const defaultFishCards = [
    {
      id: 'seer',
      name: 'Seer Fish (Vanjaram)',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop',
      category: 'Premium',
      price: 899,
      description: 'Rich in omega-3, perfect for grilling'
    },
    {
      id: 'prawns',
      name: 'Tiger Prawns',
      image: 'https://images.unsplash.com/photo-1565680018093-ebb6b9ab5460?q=80&w=2070&auto=format&fit=crop',
      category: 'Shellfish',
      price: 599,
      description: 'Juicy and flavorful, great for curries'
    },
    {
      id: 'salmon',
      name: 'Indian Salmon',
      image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=2069&auto=format&fit=crop',
      category: 'Premium',
      price: 1299,
      description: 'Rich in omega-3, perfect for grilling'
    },
    {
      id: 'pomfret',
      name: 'White Pomfret',
      image: 'https://images.unsplash.com/photo-1605651377861-348620a3faae?q=80&w=2070&auto=format&fit=crop',
      category: 'Premium',
      price: 1099,
      description: 'Delicate white flesh, great for frying'
    }
  ];

  const trustBadges = [
    {
      id: 'fssai',
      icon: <Shield className="w-5 h-5 text-green-600" />,
      title: 'FSSAI Certified',
      description: 'Meets food safety standards'
    },
    {
      id: 'fresh',
      icon: <Clock className="w-5 h-5 text-blue-600" />,
      title: 'Same Day Delivery',
      description: 'Fresh from the ocean to your door'
    },
    {
      id: 'price',
      icon: <Tag className="w-5 h-5 text-purple-600" />,
      title: 'Best Price Guarantee',
      description: 'Quality seafood at competitive prices'
    }
  ];

  return (
    <div className="py-8 px-4 bg-gradient-to-b from-blue-50 to-teal-50 rounded-xl">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Fresh Seafood Collection
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Premium quality fish sourced daily from local fishermen, delivered fresh to your doorstep
          </p>
        </div>

        {/* Simplified cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {defaultFishCards.map((card) => (
            <div 
              key={card.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-100"
            >
              <div className="relative aspect-square">
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-blue-500 px-2 py-1 rounded-full text-white text-xs font-semibold">
                  {card.category}
                </div>
                
                {/* Price Badge */}
                <div className="absolute top-3 right-3 bg-white/90 rounded-lg px-2 py-1 shadow-sm">
                  <span className="text-sm font-bold text-gray-900">₹{card.price}</span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{card.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{card.description}</p>
                
                <button 
                  className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {trustBadges.map((badge) => (
            <div 
              key={badge.id}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center"
            >
              <div className="mr-4 p-3 bg-gray-50 rounded-full">
                {badge.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{badge.title}</h3>
                <p className="text-sm text-gray-600">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBadgesSimple; 