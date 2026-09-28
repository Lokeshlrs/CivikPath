import mongoose from 'mongoose';

const civicTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    procedureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Procedure',
      index: true,
    },
    location: {
      state: { type: String, default: 'Maharashtra' },
      district: { type: String, default: 'Amravati' },
      city: { type: String, default: 'Amravati' },
    },
    answers: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export const CivicTask = mongoose.model('CivicTask', civicTaskSchema);
