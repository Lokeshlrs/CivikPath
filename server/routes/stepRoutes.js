import express from 'express';
import {
  getStepsByProcedure,
  getStepById,
  createStep,
  updateStep,
  deleteStep,
} from '../controllers/stepController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/procedure/:procedureId', getStepsByProcedure);

router.post('/', protect, requireAdmin, createStep);

router.route('/:id')
  .get(getStepById)
  .put(protect, requireAdmin, updateStep)
  .delete(protect, requireAdmin, deleteStep);

export default router;
