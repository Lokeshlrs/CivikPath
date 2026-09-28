import express from 'express';
import {
  getProcedures,
  getProcedureById,
  getProcedureFullGraph,
  createProcedure,
  updateProcedure,
} from '../controllers/procedureController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProcedures)
  .post(protect, requireAdmin, createProcedure);

router.get('/:id/graph', getProcedureFullGraph);

router.route('/:id')
  .get(getProcedureById)
  .put(protect, requireAdmin, updateProcedure);

export default router;
