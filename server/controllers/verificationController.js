import { GovernmentSource } from '../models/GovernmentSource.js';
import { VerificationReview } from '../models/VerificationReview.js';
import mongoose from 'mongoose';

export const getPendingVerifications = async (req, res, next) => {
  try {
    const pendingSources = await GovernmentSource.find({
      $or: [
        { verificationStatus: 'pending' },
        { sourceStatus: 'review_required' },
      ],
    }).sort({ updatedAt: -1 });

    return res.json({
      success: true,
      data: pendingSources,
    });
  } catch (error) {
    next(error);
  }
};

export const approveVerification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment, extractedData } = req.body;

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
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
        lastVerifiedAt: new Date(),
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
      reviewerId: req.user._id,
      action: 'approved',
      extractedData: extractedData || source.extractedContent || {},
      reviewerComment: comment || 'Source verified by administrator',
    });

    return res.json({
      success: true,
      data: {
        source,
        review,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const rejectVerification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid source ID format',
      });
    }

    const source = await GovernmentSource.findByIdAndUpdate(
      id,
      {
        sourceStatus: 'inactive',
        verificationStatus: 'rejected',
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
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
      reviewerId: req.user._id,
      action: 'rejected',
      reviewerComment: comment || 'Source rejected by administrator',
    });

    return res.json({
      success: true,
      data: {
        source,
        review,
      },
    });
  } catch (error) {
    next(error);
  }
};
