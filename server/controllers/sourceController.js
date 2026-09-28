import { GovernmentSource } from '../models/GovernmentSource.js';
import { VerificationReview } from '../models/VerificationReview.js';
import { Procedure } from '../models/Procedure.js';
import { ProcedureStep } from '../models/ProcedureStep.js';
import { ingestSourceUrl } from '../services/sourceIngestionService.js';
import {
  getVerifiedSources,
  getVerifiedSourceById,
  searchVerifiedSources,
} from '../services/verifiedSourceRetrievalService.js';
import mongoose from 'mongoose';

export const ingestSource = async (req, res, next) => {
  try {
    const { url, department, serviceType, location } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'Source URL is required for ingestion',
      });
    }

    const result = await ingestSourceUrl({ url, department, serviceType, location });
    return res.status(result.statusCode || 200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getSources = async (req, res, next) => {
  try {
    const { sourceStatus, verificationStatus, domain, search } = req.query;
    const filter = {};

    if (sourceStatus) filter.sourceStatus = sourceStatus;
    if (verificationStatus) filter.verificationStatus = verificationStatus;
    if (domain) filter.officialDomain = new RegExp(domain, 'i');
    if (search) {
      filter.$or = [
        { department: new RegExp(search, 'i') },
        { service: new RegExp(search, 'i') },
        { officialDomain: new RegExp(search, 'i') },
        { sourceUrl: new RegExp(search, 'i') },
      ];
    }

    const sources = await GovernmentSource.find(filter).sort({ updatedAt: -1 });
    return res.json({
      success: true,
      data: sources,
    });
  } catch (error) {
    next(error);
  }
};

export const getVerifiedSourcesList = async (req, res, next) => {
  try {
    const data = await getVerifiedSources(req.query);
    return res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getVerifiedSourceSingle = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid source ID format',
      });
    }

    const source = await getVerifiedSourceById(id);
    if (!source) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: The requested source does not exist or has not received admin verification approval',
      });
    }

    return res.json({
      success: true,
      data: source,
    });
  } catch (error) {
    next(error);
  }
};

export const searchVerifiedSourcesHandler = async (req, res, next) => {
  try {
    const query = req.query.q || req.query.query || '';
    const result = await searchVerifiedSources(query);
    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSourceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid source ID format',
      });
    }

    const source = await GovernmentSource.findById(id).populate('reviewedBy', 'name email');
    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Government source not found',
      });
    }

    return res.json({
      success: true,
      data: source,
    });
  } catch (error) {
    next(error);
  }
};

export const verifySource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { notes, extractedData } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid source ID format',
      });
    }

    const source = await GovernmentSource.findByIdAndUpdate(
      id,
      {
        sourceStatus: 'verified',
        verificationStatus: 'approved',
        reviewedBy: req.user?._id || null,
        reviewedAt: new Date(),
        lastVerifiedAt: new Date(),
        reviewerNotes: notes || 'Source verified as official government information',
      },
      { new: true }
    );

    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Government source not found',
      });
    }

    const review = await VerificationReview.create({
      sourceId: source._id,
      reviewerId: req.user?._id || new mongoose.Types.ObjectId(),
      action: 'approved',
      extractedData: extractedData || source.extractedContent || {},
      reviewerComment: notes || 'Verified official government source',
    });

    return res.json({
      success: true,
      message: 'Government source successfully verified',
      data: {
        source,
        review,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const rejectSource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid source ID format',
      });
    }

    const source = await GovernmentSource.findByIdAndUpdate(
      id,
      {
        sourceStatus: 'rejected',
        verificationStatus: 'rejected',
        reviewedBy: req.user?._id || null,
        reviewedAt: new Date(),
        reviewerNotes: notes || 'Source rejected during administrator review',
      },
      { new: true }
    );

    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Government source not found',
      });
    }

    const review = await VerificationReview.create({
      sourceId: source._id,
      reviewerId: req.user?._id || new mongoose.Types.ObjectId(),
      action: 'rejected',
      reviewerComment: notes || 'Rejected official government source',
    });

    // Automatically transition linked procedures to review_required
    const linkedSteps = await ProcedureStep.find({ sourceIds: source._id });
    if (linkedSteps.length > 0) {
      const procIds = linkedSteps.map((s) => s.procedureId);
      await Procedure.updateMany({ _id: { $in: procIds } }, { sourceStatus: 'review_required' });
    }

    return res.json({
      success: true,
      message: 'Government source successfully rejected',
      data: {
        source,
        review,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const checkSource = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid source ID format',
      });
    }

    const source = await GovernmentSource.findById(id);
    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Government source not found',
      });
    }

    const result = await ingestSourceUrl({
      url: source.sourceUrl || source.url,
      department: source.department,
      serviceType: source.serviceType,
      location: source.location,
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateSource = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid source ID format',
      });
    }

    const source = await GovernmentSource.findByIdAndUpdate(id, req.body, { new: true });
    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Government source not found',
      });
    }

    if (source.sourceStatus === 'rejected' || source.sourceStatus === 'flagged' || source.sourceStatus === 'review_required') {
      const linkedSteps = await ProcedureStep.find({ sourceIds: source._id });
      if (linkedSteps.length > 0) {
        const procIds = linkedSteps.map((s) => s.procedureId);
        await Procedure.updateMany({ _id: { $in: procIds } }, { sourceStatus: 'review_required' });
      }
    }

    return res.json({
      success: true,
      data: source,
    });
  } catch (error) {
    next(error);
  }
};
