import { UserProgress } from '../models/UserProgress.js';
import { CivicTask } from '../models/CivicTask.js';
import { ProcedureStep } from '../models/ProcedureStep.js';
import { Dependency } from '../models/Dependency.js';
import mongoose from 'mongoose';

export const getProgressByTask = async (req, res, next) => {
  try {
    const { civicTaskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(civicTaskId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid civic task ID format',
      });
    }

    let progress = await UserProgress.findOne({
      userId: req.user._id,
      civicTaskId,
    }).populate('completedSteps').populate('currentStepId');

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'User progress not found for this task',
      });
    }

    return res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStepProgress = async (req, res, next) => {
  try {
    const { civicTaskId } = req.params;
    const { stepId, status, procedureId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(civicTaskId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid civic task ID format',
      });
    }

    if (!stepId || !mongoose.Types.ObjectId.isValid(stepId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid stepId is required',
      });
    }

    if (!['not_started', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be not_started, in_progress, or completed',
      });
    }

    // Verify step exists
    const step = await ProcedureStep.findById(stepId);
    if (!step) {
      return res.status(400).json({
        success: false,
        message: 'Step not found or does not belong to procedure',
      });
    }

    // Verify task exists
    const task = await CivicTask.findById(civicTaskId);
    if (!task) {
      return res.status(400).json({
        success: false,
        message: 'Civic task not found',
      });
    }

    const targetProcedureId = procedureId || step.procedureId || task.procedureId;
    if (!targetProcedureId) {
      return res.status(400).json({
        success: false,
        message: 'Procedure ID could not be determined',
      });
    }

    // Ensure step belongs to procedure
    if (step.procedureId && step.procedureId.toString() !== targetProcedureId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Step not found or does not belong to procedure',
      });
    }

    // Find or create user progress
    let progress = await UserProgress.findOne({
      userId: req.user._id,
      civicTaskId,
    });

    if (!progress) {
      progress = new UserProgress({
        userId: req.user._id,
        civicTaskId,
        procedureId: targetProcedureId,
        completedSteps: [],
        stepStatuses: new Map(),
        percentage: 0,
      });
    }

    // Dependency Check: If setting to in_progress or completed, check prerequisite dependencies
    if (status === 'in_progress' || status === 'completed') {
      const dependencies = await Dependency.find({
        procedureId: targetProcedureId,
        toStepId: stepId,
      });

      if (dependencies.length > 0) {
        const completedStepStrings = (progress.completedSteps || []).map((id) => id.toString());
        const missingPrereqs = dependencies.filter(
          (dep) => !completedStepStrings.includes(dep.fromStepId.toString())
        );

        if (missingPrereqs.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Prerequisite steps must be completed first',
            missingPrerequisiteStepIds: missingPrereqs.map((d) => d.fromStepId),
          });
        }
      }
    }

    // Update stepStatuses Map
    if (!progress.stepStatuses) {
      progress.stepStatuses = new Map();
    }
    progress.stepStatuses.set(stepId.toString(), status);

    // Update completedSteps array
    const stepIdStr = stepId.toString();
    const existingCompleted = (progress.completedSteps || []).map((id) => id.toString());

    if (status === 'completed') {
      if (!existingCompleted.includes(stepIdStr)) {
        progress.completedSteps.push(stepId);
      }
    } else {
      progress.completedSteps = (progress.completedSteps || []).filter(
        (id) => id.toString() !== stepIdStr
      );
    }

    // Recalculate percentage
    const totalStepsCount = await ProcedureStep.countDocuments({ procedureId: targetProcedureId });
    if (totalStepsCount > 0) {
      progress.percentage = Math.round((progress.completedSteps.length / totalStepsCount) * 100);
    } else {
      progress.percentage = 0;
    }

    if (status === 'in_progress' || status === 'completed') {
      progress.currentStepId = stepId;
    }

    await progress.save();

    const updatedProgress = await UserProgress.findById(progress._id)
      .populate('completedSteps')
      .populate('currentStepId');

    return res.json({
      success: true,
      data: updatedProgress,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProgress = async (req, res, next) => {
  try {
    const { civicTaskId } = req.params;
    const { stepId, status, completedSteps, currentStepId, percentage, procedureId } = req.body;

    if (stepId && status) {
      return updateStepProgress(req, res, next);
    }

    if (!mongoose.Types.ObjectId.isValid(civicTaskId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid civic task ID format',
      });
    }

    let progress = await UserProgress.findOne({
      userId: req.user._id,
      civicTaskId,
    });

    if (!progress) {
      if (!procedureId) {
        return res.status(400).json({
          success: false,
          message: 'procedureId is required to create a new user progress record',
        });
      }

      progress = await UserProgress.create({
        userId: req.user._id,
        civicTaskId,
        procedureId,
        completedSteps: completedSteps || [],
        currentStepId: currentStepId || null,
        percentage: percentage !== undefined ? percentage : 0,
      });
    } else {
      if (completedSteps !== undefined) progress.completedSteps = completedSteps;
      if (currentStepId !== undefined) progress.currentStepId = currentStepId;
      if (percentage !== undefined) progress.percentage = percentage;
      await progress.save();
    }

    const updatedProgress = await UserProgress.findById(progress._id)
      .populate('completedSteps')
      .populate('currentStepId');

    return res.json({
      success: true,
      data: updatedProgress,
    });
  } catch (error) {
    next(error);
  }
};
