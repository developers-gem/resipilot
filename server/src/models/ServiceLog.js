import mongoose from 'mongoose';

const serviceLogSchema = new mongoose.Schema(
  {
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: true,
    },

    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resident',
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BillingService',
      required: true,
    },

    serviceCode: {
      type: String,
      required: true,
    },

    serviceName: {
      type: String,
      required: true,
    },

    unit: {
      type: String,
      required: true,
    },

    rate: {
      type: Number,
      required: true,
    },

    units: {
      type: Number,
      default: 1,
    },

    amount: {
      type: Number,
      required: true,
    },

    serviceDate: {
      type: Date,
      default: Date.now,
    },

    staffName: {
      type: String,
      default: '',
    },

    notes: {
      type: String,
      default: '',
    },

    status: {
      type: String,
      enum: [
        'Pending',
        'Approved',
        'Billed',
        'Cancelled',
      ],
      default: 'Pending',
    },

    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  'ServiceLog',
  serviceLogSchema
);