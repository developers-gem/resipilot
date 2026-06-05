import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const opts = { timestamps: true };
const ref = (m) => ({ type: Schema.Types.ObjectId, ref: m });

// ---------- USERS ----------
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: String,
  avatarUrl: String,
  roles: { type: [String], enum: ['admin', 'supervisor', 'staff', 'nurse', 'guardian'], default: ['staff'] },
  isActive: { type: Boolean, default: true },
  lastLoginAt: Date,
}, opts);
UserSchema.methods.toJSON = function () {
  const o = this.toObject(); delete o.passwordHash; return o;
};
export const User = model('User', UserSchema);

// ---------- FACILITIES ----------
export const Facility = model('Facility', new Schema({
  slug: {
    type: String,
    unique: true,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  type: {
    type: String,
    default: 'FFA'
  },

  // ADDRESS
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  postalCode: String,

  // CONTACT
  phone: String,
  email: String,

  // LICENSE
  licenseNumber: String,
  licenseIssueDate: Date,
  licenseExpiryDate: Date,

  // FACILITY INFO
  capacity: {
    type: Number,
    default: 0
  },

  manager: String,

  populationServed: String,

  specializations: [String],

  notes: String,

  // STATUS
  isActive: {
    type: Boolean,
    default: true
  }

}, opts));

// ---------- STAFF ----------
export const Staff = model('Staff', new Schema({
  fullName: {
    type: String,
    required: true,
  },
  employeeId: { type: String, unique: true, sparse: true },
  facility: ref('Facility'),
  title: String,
  hiredAt: Date,
  terminatedAt: Date,
  hourlyRate: Number,
  notes: String,
}, opts));



// ---------- RESIDENTS ----------
// ---------- RESIDENTS ----------
export const Resident = model('Resident', new Schema({

  // FACILITY
  facility: {
    ...ref('Facility'),
    required: true
  },

  // BASIC INFO
  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  },

  preferredName: String,

  dateOfBirth: {
    type: Date,
    required: true
  },

  gender: String,
  pronouns: String,

  ethnicity: String,
  primaryLanguage: String,

  // REFERRAL
  referringAgency: String,
  referralWorker: String,
  placementReason: String,

  // PLACEMENT
  admissionDate: {
    type: Date,
    default: Date.now
  },

  placementDate: Date,

  dischargeDate: Date,

  roomNumber: String,

  placementType: String,

  legalStatus: String,

  permanencyGoal: String,

  caseNumber: String,

  school: String,

  // RISK / HEALTH
  riskLevel: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    default: 'low'
  },

  primaryDiagnosis: String,

  diagnoses: String,

  medications: String,

  physician: String,

  psychotropicMedications: String,

  allergies: String,

  safetyConcerns: String,

  priorPlacements: String,

  traumaHistory: String,

  photoUrl: String,

  // TEAM
  caseworker: String,

  supervisor: String,

  therapist: String,

  casaVolunteer: String,

  countyWorker: String,

  // GUARDIAN
  guardianName: String,

  guardianPhone: String,

  guardianRestrictions: String,

  emergencyContact: String,

  restrictedIndividuals: String,

  guardians: [{
    guardian: ref('Guardian'),
    isPrimary: Boolean
  }],

  // STATUS
  isActive: {
    type: Boolean,
    default: true
  }

}, opts));

// ---------- APPOINTMENTS ----------
export const Appointment = model('Appointment', new Schema({
  resident: { ...ref('Resident'), required: true },
  staff: ref('Staff'),
  title: { type: String, required: true },
  apptType: String,
  providerName: String,
  location: String,
  scheduledAt: { type: Date, required: true },
  durationMin: { type: Number, default: 30 },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled', 'no_show'], default: 'scheduled' },
  notes: String,
}, opts));

