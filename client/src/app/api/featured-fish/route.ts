import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Fallback featured fish data if server API fails
const fallbackFeaturedFish = [
  {
    id: 'premium-combo',
    name: "Premium Fish Combo",
    image: "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?q=80&w=2070&auto=format&fit=crop",
    slug: "premium",
    type: "Premium",
    description: "Curated selection of premium fish varieties",
    featured: true,
    price: 999,
    weight: "1.2kg",
    discount: 10,
    iconName: "Fish",
    isActive: true
  },
  {
    id: 'grilling-special',
    name: "Grilling Special",
    image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=2070&auto=format&fit=crop",
    slug: "grilling",
    type: "Combo",
    description: "Perfect for seafood barbecues and grilling",
    featured: true,
    price: 899,
    weight: "800g",
    discount: 15,
    iconName: "Fish",
    isActive: true
  },
  {
    id: 'seafood-feast',
    name: "Seafood Feast",
    image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=1974&auto=format&fit=crop",
    slug: "feast",
    type: "Combo",
    description: "Premium selection of mixed seafood",
    featured: true,
    price: 1299,
    weight: "1.5kg",
    discount: 8,
    iconName: "Shell",
    isActive: true
  },
  {
    id: 'fresh-catch',
    name: "Fresh Catch Box",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=2069&auto=format&fit=crop",
    slug: "fresh-catch",
    type: "Fresh",
    description: "Today's freshest catches from local fishermen",
    featured: true,
    price: 799,
    weight: "900g",
    discount: 12,
    iconName: "Anchor",
    isActive: true
  }
];

export async function GET(req: NextRequest) {
  try {
    // Attempt to fetch from server API with caching
    const response = await fetch('http://localhost:5001/api/featured-fish', {
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    if (!response.ok) {
      console.error(`Server API returned status: ${response.status}`);
      
      // Try the admin API as fallback
      try {
        const adminRes = await fetch('/api/admin/featured-fish', { 
          next: { revalidate: 60 }
        });
        
        if (adminRes.ok) {
          const adminData = await adminRes.json();
          return NextResponse.json(adminData);
        }
      } catch (adminError) {
        console.warn('Admin API fallback also failed:', adminError);
      }
      
      // Return fallback data if all APIs fail
      console.log('Using fallback featured fish data');
      return NextResponse.json(fallbackFeaturedFish);
    }
    
    const data = await response.json();
    
    // Normalize data format
    const normalizedData = data.map((fish: any) => ({
      ...fish,
      isActive: fish.isActive !== false,
      icon: fish.iconName || fish.icon || 'Fish',
      // Ensure slug is valid
      slug: fish.slug?.replace(/^fish-combo\//, '') || fish.id
    }));
    
    return NextResponse.json(normalizedData);
  } catch (error) {
    console.error('Error fetching featured fish:', error);
    
    // Return fallback data on any error
    console.log('Using fallback featured fish data due to error');
    return NextResponse.json(fallbackFeaturedFish);
  }
} 