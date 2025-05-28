import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Fallback categories if the server API is unavailable
const fallbackCategories = [
  {
    id: 'vangaram-fish',
    name: 'Vangaram Fish',
    slug: 'vangaram-fish',
    description: 'Premium quality Vangaram fish fresh from the ocean',
    image: 'https://images.unsplash.com/photo-1534766438357-2b270dbd1b40?q=80&w=1974&auto=format&fit=crop',
    order: 0,
    isActive: true,
    type: 'Fish',
    icon: 'Fish'
  },
  {
    id: 'sliced-vangaram',
    name: 'Sliced Vangaram',
    slug: 'sliced-vangaram',
    description: 'Pre-sliced Vangaram fish, ready to cook',
    image: 'https://images.unsplash.com/photo-1565680018093-ebb6b9ab5460?q=80&w=2070&auto=format&fit=crop',
    order: 1,
    isActive: true,
    type: 'Fish',
    icon: 'Fish'
  },
  {
    id: 'dried-fish',
    name: 'Dried Fish',
    slug: 'dried-fish',
    description: 'Traditional sun-dried fish with intense flavor',
    image: 'https://images.unsplash.com/photo-1592483648224-61bf8287bc4c?q=80&w=2070&auto=format&fit=crop',
    order: 2,
    isActive: true,
    type: 'Dried Fish',
    icon: 'Fish'
  },
  {
    id: 'jumbo-prawns',
    name: 'Jumbo Prawns',
    slug: 'jumbo-prawns',
    description: 'Large, succulent jumbo prawns',
    image: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?q=80&w=2070&auto=format&fit=crop',
    order: 3,
    isActive: true,
    type: 'Prawns',
    icon: 'Shell'
  },
  {
    id: 'sea-prawns',
    name: 'Sea Prawns',
    slug: 'sea-prawns',
    description: 'Wild-caught sea prawns',
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=1935&auto=format&fit=crop',
    order: 4,
    isActive: true,
    type: 'Prawns',
    icon: 'Shell'
  },
  {
    id: 'fresh-lobster',
    name: 'Fresh Lobster',
    slug: 'fresh-lobster',
    description: 'Live lobsters caught daily',
    image: 'https://images.unsplash.com/photo-1610540881356-76bd50e523d3?q=80&w=2070&auto=format&fit=crop',
    order: 5,
    isActive: true,
    type: 'Shellfish',
    icon: 'Shell'
  }
];

export async function GET(req: NextRequest) {
  try {
    // Attempt to fetch categories from server API
    const res = await fetch('http://localhost:5001/api/categories', {
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    if (!res.ok) {
      console.error(`Server API returned status: ${res.status}`);
      
      // Check if we can access the admin API as fallback
      try {
        const adminRes = await fetch('/api/admin/categories', { 
          next: { revalidate: 60 }
        });
        
        if (adminRes.ok) {
          const adminData = await adminRes.json();
          
          // Map admin data to client format if needed (handling imageUrl vs image field)
          const mappedData = adminData.map((category: any) => ({
            ...category,
            image: category.imageUrl || category.image,
            isActive: category.isActive !== false
          }));
          
          return NextResponse.json(mappedData);
        }
      } catch (adminError) {
        console.warn('Admin API fallback also failed:', adminError);
      }
      
      // Return fallback data if all APIs fail
      console.log('Using fallback categories data');
      return NextResponse.json(fallbackCategories);
    }
    
    const data = await res.json();
    
    // Ensure all categories have consistent fields (image vs imageUrl)
    const mappedData = data.map((category: any) => ({
      ...category,
      image: category.imageUrl || category.image,
      isActive: category.isActive !== false,
      icon: category.icon || 'Fish',
      type: category.type || 'Fish'
    }));
    
    return NextResponse.json(mappedData);
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    // Return fallback data on any error
    console.log('Using fallback categories data due to error');
    return NextResponse.json(fallbackCategories);
  }
} 