// ---------- MEDICATIONS + MAR ----------
export const Medication = model('Medication', new Schema({
  resident: { ...ref('Resident'), required: true },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  route: String,
  frequency: { type: String, required: true },
  schedule: [String],   // ["08:00","20:00"]
  prescriber: String,
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  isPrn: { type: Boolean, default: false },
  notes: String,
}, opts));

export const MarEntry = model('MarEntry', new Schema({
  medication: { ...ref('Medication'), required: true },
  resident: { ...ref('Resident'), required: true },
  scheduledAt: { type: Date, required: true },
  administeredAt: Date,
  status: { type: String, enum: ['pending', 'given', 'refused', 'other', 'missed'], default: 'pending' },
  administeredBy: ref('Staff'),
  note: String,
}, opts));

// ---------- BEHAVIORAL ----------
export const BehavioralIncident = model('BehavioralIncident', new Schema({
  resident: { ...ref('Resident'), required: true },
  reportedBy: ref('Staff'),
  occurredAt: { type: Date, required: true },
  location: String,
  behaviorTypes: [String],
  severity: { type: String, enum: ['1', '2', '3', '4', '5'], required: true },
  antecedent: String,
  behavior: { type: String, required: true },
  consequence: String,
  interventions: [String],
  durationMin: Number,
  injury: { type: Boolean, default: false },
  notified: [String],
  signature: String,
  signedAt: Date,
  locked: { type: Boolean, default: false },
  followups: [{ author: ref('User'), note: String, createdAt: { type: Date, default: Date.now } }],
}, opts));

// ---------- INCIDENT REPORTS ----------
export const IncidentReport = model('IncidentReport', new Schema({
  resident: ref('Resident'),
  facility: ref('Facility'),
  relatedIncident: ref('BehavioralIncident'),
  filedBy: ref('User'),

  incidentDate: Date,
  incidentTime: String,

  location: String,

  description: {
    type: String,
    required: true
  },

  immediateActions: String,

  staffESignature: String,

  severity: {
    type: String,
    enum: ['1', '2', '3', '4', '5']
  },

  status: {
    type: String,
    enum: [
      'draft',
      'submitted',
      'under_review',
      'closed'
    ],
    default: 'draft'
  },

  filedAt: Date,
  dueAt: Date,
  externalRef: String,
  attachments: Schema.Types.Mixed

}, opts));

// ---------- NOTIFICATIONS ----------
export const Notification = model('Notification', new Schema({
  user: { ...ref('User'), required: true },
  type: { type: String, enum: ['alert', 'info', 'warning', 'reminder'], default: 'info' },
  title: { type: String, required: true },
  body: String,
  link: String,
  isRead: { type: Boolean, default: false },
  readAt: Date,
}, opts));


// ---------- LICENSING ----------
export const LicensingRecord = model(
  'LicensingRecord',
  new Schema(
    {
      facility: {
        ...ref('Facility'),
        required: true,
      },

      agency: {
        type: String,
        required: true,
      },

      licenseType: {
        type: String,
        required: true,
      },

      licenseNumber: {
        type: String,
        required: true,
      },

      issuedOn: Date,

      expiresOn: {
        type: Date,
        required: true,
      },

      status: {
        type: String,
        enum: [
          'active',
          'renewal_due',
          'expired',
          'suspended',
        ],
        default: 'active',
      },

      capacity: Number,

      census: Number,

      lastInspectionDate: Date,

      inspectionResult: {
        type: String,
        default: 'No deficiencies',
      },

      violationsCount: {
        type: Number,
        default: 0,
      },

      inspectionReportUrl: String,

      renewalStarted: {
        type: Boolean,
        default: false,
      },

      documentUrl: String,

      notes: String,
    },
    opts
  )
);

// ---------- AUDIT ----------
export const AuditLog = model('AuditLog', new Schema({
  user: ref('User'),
  tableName: { type: String, required: true },
  rowId: String,
  action: { type: String, required: true },
  diff: Schema.Types.Mixed,
  ipAddress: String,
}, opts));

