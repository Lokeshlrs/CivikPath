import express from 'express';
import {
  getDocumentsByStep,
  createDocument,
  updateDocument,
} from '../controllers/documentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/step/:stepId', getDocumentsByStep);
router.post('/', protect, requireAdmin, createDocument);
router.put('/:id', protect, requireAdmin, updateDocument);

export default router;
