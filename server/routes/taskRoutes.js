import express from 'express';
import { createTask, getTasks, getTaskById, updateTask } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createTask)
  .get((req, res, next) => {
    if (req.query.catalog === 'true') {
      return getTasks(req, res, next);
    }
    return protect(req, res, () => getTasks(req, res, next));
  });

router.route('/:id')
  .get(protect, getTaskById)
  .put(protect, updateTask);

export default router;
