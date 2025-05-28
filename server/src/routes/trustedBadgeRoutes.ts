import express from 'express';
import { 
  getAllTrustedBadges, 
  getTrustedBadgeById, 
  createTrustedBadge,
  updateTrustedBadge, 
  deleteTrustedBadge 
} from '../controllers/trustedBadgeController';
import { isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes - available to everyone
router.get('/', getAllTrustedBadges);
router.get('/:id', getTrustedBadgeById);

// Protected routes - admin only
router.post('/', isAdmin, createTrustedBadge);
router.put('/:id', isAdmin, updateTrustedBadge);
router.delete('/:id', isAdmin, deleteTrustedBadge);

export default router; 