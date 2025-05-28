'use client';

import React, { useState, useEffect } from 'react';
import TrustBadges from './TrustBadges';
import { Fish, Clock, AlertCircle } from 'lucide-react';

interface FishCardProps {
  id: string;
  name: string;
  image: string;
  category: string;
  price: number;
  originalPrice: number;
  weight: string;
  freshness: string;
  iconName?: string;
  color: string;
  rating: number;
  description: string;
  isActive?: boolean;
}

// Simple loading component
const Loading = () => (
  <div className="py-16 px-4 bg-gradient-to-br from-blue-50 to-teal-50 text-center rounded-xl animate-pulse">
    <div className="mx-auto w-16 h-16 mb-4 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-md">
      <Clock className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
    <p className="text-lg font-medium text-blue-600">Loading fresh seafood collection...</p>
  </div>
);

// Simple error component
const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="py-16 px-4 bg-gradient-to-br from-red-50 to-pink-50 text-center rounded-xl">
    <div className="mx-auto w-16 h-16 mb-4 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-md">
      <AlertCircle className="w-8 h-8 text-red-500" />
    </div>
    <h3 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h3>
    <p className="text-gray-700">{message}</p>
    <button 
      onClick={() => window.location.reload()}
      className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);

// Simple fallback component
const TrustBadgesSimple = () => {
  const defaultFishCards = [
    {
      id: 'seer',
      name: 'Seer Fish (Vanjaram)',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop',
      category: 'Premium',
      price: 899,
      originalPrice: 999,
      weight: '500g',
      freshness: 'Fresh',
      iconName: 'Fish',
      color: 'bg-blue-500',
      rating: 4.8,
      description: 'Rich in omega-3, perfect for grilling'
    },
    {
      id: 'prawns',
      name: 'Tiger Prawns',
      image: 'https://images.unsplash.com/photo-1565680018093-ebb6b9ab5460?q=80&w=2070&auto=format&fit=crop',
      category: 'Shellfish',
      price: 599,
      originalPrice: 699,
      weight: '250g',
      freshness: 'Fresh',
      iconName: 'Anchor',
      color: 'bg-amber-500',
      rating: 4.6,
      description: 'Juicy and flavorful, great for curries'
    },
  ];

  return <TrustBadges fishCards={defaultFishCards} />;
};

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error in TrustBadges component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorDisplay message={this.state.error?.message || "An unexpected error occurred"} />;
    }

    return this.props.children;
  }
}

// Main wrapper component
export default function TrustBadgesWrapper() {
  const [fishCards, setFishCards] = useState<FishCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFishCards() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/trusted-badges');
        if (!res.ok) {
          throw new Error('Failed to fetch fish cards');
        }
        const data = await res.json();
        
        // Filter out inactive cards
        const activeCards = data.filter((card: FishCardProps) => card.isActive);
        setFishCards(activeCards);
        console.log('Loaded fish cards:', activeCards);
      } catch (err: any) {
        console.error('Error loading fish cards:', err);
        setError(err.message || 'Failed to load fresh seafood collection');
      } finally {
        setIsLoading(false);
      }
    }

    fetchFishCards();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (error || fishCards.length === 0) {
    console.warn('Error or no fish cards available, using fallback');
    return <TrustBadgesSimple />;
  }

  return (
    <ErrorBoundary>
      <TrustBadges fishCards={fishCards} />
    </ErrorBoundary>
  );
} 