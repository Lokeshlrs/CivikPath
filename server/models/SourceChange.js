import mongoose from 'mongoose';

const sourceChangeSchema = new mongoose.Schema(
  {
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GovernmentSource',
      required: true,
      index: true,
    },
    previousHash: {
      type: String,
      default: '',
    },
    newHash: {
      type: String,
      default: '',
    },
    previousContent: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    newContent: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    changeSummary: {
      type: String,
      default: 'Content modification detected on official source page',
    },
    changeType: {
      type: String,
      enum: ['content_updated', 'hash_changed', 'structural_change', 'minor_update'],
      default: 'content_updated',
    },
    status: {
      type: String,
      enum: ['detected', 'reviewed', 'approved', 'rejected'],
      default: 'detected',
      index: true,
    },
    reviewStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    detectedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const SourceChange = mongoose.model('SourceChange', sourceChangeSchema);
