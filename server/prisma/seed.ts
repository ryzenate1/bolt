import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const generateProductSlug = (name: string): string => {
  if (!name) return Math.random().toString(36).substring(2, 15); // Fallback for safety
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

async function main() {
  console.log('Seeding database...');

  // Clear existing data (order matters due to relations)
  await prisma.loyaltyActivity.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany(); 
  await prisma.category.deleteMany();
  await prisma.trustedBadge.deleteMany();
  await prisma.address.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.user.deleteMany();

  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      phoneNumber: '9876543210',
      password: hashedPassword,
      loyaltyPoints: 1250,
      loyaltyTier: 'Silver',
      role: 'customer'
    }
  });

  console.log('Created test user:', user.id);

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      phoneNumber: '9876543211',
      password: hashedPassword,
      loyaltyPoints: 0,
      loyaltyTier: 'Bronze',
      role: 'admin'
    }
  });

  console.log('Created admin user:', adminUser.id);

  // Create test address
  const address = await prisma.address.create({
    data: {
      userId: user.id,
      name: 'Home',
      address: '123 Main St',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001',
      isDefault: true
    }
  });

  console.log('Created test address:', address.id);

  // Create fish categories
  const categoryData = [
    { name: 'Premium Fish', description: 'Top quality premium fish', imageUrl: '/images/categories/premium-fish.jpg', order: 1, isActive: true, type: 'Premium', icon: 'Fish' },
    { name: 'Small Fish', description: 'Fresh small fish', imageUrl: '/images/categories/small-fish.jpg', order: 2, isActive: true, type: 'Fish', icon: 'Fish' },
    { name: 'Medium Fish', description: 'Medium-sized fish', imageUrl: '/images/categories/medium-fish.jpg', order: 3, isActive: true, type: 'Fish', icon: 'Fish' },
    { name: 'Shellfish', description: 'Fresh shellfish', imageUrl: '/images/categories/shellfish.jpg', order: 4, isActive: true, type: 'Shellfish', icon: 'Shell' },
    { name: 'Freshwater Fish', description: 'Fish from freshwater sources', imageUrl: '/images/categories/freshwater-fish.jpg', order: 5, isActive: true, type: 'Fish', icon: 'Fish' },
    { name: 'Crabs', description: 'Fresh crabs', imageUrl: '/images/categories/crabs.jpg', order: 6, isActive: true, type: 'Crabs', icon: 'Shell' },
    { name: 'Combo Packs', description: 'Assorted fish combo packs', imageUrl: '/images/categories/combo.jpg', order: 7, isActive: true, type: 'Combo', icon: 'Fish' }
  ];

  const processedCategoryData = categoryData.map(cat => ({
    ...cat,
    slug: cat.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }));

  await prisma.category.createMany({
    data: processedCategoryData
  });

  const categories = await prisma.category.findMany();
  const getCategoryId = (name: string): string => {
    const cat = categories.find(c => c.name === name);
    if (!cat) throw new Error(`Category not found: ${name}`);
    return cat.id;
  };

  // Create fish products with new fields
  const productData = [
    {
      name: 'Seer Fish',
      description: 'Premium seer fish, whole or custom cuts available.',
      price: 899,
      originalPrice: 950,
      imageUrl: '/images/products/seer.jpg',
      stock: 50,
      categoryName: 'Premium Fish',
      weight: '1kg',
      tag: 'Premium',
      featured: true,
    },
    {
      name: 'Sardine',
      description: 'Fresh, nutrient-rich sardines, perfect for frying or curries.',
      price: 199,
      originalPrice: 220,
      imageUrl: '/images/products/sardine.jpg',
      stock: 100,
      categoryName: 'Small Fish',
      weight: '500g',
      tag: 'Popular',
      featured: false,
    },
    {
      name: 'Pomfret',
      description: 'Whole white pomfret, ideal for grilling or steaming.',
      price: 1099,
      imageUrl: '/images/products/pomfret.jpg',
      stock: 30,
      categoryName: 'Premium Fish',
      weight: '750g',
      tag: 'Best Seller',
      featured: true,
    },
    {
      name: 'Catla',
      description: 'Freshwater catla, cleaned and cut.',
      price: 399,
      imageUrl: '/images/products/catla.jpg',
      stock: 40,
      categoryName: 'Freshwater Fish',
      weight: '1kg',
      tag: 'Freshwater',
      featured: false,
    },
    {
      name: 'Live Crab',
      description: 'Live mud crabs, full of flavor.',
      price: 499,
      originalPrice: 550,
      imageUrl: '/images/products/crab.jpg',
      stock: 25,
      categoryName: 'Crabs',
      weight: 'Per piece (approx 300-400g)',
      tag: 'Live Seafood',
      featured: true,
    },
    {
      name: 'Family Fish Combo',
      description: 'An assortment of popular fish for the whole family.',
      price: 1299,
      originalPrice: 1400,
      imageUrl: '/images/products/combo.jpg',
      stock: 20,
      categoryName: 'Combo Packs',
      weight: '1.5kg total',
      tag: 'Value Pack',
      featured: true,
    }
  ];

  const processedProductData = productData.map(p => ({
    ...p,
    slug: generateProductSlug(p.name),
    categoryId: getCategoryId(p.categoryName),
    category: p.categoryName, // Keep legacy category field for now if schema still has it
    categoryName: undefined, // remove temporary field
  }));

  await prisma.product.createMany({
    data: processedProductData.map(({ categoryName, ...rest }) => rest), // Ensure categoryName is not passed to createMany if it was used
  });

  console.log('Created test products');

  // Create Trusted Badges
  const trustedBadgeData = [
    {
      title: '100% Fresh Fish',
      description: 'We guarantee the freshness of every order, sourced daily.',
      iconName: 'Fish', // Example Lucide icon name
      order: 1,
      isActive: true,
    },
    {
      title: 'Secure Payments',
      description: 'Your payment information is safe with our encrypted checkout.',
      iconName: 'ShieldCheck',
      order: 2,
      isActive: true,
    },
    {
      title: 'Fast Delivery',
      description: 'Get your fresh seafood delivered to your doorstep quickly.',
      iconName: 'Clock',
      order: 3,
      isActive: true,
    },
    {
      title: 'Quality Assured',
      description: 'Each product is carefully inspected for the highest quality.',
      iconName: 'BadgeCheck',
      order: 4,
      isActive: false, // Example of an inactive badge
    },
  ];

  await prisma.trustedBadge.createMany({
    data: trustedBadgeData,
  });
  console.log('Created trusted badges');

  // Create loyalty activities
  await prisma.loyaltyActivity.create({
    data: {
      userId: user.id,
      points: 500,
      type: 'earned',
      description: 'Welcome Bonus',
      createdAt: new Date('2025-05-01T09:00:00Z')
    }
  });

  await prisma.loyaltyActivity.create({
    data: {
      userId: user.id,
      points: -100,
      type: 'redeemed',
      description: 'Discount Coupon Redemption',
      createdAt: new Date('2025-05-22T16:45:00Z')
    }
  });

  console.log('Created loyalty activities');

  // Create payment method
  await prisma.paymentMethod.create({
    data: {
      userId: user.id,
      type: 'card',
      cardNumber: '4242',
      cardBrand: 'Visa',
      expiryDate: '12/27',
      isDefault: true
    }
  });

  console.log('Created payment method');

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
