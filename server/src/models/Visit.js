import { Schema, model } from 'mongoose';

const VisitSchema = new Schema({
  guardian: {
    type: Schema.Types.ObjectId,
    ref: 'Guardian',
    required: true,
  },

  resident: {
    type: Schema.Types.ObjectId,
    ref: 'Resident',
    required: true,
  },

  scheduledFor: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: [
      'Pending',
      'Approved',
      'Rejected',
      'Completed',
      'Cancelled',
      'No Show',
    ],
    default: 'Pending',
  },

  notes: String,

  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  approvedAt: Date,
}, { timestamps: true });

export default model('Visit', VisitSchema);
