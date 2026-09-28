import express from 'express';
import {
  getDependenciesByProcedure,
  createDependency,
  deleteDependency,
} from '../controllers/dependencyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/procedure/:procedureId', getDependenciesByProcedure);
router.post('/', protect, requireAdmin, createDependency);
router.delete('/:id', protect, requireAdmin, deleteDependency);

export default router;
