'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the TrustBadgesWrapper with no SSR
const TrustBadgesWrapper = dynamic(() => import('./TrustBadgesWrapper'), { 
  ssr: false,
  loading: () => (
    <div className="py-12 px-4 bg-gradient-to-br from-blue-50 to-teal-50 text-center rounded-lg">
      <div className="flex justify-center items-center space-x-2">
        <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '600ms' }}></div>
      </div>
      <p className="text-lg font-medium text-blue-600 mt-4">Loading fresh seafood collection...</p>
    </div>
  )
});

// Fallback component in case of errors
const TrustBadgesFallback = dynamic(() => import('./TrustBadgesSimple'), { 
  ssr: false,
  loading: () => (
    <div className="py-12 px-4 bg-gradient-to-br from-blue-50 to-teal-50 text-center rounded-lg">
      <p className="text-lg font-medium text-blue-600">Loading seafood collection...</p>
    </div>
  )
});

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error("Error in TrustBadges component:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// This is a client component wrapper for the TrustBadges section
export default function TrustBadgesSection() {
  return (
    <ErrorBoundary fallback={<TrustBadgesFallback />}>
      <Suspense fallback={
        <div className="py-12 px-4 bg-gradient-to-br from-blue-50 to-teal-50 text-center rounded-lg">
          <div className="flex justify-center items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '600ms' }}></div>
          </div>
          <p className="text-lg font-medium text-blue-600 mt-4">Loading fresh seafood collection...</p>
        </div>
      }>
        <TrustBadgesWrapper />
      </Suspense>
    </ErrorBoundary>
  );
} 