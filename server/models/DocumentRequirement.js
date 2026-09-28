import mongoose from 'mongoose';

const documentRequirementSchema = new mongoose.Schema(
  {
    stepId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProcedureStep',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Document name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: true,
    },
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GovernmentSource',
    },
    sourceStatus: {
      type: String,
      enum: ['demo', 'verified', 'review_required', 'inactive', 'database_only'],
      default: 'demo',
    },
  },
  {
    timestamps: true,
  }
);

export const DocumentRequirement = mongoose.model('DocumentRequirement', documentRequirementSchema);
