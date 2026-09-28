import express from 'express';
import {
  ingestSource,
  getSources,
  getSourceById,
  verifySource,
  rejectSource,
  checkSource,
  updateSource,
  getVerifiedSourcesList,
  getVerifiedSourceSingle,
  searchVerifiedSourcesHandler,
} from '../controllers/sourceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/ingest', ingestSource);
router.get('/verified', getVerifiedSourcesList);
router.get('/verified/:id', getVerifiedSourceSingle);
router.get('/search', searchVerifiedSourcesHandler);

router.route('/')
  .get(getSources)
  .post(protect, requireAdmin, ingestSource);

router.post('/:id/verify', protect, requireAdmin, verifySource);
router.post('/:id/reject', protect, requireAdmin, rejectSource);
router.post('/:id/check', protect, requireAdmin, checkSource);

router.route('/:id')
  .get(getSourceById)
  .put(protect, requireAdmin, updateSource);

export default router;
