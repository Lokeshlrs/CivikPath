import mongoose from 'mongoose';

const dependencySchema = new mongoose.Schema({
  procedureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Procedure',
    required: true,
    index: true,
  },
  fromStepId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProcedureStep',
    required: true,
  },
  toStepId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProcedureStep',
    required: true,
  },
  dependencyType: {
    type: String,
    default: 'prerequisite',
  },
  description: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Dependency = mongoose.model('Dependency', dependencySchema);
