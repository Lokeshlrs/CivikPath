import { ProcedureStep } from '../models/ProcedureStep.js';
import mongoose from 'mongoose';

export const getStepsByProcedure = async (req, res, next) => {
  try {
    const { procedureId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(procedureId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid procedure ID format',
      });
    }

    const steps = await ProcedureStep.find({ procedureId }).sort({ order: 1 }).populate('sourceIds');
    return res.json({
      success: true,
      data: steps,
    });
  } catch (error) {
    next(error);
  }
};

export const getStepById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid step ID format',
      });
    }

    const step = await ProcedureStep.findById(id).populate('sourceIds');
    if (!step) {
      return res.status(404).json({
        success: false,
        message: 'Procedure step not found',
      });
    }

    return res.json({
      success: true,
      data: step,
    });
  } catch (error) {
    next(error);
  }
};

export const createStep = async (req, res, next) => {
  try {
    const { procedureId, nodeId, title, description, order, status, department, locationMode, nextStep, sourceIds } = req.body;

    if (!procedureId || !title) {
      return res.status(400).json({
        success: false,
        message: 'procedureId and title are required fields',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(procedureId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid procedure ID format',
      });
    }

    const step = await ProcedureStep.create({
      procedureId,
      nodeId: nodeId || '',
      title,
      description: description || '',
      order: order !== undefined ? order : 0,
      status: status || 'pending',
      department: department || '[Department]',
      locationMode: locationMode || 'Online Portal',
      nextStep: nextStep || '',
      sourceIds: sourceIds || [],
    });

    return res.status(201).json({
      success: true,
      data: step,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStep = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid step ID format',
      });
    }

    const step = await ProcedureStep.findByIdAndUpdate(id, req.body, { new: true });
    if (!step) {
      return res.status(404).json({
        success: false,
        message: 'Procedure step not found',
      });
    }

    return res.json({
      success: true,
      data: step,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStep = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid step ID format',
      });
    }

    const step = await ProcedureStep.findByIdAndDelete(id);
    if (!step) {
      return res.status(404).json({
        success: false,
        message: 'Procedure step not found',
      });
    }

    return res.json({
      success: true,
      message: 'Procedure step deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
