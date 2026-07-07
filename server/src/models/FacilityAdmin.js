import mongoose from 'mongoose';

const facilityAdminSchema = new mongoose.Schema(
  {
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
  type: String,
  trim: true,
},

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: 'facility-admin',
    },

    active: {
      type: Boolean,
      default: true,
    },

    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  'FacilityAdmin',
  facilityAdminSchema
);