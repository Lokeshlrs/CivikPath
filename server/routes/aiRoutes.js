import express from 'express';
import { askCivicQuestion, guideCivicService } from '../controllers/aiController.js';

const router = express.Router();

router.post('/ask', askCivicQuestion);
router.post('/guide', guideCivicService);

export default router;
