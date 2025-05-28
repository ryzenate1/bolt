import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  changePassword, 
  getAddresses, 
  addAddress, 
  updateAddress, 
  deleteAddress 
} from '../controllers/user';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// User profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/change-password', changePassword);

// Address routes
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

export default router;
