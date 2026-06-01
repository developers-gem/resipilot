// models/Guardian.js
import { Schema, model } from 'mongoose';

const GuardianSchema = new Schema({
  resident: {
    type: Schema.Types.ObjectId,
    ref: 'Resident',
    required: true
  },

  type: {
    type: String,
    enum: [
      'Biological Family',
      'Foster Family',
      'Kinship Guardian',
      'Legal Guardian'
    ],
    default: 'Biological Family'
  },

  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  },

  relationship: {
    type: String,
    required: true
  },

  email: String,

  phone: {
    type: String,
    required: true
  },

  address: String,

  contactAuthorization: {
    type: String,
    enum: [
      'Approved - Supervised Visits',
      'Approved - Unsupervised Visits',
      'Phone Only',
      'No Contact'
    ],
    default: 'Approved - Supervised Visits'
  },

  backgroundCheckStatus: {
    type: String,
    enum: [
      'Pending',
      'Cleared',
      'Expired'
    ],
    default: 'Pending'
  },

  fosterLicenseNumber: String,

  visitsAllowed: String,

  lastVisit: Date,

  approvedSince: Date,

  notes: String,

  active: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default model('Guardian', GuardianSchema);