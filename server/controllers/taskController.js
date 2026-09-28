import { CivicTask } from '../models/CivicTask.js';
import { getProcedures } from './procedureController.js';
import mongoose from 'mongoose';

export const createTask = async (req, res, next) => {
  try {
    const { title, location, answers } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
    }

    const task = await CivicTask.create({
      title,
      userId: req.user._id,
      location: location || { state: 'Maharashtra', district: 'Amravati', city: 'Amravati' },
      answers: answers || {},
    });

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    if (req.query.catalog === 'true') {
      return getProcedures(req, res, next);
    }
    const tasks = await CivicTask.find({ userId: req.user._id })
      .populate({
        path: 'procedureId',
        populate: { path: 'officialSourceId' },
      })
      .sort({ createdAt: -1 })
      .lean();

    const hydratedTasks = tasks.map((task) => {
      const proc = task.procedureId;
      if (proc && typeof proc === 'object') {
        const src = proc.officialSourceId;
        const isVerified =
          proc.sourceStatus === 'verified' && src && src.sourceStatus === 'verified' && src.verificationStatus === 'approved';
        return {
          ...task,
          procedureId: proc._id.toString(),
          procedureTitle: proc.title,
          officialSourceId: src ? src._id.toString() : undefined,
          officialSourceUrl: isVerified ? src.sourceUrl || src.url : undefined,
          officialSourceName: src ? src.sourceName || src.service : undefined,
          sourceStatus: proc.sourceStatus,
        };
      }
      return task;
    });

    return res.json({
      success: true,
      data: hydratedTasks,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format',
      });
    }

    const task = await CivicTask.findById(id)
      .populate({
        path: 'procedureId',
        populate: { path: 'officialSourceId' },
      })
      .lean();

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Civic task not found',
      });
    }

    const proc = task.procedureId;
    let hydratedTask = { ...task };
    if (proc && typeof proc === 'object') {
      const src = proc.officialSourceId;
      const isVerified =
        proc.sourceStatus === 'verified' && src && src.sourceStatus === 'verified' && src.verificationStatus === 'approved';
      hydratedTask = {
        ...task,
        procedureId: proc._id.toString(),
        procedureTitle: proc.title,
        officialSourceId: src ? src._id.toString() : undefined,
        officialSourceUrl: isVerified ? src.sourceUrl || src.url : undefined,
        officialSourceName: src ? src.sourceName || src.service : undefined,
        sourceStatus: proc.sourceStatus,
      };
    }

    return res.json({
      success: true,
      data: hydratedTask,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format',
      });
    }

    const task = await CivicTask.findByIdAndUpdate(id, req.body, { new: true });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Civic task not found',
      });
    }

    return res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};
