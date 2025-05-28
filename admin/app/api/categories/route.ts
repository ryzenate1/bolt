import { NextResponse } from 'next/server';

// Configure route to be dynamic to avoid static generation bailout
export const dynamic = 'force-dynamic';

// In-memory storage for categories (in a real app, this would use a database)
let categories = [
  {
    id: 'vangaram-fish',
    name: 'Vangaram Fish',
    slug: 'vangaram-fish',
    description: 'Premium quality Vangaram fish fresh from the ocean',
    imageUrl: 'https://images.unsplash.com/photo-1534766438357-2b270dbd1b40?q=80&w=1974&auto=format&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1565680018093-ebb6b9ab5460?q=80&w=2070&auto=format&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1592483648224-61bf8287bc4c?q=80&w=2070&auto=format&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?q=80&w=2070&auto=format&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=1935&auto=format&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1610540881356-76bd50e523d3?q=80&w=2070&auto=format&fit=crop',
    order: 5,
    isActive: true,
    type: 'Shellfish',
    icon: 'Shell'
  },
  {
    id: 'blue-crabs',
    name: 'Blue Crabs',
    slug: 'blue-crabs',
    description: 'Fresh blue crabs from coastal waters',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop',
    order: 6,
    isActive: true,
    type: 'Crabs',
    icon: 'Shell'
  },
  {
    id: 'sea-crabs',
    name: 'Sea Crabs',
    slug: 'sea-crabs',
    description: 'Delicious sea crabs with firm meat',
    imageUrl: 'https://images.unsplash.com/photo-1559187575-5f89cedf009b?q=80&w=2071&auto=format&fit=crop',
    order: 7,
    isActive: true,
    type: 'Crabs',
    icon: 'Shell'
  },
  {
    id: 'fresh-squid',
    name: 'Fresh Squid',
    slug: 'fresh-squid',
    description: 'Tender fresh squid perfect for calamari',
    imageUrl: 'https://images.unsplash.com/photo-1612177343582-665b93b8a320?q=80&w=2071&auto=format&fit=crop',
    order: 8,
    isActive: true,
    type: 'Cephalopods',
    icon: 'Fish'
  },
  {
    id: 'fish-combo',
    name: 'Fish Combo Packs',
    slug: 'fish-combo',
    description: 'Assorted fish combo packs for variety',
    imageUrl: 'https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?q=80&w=2070&auto=format&fit=crop',
    order: 9,
    isActive: true,
    type: 'Combo',
    icon: 'Fish'
  }
];

// GET - Retrieve all categories or a specific category
export async function GET(request: Request) {
  try {
    // Use searchParams from URL to get id parameter
    const id = new URL(request.url).searchParams.get('id');

    if (id) {
      const category = categories.find(c => c.id === id);
      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }
      return NextResponse.json(category);
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create a new category
export async function POST(request: Request) {
  try {
    const newCategory = await request.json();
    
    // Log the received data for debugging
    console.log("Creating new category:", JSON.stringify(newCategory));
    
    // Validate required fields
    if (!newCategory.name || !newCategory.slug) {
      console.error("Missing required fields");
      return NextResponse.json(
        { error: 'Name and slug are required fields' },
        { status: 400 }
      );
    }
    
    // Ensure unique ID and slug
    if (!newCategory.id) {
      newCategory.id = `category_${Date.now()}`;
    }
    
    // Check for duplicate slug
    if (categories.some(c => c.slug === newCategory.slug)) {
      console.error("Duplicate slug:", newCategory.slug);
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 400 }
      );
    }
    
    // Set order if not provided
    if (typeof newCategory.order !== 'number') {
      const maxOrder = categories.length > 0 
        ? Math.max(...categories.map(c => c.order || 0)) + 1 
        : 0;
      newCategory.order = maxOrder;
    }
    
    // Set defaults for optional fields
    if (typeof newCategory.isActive !== 'boolean') {
      newCategory.isActive = true;
    }
    
    // Set defaults for icon and type if not provided
    if (!newCategory.icon) {
      newCategory.icon = 'Fish';
    }
    
    if (!newCategory.type) {
      newCategory.type = 'Fish';
    }
    
    // Add the category to our list
    categories.push(newCategory);
    console.log("Category added successfully. Total categories:", categories.length);
    
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing category
export async function PUT(request: Request) {
  try {
    const updatedCategory = await request.json();
    const id = new URL(request.url).searchParams.get('id') || updatedCategory.id;
    
    console.log("Updating category ID:", id, "Data:", JSON.stringify(updatedCategory));
    
    // Validate ID
    if (!id) {
      console.error("Missing category ID");
      return NextResponse.json(
        { error: 'Category ID is required for updates' },
        { status: 400 }
      );
    }
    
    // Find the category
    const index = categories.findIndex(c => c.id === id);
    
    if (index === -1) {
      console.error("Category not found:", id);
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Check for duplicate slug if changing slug
    if (updatedCategory.slug && updatedCategory.slug !== categories[index].slug) {
      if (categories.some(c => c.id !== id && c.slug === updatedCategory.slug)) {
        console.error("Duplicate slug:", updatedCategory.slug);
        return NextResponse.json(
          { error: 'A category with this slug already exists' },
          { status: 400 }
        );
      }
    }
    
    // Ensure icon and type are set
    if (!updatedCategory.icon) {
      updatedCategory.icon = categories[index].icon || 'Fish';
    }
    
    if (!updatedCategory.type) {
      updatedCategory.type = categories[index].type || 'Fish';
    }
    
    // Update the category
    categories[index] = { 
      ...categories[index],
      ...updatedCategory 
    };
    
    console.log("Category updated successfully:", categories[index].name);
    
    return NextResponse.json(categories[index]);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a category
export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required for deletion' },
        { status: 400 }
      );
    }
    
    const initialLength = categories.length;
    categories = categories.filter(c => c.id !== id);
    
    if (categories.length === initialLength) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
} 