// ---------- METRICS ----------
export const OutcomeMetric = model('OutcomeMetric', new Schema({
  resident: ref('Resident'),
  facility: ref('Facility'),
  metricKey: { type: String, required: true },
  metricValue: { type: Number, required: true },
  periodStart: { type: Date, required: true },
  periodEnd: { type: Date, required: true },
}, opts));


// ---------- DOCUMENTS ----------
export const Document = model('Document', new Schema({
  resident: ref('Resident'),
  facility: ref('Facility'),
  uploadedBy: ref('User'),



  description: String,

  category: {
    type: String,
    enum: [
      'consent',
      'medical',
      'legal',
      'education',
      'placement',
      'casa',
      'case-plan',
      'other'
    ],
    default: 'other'
  },

  fileUrl: {
    type: String,
    required: true
  },

  documentDate: Date,

  requiresESign: {
    type: String,
    enum: [
      'none',
      'guardian',
      'court',
      'staff'
    ],
    default: 'none'
  },

  status: {
    type: String,
    enum: [
      'Awaiting',
      'Signed',
      'In progress'
    ],
    default: 'Awaiting'
  },

  signatureProvider: String,

  isConfidential: {
    type: Boolean,
    default: true
  },

  expiresOn: Date,

}, opts));


// ---------- TRAINING / CERTS ----------
export const TrainingCourse = model('TrainingCourse', new Schema({

  name: { type: String, required: true },
  description: String,
  requiredFor: [String],
  validMonths: { type: Number, default: 12 },
}, opts));

export const StaffCertification = model('StaffCertification', new Schema({
  staff: { ...ref('Staff'), required: true },
  course: ref('TrainingCourse'),
  issuedOn: { type: Date, required: true },
  expiresOn: { type: Date, required: true },
  status: { type: String, enum: ['valid', 'expiring', 'expired'], default: 'valid' },
  certificateUrl: String,
}, opts));

// ---------- TASKS ----------
export const Task = model('Task', new Schema({
  assignedTo: ref('User'),
  createdBy: ref('User'),
  resident: ref('Resident'),
  facility: ref('Facility'),
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['todo', 'in_progress', 'done', 'blocked'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  dueAt: Date,
  completedAt: Date,
}, opts));

export const BipPlan = model('BipPlan', new Schema({
  resident: { ...ref('Resident'), required: true },
  author: ref('User'),

  title: { type: String, required: true },

  targetBehavior: { type: String, required: true },

  antecedents: String,

  behaviorDefinition: String,

  behaviorFunction: String,

  replacement: String,

  reinforcement: String,

  crisisPlan: String,

  status: {
    type: String,
    enum: ['draft', 'active', 'archived'],
    default: 'draft'
  },

  effectiveFrom: Date,

  effectiveTo: Date,

  strategies: [{
    phase: String,
    description: String,
    sortOrder: Number
  }]
}, opts));

// ---------- SHIFTS ----------
export const Shift = model('Shift', new Schema({
  facility: { ...ref('Facility'), required: true },
  staff: ref('Staff'),
  shiftType: { type: String, enum: ['day', 'evening', 'night'], required: true },
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  handoffNote: String,
}, opts));

// -----------------HIPPA------------

export const HipaaAccessLog = model(
  'HipaaAccessLog',
  new Schema(
    {
      timestamp: {
        type: Date,
        default: Date.now,
      },

      action: {
        type: String,
        enum: [
          'View',
          'Export',
          'Create',
          'Update',
          'Delete',
          'Blocked',
        ],
        required: true,
      },

      userName: {
        type: String,
        required: true,
      },

      role: String,

      description: String,

      result: {
        type: String,
        enum: [
          'Authorised',
          'Export',
          'OK',
          'Blocked',
        ],
        default: 'Authorised',
      },

      ipAddress: String,

      duration: String,

      notes: String,
    },
    opts
  )
);