import mongoose from 'mongoose';

const governmentSourceSchema = new mongoose.Schema(
  {
    sourceName: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      default: 'Government Department',
    },
    service: {
      type: String,
      default: 'Official Service',
    },
    serviceType: {
      type: String,
      default: 'General',
    },
    location: {
      state: { type: String, default: 'National' },
      district: { type: String, default: 'All' },
      city: { type: String, default: 'All' },
    },
    officialDomain: {
      type: String,
      default: 'gov.in',
      index: true,
    },
    domain: {
      type: String,
      default: '',
      index: true,
    },
    sourceUrl: {
      type: String,
      default: 'https://igod.gov.in/',
      index: true,
    },
    url: {
      type: String,
      default: '',
    },
    sourceType: {
      type: String,
      default: 'portal',
    },
    description: {
      type: String,
      default: '',
    },
    sourceStatus: {
      type: String,
      enum: ['demo', 'discovered', 'fetching', 'fetched', 'review_required', 'verified', 'rejected', 'inactive', 'error'],
      default: 'demo',
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    lastVerifiedAt: {
      type: Date,
      default: Date.now,
    },
    lastCheckedAt: {
      type: Date,
      default: Date.now,
    },
    lastUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    contentHash: {
      type: String,
      default: '',
    },
    extractedContent: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        title: '',
        cleanText: '',
        headers: [],
        metaDescription: '',
        wordCount: 0,
      },
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    reviewerNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const GovernmentSource = mongoose.model('GovernmentSource', governmentSourceSchema);
