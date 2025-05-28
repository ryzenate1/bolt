import { NextResponse } from 'next/server';

// Configure route to be dynamic to avoid static generation bailout
export const dynamic = 'force-dynamic';

// In-memory storage for featured fish (in a real app, this would use a database)
let featuredFish = [
  {
    id: 'premium-combo',
    name: "Premium Fish Combo",
    image: "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?q=80&w=2070&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?q=80&w=2070&auto=format&fit=crop",
    slug: "premium",
    type: "Premium",
    description: "Curated selection of premium fish varieties",
    featured: true,
    price: 999,
    weight: "1.2kg",
    discount: 10,
    iconName: "Fish",
    isActive: true,
    order: 0
  },
  {
    id: 'grilling-special',
    name: "Grilling Special",
    image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=2070&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=2070&auto=format&fit=crop",
    slug: "grilling",
    type: "Combo",
    description: "Perfect for seafood barbecues and grilling",
    featured: true,
    price: 899,
    weight: "800g",
    discount: 15,
    iconName: "Fish",
    isActive: true,
    order: 1
  },
  {
    id: 'seafood-feast',
    name: "Seafood Feast",
    image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=1974&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=1974&auto=format&fit=crop",
    slug: "feast",
    type: "Combo",
    description: "Premium selection of mixed seafood",
    featured: true,
    price: 1299,
    weight: "1.5kg",
    discount: 8,
    iconName: "Shell",
    isActive: true,
    order: 2
  },
  {
    id: 'fresh-catch',
    name: "Fresh Catch Box",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=2069&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=2069&auto=format&fit=crop",
    slug: "fresh-catch",
    type: "Fresh",
    description: "Today's freshest catches from local fishermen",
    featured: true,
    price: 799,
    weight: "900g",
    discount: 12,
    iconName: "Anchor",
    isActive: true,
    order: 3
  }
];

// GET - Retrieve all featured fish or a specific one
export async function GET(request: Request) {
  try {
    // Use searchParams from URL to get id parameter
    const id = new URL(request.url).searchParams.get('id');

    if (id) {
      const fish = featuredFish.find(f => f.id === id);
      if (!fish) {
        return NextResponse.json({ error: 'Featured fish not found' }, { status: 404 });
      }
      return NextResponse.json(fish);
    }

    return NextResponse.json(featuredFish);
  } catch (error) {
    console.error('Error fetching featured fish:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured fish' },
      { status: 500 }
    );
  }
}

// POST - Create a new featured fish
export async function POST(request: Request) {
  try {
    const newFish = await request.json();
    
    // Log the received data for debugging
    console.log("Creating new featured fish:", JSON.stringify(newFish));
    
    // Validate required fields
    if (!newFish.name || !newFish.type) {
      console.error("Missing required fields");
      return NextResponse.json(
        { error: 'Name and type are required fields' },
        { status: 400 }
      );
    }
    
    // Ensure unique ID and slug
    if (!newFish.id) {
      newFish.id = `fish_${Date.now()}`;
    }
    
    if (!newFish.slug) {
      // Generate slug from name
      newFish.slug = newFish.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    
    // Check for duplicate slug
    if (featuredFish.some(f => f.slug === newFish.slug)) {
      console.error("Duplicate slug:", newFish.slug);
      return NextResponse.json(
        { error: 'A featured fish with this slug already exists' },
        { status: 400 }
      );
    }
    
    // Set order if not provided
    if (typeof newFish.order !== 'number') {
      const maxOrder = featuredFish.length > 0 
        ? Math.max(...featuredFish.map(f => f.order || 0)) + 1 
        : 0;
      newFish.order = maxOrder;
    }
    
    // Set defaults for optional fields
    if (typeof newFish.isActive !== 'boolean') {
      newFish.isActive = true;
    }
    
    if (typeof newFish.featured !== 'boolean') {
      newFish.featured = true;
    }
    
    // Make sure image and imageUrl are synchronized
    if (newFish.image && !newFish.imageUrl) {
      newFish.imageUrl = newFish.image;
    } else if (newFish.imageUrl && !newFish.image) {
      newFish.image = newFish.imageUrl;
    }
    
    // Add the fish to our list
    featuredFish.push(newFish);
    console.log("Featured fish added successfully. Total featured fish:", featuredFish.length);
    
    return NextResponse.json(newFish, { status: 201 });
  } catch (error) {
    console.error('Error creating featured fish:', error);
    return NextResponse.json(
      { error: 'Failed to create featured fish' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing featured fish
export async function PUT(request: Request) {
  try {
    const updatedFish = await request.json();
    const id = new URL(request.url).searchParams.get('id') || updatedFish.id;
    
    console.log("Updating featured fish ID:", id, "Data:", JSON.stringify(updatedFish));
    
    // Validate ID
    if (!id) {
      console.error("Missing featured fish ID");
      return NextResponse.json(
        { error: 'Featured fish ID is required for updates' },
        { status: 400 }
      );
    }
    
    // Find the featured fish
    const index = featuredFish.findIndex(f => f.id === id);
    
    if (index === -1) {
      console.error("Featured fish not found:", id);
      return NextResponse.json(
        { error: 'Featured fish not found' },
        { status: 404 }
      );
    }
    
    // Check for duplicate slug if changing slug
    if (updatedFish.slug && updatedFish.slug !== featuredFish[index].slug) {
      if (featuredFish.some(f => f.id !== id && f.slug === updatedFish.slug)) {
        console.error("Duplicate slug:", updatedFish.slug);
        return NextResponse.json(
          { error: 'A featured fish with this slug already exists' },
          { status: 400 }
        );
      }
    }
    
    // Make sure image and imageUrl are synchronized
    if (updatedFish.image && !updatedFish.imageUrl) {
      updatedFish.imageUrl = updatedFish.image;
    } else if (updatedFish.imageUrl && !updatedFish.image) {
      updatedFish.image = updatedFish.imageUrl;
    }
    
    // Update the featured fish
    featuredFish[index] = { 
      ...featuredFish[index],
      ...updatedFish 
    };
    
    console.log("Featured fish updated successfully:", featuredFish[index].name);
    
    return NextResponse.json(featuredFish[index]);
  } catch (error) {
    console.error('Error updating featured fish:', error);
    return NextResponse.json(
      { error: 'Failed to update featured fish' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a featured fish
export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Featured fish ID is required for deletion' },
        { status: 400 }
      );
    }
    
    const initialLength = featuredFish.length;
    featuredFish = featuredFish.filter(f => f.id !== id);
    
    if (featuredFish.length === initialLength) {
      return NextResponse.json(
        { error: 'Featured fish not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting featured fish:', error);
    return NextResponse.json(
      { error: 'Failed to delete featured fish' },
      { status: 500 }
    );
  }
} 