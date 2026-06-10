import { Schema, model } from 'mongoose';

const VisitSchema = new Schema(
  {
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
        'Scheduled',
        'Completed',
        'Cancelled',
        'No Show',
      ],
      default: 'Scheduled',
    },

    notes: String,
  },
  { timestamps: true }
);

export default model('Visit', VisitSchema);