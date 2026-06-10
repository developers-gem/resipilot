import { Schema, model } from 'mongoose';

const GuardianMessageSchema = new Schema(
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

    message: {
      type: String,
      required: true,
    },

    direction: {
      type: String,
      enum: ['Incoming', 'Outgoing'],
      default: 'Outgoing',
    },
  },
  { timestamps: true }
);

export default model(
  'GuardianMessage',
  GuardianMessageSchema
);