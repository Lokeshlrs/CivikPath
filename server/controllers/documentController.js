import { DocumentRequirement } from '../models/DocumentRequirement.js';
import mongoose from 'mongoose';

export const getDocumentsByStep = async (req, res, next) => {
  try {
    const { stepId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(stepId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid step ID format',
      });
    }

    const documents = await DocumentRequirement.find({ stepId }).populate('sourceId');
    return res.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

export const createDocument = async (req, res, next) => {
  try {
    const { stepId, name, description, required, sourceId, sourceStatus } = req.body;

    if (!stepId || !name) {
      return res.status(400).json({
        success: false,
        message: 'stepId and document name are required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(stepId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid step ID format',
      });
    }

    const document = await DocumentRequirement.create({
      stepId,
      name,
      description: description || '',
      required: required !== undefined ? required : true,
      sourceId: sourceId || null,
      sourceStatus: sourceStatus || 'demo',
    });

    return res.status(201).json({
      success: true,
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDocument = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document ID format',
      });
    }

    const document = await DocumentRequirement.findByIdAndUpdate(id, req.body, { new: true });
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document requirement not found',
      });
    }

    return res.json({
      success: true,
      data: document,
    });
  } catch (error) {
    next(error);
  }
};
