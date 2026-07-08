import mongoose from 'mongoose';

const billingServiceSchema = new mongoose.Schema(
  {
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: true,
    },

    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: '',
    },

    category: {
      type: String,
      default: 'General',
    },

    unit: {
      type: String,
      enum: [
        'Hour',
        'Day',
        'Visit',
        'Session',
        'Medication',
        'Each',
      ],
      default: 'Visit',
    },

    rate: {
      type: Number,
      required: true,
      default: 0,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  'BillingService',
  billingServiceSchema
);