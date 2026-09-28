import mongoose from 'mongoose';

const procedureStepSchema = new mongoose.Schema(
  {
    procedureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Procedure',
      required: true,
      index: true,
    },
    nodeId: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      required: [true, 'Step title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['completed', 'current', 'pending', 'needs_attention', 'in_progress'],
      default: 'pending',
    },
    department: {
      type: String,
      default: 'Government Department',
    },
    locationMode: {
      type: String,
      default: 'Online Portal',
    },
    nextStep: {
      type: String,
      default: '',
    },
    sourceIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GovernmentSource',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const ProcedureStep = mongoose.model('ProcedureStep', procedureStepSchema);
