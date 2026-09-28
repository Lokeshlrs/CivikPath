import mongoose from 'mongoose';

const verificationReviewSchema = new mongoose.Schema({
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GovernmentSource',
    required: true,
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    enum: ['approved', 'rejected', 'edited'],
    required: true,
  },
  extractedData: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  reviewerComment: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const VerificationReview = mongoose.model('VerificationReview', verificationReviewSchema);
