import { Dependency } from '../models/Dependency.js';
import mongoose from 'mongoose';

export const getDependenciesByProcedure = async (req, res, next) => {
  try {
    const { procedureId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(procedureId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid procedure ID format',
      });
    }

    const dependencies = await Dependency.find({ procedureId })
      .populate('fromStepId')
      .populate('toStepId');

    return res.json({
      success: true,
      data: dependencies,
    });
  } catch (error) {
    next(error);
  }
};

export const createDependency = async (req, res, next) => {
  try {
    const { procedureId, fromStepId, toStepId, dependencyType, description } = req.body;

    if (!procedureId || !fromStepId || !toStepId) {
      return res.status(400).json({
        success: false,
        message: 'procedureId, fromStepId, and toStepId are required',
      });
    }

    const dependency = await Dependency.create({
      procedureId,
      fromStepId,
      toStepId,
      dependencyType: dependencyType || 'prerequisite',
      description: description || '',
    });

    return res.status(201).json({
      success: true,
      data: dependency,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDependency = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid dependency ID format',
      });
    }

    const dependency = await Dependency.findByIdAndDelete(id);
    if (!dependency) {
      return res.status(404).json({
        success: false,
        message: 'Dependency not found',
      });
    }

    return res.json({
      success: true,
      message: 'Dependency deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
