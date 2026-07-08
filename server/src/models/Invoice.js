import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
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

    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },

    items: [
      {
        serviceLog: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ServiceLog',
        },

        serviceName: String,

        units: Number,

        rate: Number,

        amount: Number,
      },
    ],

    subtotal: Number,

    tax: {
      type: Number,
      default: 0,
    },

    total: Number,

    status: {
      type: String,
      enum: [
        'Draft',
        'Sent',
        'Paid',
        'Overdue',
      ],
      default: 'Draft',
    },

    dueDate: Date,

    paidDate: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  'Invoice',
  invoiceSchema
);