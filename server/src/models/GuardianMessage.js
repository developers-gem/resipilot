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

    sender: {
      type: String,
      enum: ['Guardian', 'Staff'],
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: Date,
  },
  {
    timestamps: true,
  }
);

export default model('GuardianMessage', GuardianMessageSchema);