import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    civicTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CivicTask',
      required: true,
      index: true,
    },
    procedureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Procedure',
      required: true,
    },
    completedSteps: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProcedureStep',
      },
    ],
    currentStepId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProcedureStep',
    },
    stepStatuses: {
      type: Map,
      of: String,
      default: {},
    },
    percentage: {
      type: Number,
      default: 0,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const UserProgress = mongoose.model('UserProgress', userProgressSchema);
