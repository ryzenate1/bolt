import { NextResponse } from 'next/server';

// Configure route to be dynamic to avoid static generation bailout
export const dynamic = 'force-dynamic';

// In-memory storage for trusted badges (in a real app, this would use a database)
let trustedBadges = [
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
    description: 'Rich in omega-3, perfect for grilling',
    isActive: true
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
    description: 'Juicy and flavorful, great for curries',
    isActive: true
  },
  {
    id: 'salmon',
    name: 'Indian Salmon',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=2069&auto=format&fit=crop',
    category: 'Premium',
    price: 1299,
    originalPrice: 1499,
    weight: '1kg',
    freshness: 'Fresh',
    iconName: 'Waves',
    color: 'bg-pink-500',
    rating: 4.9,
    description: 'Rich in omega-3, perfect for grilling',
    isActive: true
  },
  {
    id: 'pomfret',
    name: 'White Pomfret',
    image: 'https://images.unsplash.com/photo-1605651377861-348620a3faae?q=80&w=2070&auto=format&fit=crop',
    category: 'Premium',
    price: 1099,
    originalPrice: 1299,
    weight: '700g',
    freshness: 'Fresh',
    iconName: 'Fish',
    color: 'bg-blue-500',
    rating: 4.7,
    description: 'Delicate white flesh, great for frying',
    isActive: true
  }
];

// GET - Retrieve all trusted badges
export async function GET() {
  return NextResponse.json(trustedBadges);
}

// POST - Create a new trusted badge
export async function POST(request: Request) {
  try {
    const newBadge = await request.json();
    
    // Log the received data for debugging
    console.log("Creating new trusted badge:", JSON.stringify(newBadge));
    
    // Validate required fields
    if (!newBadge.name || !newBadge.image) {
      console.error("Missing required fields for trusted badge");
      return NextResponse.json(
        { error: 'Name and image are required fields' },
        { status: 400 }
      );
    }
    
    // Ensure unique ID
    if (trustedBadges.some(badge => badge.id === newBadge.id)) {
      console.log("Duplicate ID found, generating new ID");
      newBadge.id = `badge_${Date.now()}`;
    }
    
    // Add the badge to our collection
    trustedBadges.push(newBadge);
    console.log("Trusted badge added successfully. Total badges:", trustedBadges.length);
    
    return NextResponse.json(newBadge, { status: 201 });
  } catch (error) {
    console.error('Error creating trusted badge:', error);
    return NextResponse.json(
      { error: 'Failed to create trusted badge' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing trusted badge
export async function PUT(request: Request) {
  try {
    const updatedBadge = await request.json();
    
    console.log("Updating trusted badge:", JSON.stringify(updatedBadge));
    
    // Validate required fields
    if (!updatedBadge.id) {
      console.error("Missing badge ID for update");
      return NextResponse.json(
        { error: 'Badge ID is required for updates' },
        { status: 400 }
      );
    }
    
    const index = trustedBadges.findIndex(badge => badge.id === updatedBadge.id);
    
    if (index === -1) {
      console.error("Trusted badge not found:", updatedBadge.id);
      return NextResponse.json(
        { error: 'Trusted badge not found' },
        { status: 404 }
      );
    }
    
    trustedBadges[index] = updatedBadge;
    console.log("Trusted badge updated successfully:", updatedBadge.name);
    
    return NextResponse.json(updatedBadge);
  } catch (error) {
    console.error('Error updating trusted badge:', error);
    return NextResponse.json(
      { error: 'Failed to update trusted badge' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a trusted badge
export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Badge ID is required for deletion' },
        { status: 400 }
      );
    }
    
    const initialLength = trustedBadges.length;
    trustedBadges = trustedBadges.filter(badge => badge.id !== id);
    
    if (trustedBadges.length === initialLength) {
      return NextResponse.json(
        { error: 'Trusted badge not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting trusted badge:', error);
    return NextResponse.json(
      { error: 'Failed to delete trusted badge' },
      { status: 500 }
    );
  }
} 