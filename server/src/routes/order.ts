import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth';

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

// User order routes
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Get user orders - To be implemented' });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ message: `Get order ${req.params.id} - To be implemented` });
});

router.post('/', (req, res) => {
  res.status(200).json({ message: 'Create order - To be implemented' });
});

// Admin routes
router.get('/admin/all', isAdmin, (req, res) => {
  res.status(200).json({ message: 'Get all orders (admin) - To be implemented' });
});

router.put('/:id/status', isAdmin, (req, res) => {
  res.status(200).json({ message: `Update order ${req.params.id} status - To be implemented` });
});

export default router;
