import express from 'express';
import {
  getPendingVerifications,
  approveVerification,
  rejectVerification,
} from '../controllers/verificationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/pending', protect, requireAdmin, getPendingVerifications);
router.post('/:id/approve', protect, requireAdmin, approveVerification);
router.post('/:id/reject', protect, requireAdmin, rejectVerification);

export default router;
