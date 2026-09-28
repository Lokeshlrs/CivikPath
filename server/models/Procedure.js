import mongoose from 'mongoose';

const procedureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Procedure title is required'],
      trim: true,
      index: true,
    },
    aliases: [
      {
        type: String,
        trim: true,
        index: true,
      },
    ],
    keywords: [
      {
        type: String,
        trim: true,
        index: true,
      },
    ],
    description: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      default: 'General Department',
      index: true,
    },
    sector: {
      type: String,
      default: 'Citizen Services',
      index: true,
    },
    serviceType: {
      type: String,
      default: 'Citizen Services',
    },
    jurisdiction: {
      type: String,
      default: 'Municipal Corporation',
    },
    state: {
      type: String,
      required: true,
      default: 'Maharashtra',
      index: true,
    },
    district: {
      type: String,
      required: true,
      default: 'Amravati',
      index: true,
    },
    city: {
      type: String,
      required: true,
      default: 'Amravati',
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'review', 'published', 'archived'],
      default: 'published',
      index: true,
    },
    sourceStatus: {
      type: String,
      enum: ['demo', 'verified', 'review_required', 'inactive', 'database_only', 'unverified'],
      default: 'database_only',
      index: true,
    },
    officialSourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GovernmentSource',
    },
    relatedProcedureIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Procedure',
      },
    ],
    version: {
      type: String,
      default: '1.0',
    },
  },
  {
    timestamps: true,
  }
);

procedureSchema.index({ title: 'text', aliases: 'text', keywords: 'text', description: 'text' });

export const Procedure = mongoose.model('Procedure', procedureSchema);
