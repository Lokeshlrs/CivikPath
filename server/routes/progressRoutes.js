import express from 'express';
import {
  getProgressByTask,
  updateProgress,
  updateStepProgress,
} from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/:civicTaskId/step', protect, updateStepProgress);

router.route('/:civicTaskId')
  .get(protect, getProgressByTask)
  .put(protect, updateProgress);

export default router;
