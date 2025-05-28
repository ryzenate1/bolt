import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth';

const router = express.Router();

// Sample featured fish data (in a real app, this would come from a database)
const featuredFish = [
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
    slug: "fish-combo/fresh-catch",
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

// Get all featured fish
router.get('/', (req, res) => {
  try {
    const activeFeaturedFish = featuredFish.filter(fish => fish.isActive);
    res.status(200).json(activeFeaturedFish);
  } catch (error) {
    console.error('Error fetching featured fish:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured fish by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const fish = featuredFish.find(f => f.id === id);
    
    if (!fish) {
      return res.status(404).json({ message: 'Featured fish not found' });
    }
    
    res.status(200).json(fish);
  } catch (error) {
    console.error('Error fetching featured fish by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 