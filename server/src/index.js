import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import { crudRouter } from './routes/crud.js';
import * as Models from './models/index.js';
import certificationRoutes from './routes/certifications.js';
import documentRoutes from './routes/documents.js';
import staffRoutes from './routes/staff.js';
import licensingRoutes from './routes/licensing.js';
import hipaaRoutes from './routes/hipaa.js';
import guardianRoutes from './routes/guardians.js';
import appointments from './routes/appointments.js';
import behavioralRoutes from './routes/behavioral-incidents.js';
import visitRoutes from './routes/visits.js';
import guardianMessageRoutes from './routes/guardianMessages.js';
import guardianAuthRoutes from './routes/guardianAuth.js';
import superAdminAuthRoutes from './routes/superAdminAuth.js';
import facilityAuthRoutes from './routes/facilityAuth.js';
import facilityRoutes from './routes/facilities.js';
import billingRoutes from './routes/billing.js';
import billingResidentsRoutes from './routes/billingResidents.js';
import billingServicesRoutes from './routes/billingServices.js';
import billingServiceLogsRoutes from './routes/billingServiceLogs.js';
import payerRoutes from './routes/payers.js';
import billingInvoicesRoutes from './routes/billingInvoices.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json({ limit: '5mb' }));
app.use(
  '/api/super-admin-auth',
  superAdminAuthRoutes
);
app.use('/uploads', express.static('uploads'));

app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/guardian-auth', guardianAuthRoutes);

app.use(
  '/api/facility-auth',
  facilityAuthRoutes
);

app.use(
  '/api/billing',
  billingRoutes
);

app.use(
  '/api/billing/residents',
  billingResidentsRoutes
);

app.use('/api/facilities', facilityRoutes);

app.use(
  '/api/billing/services',
  billingServicesRoutes
);
app.use(
  '/api/billing/service-logs',
  billingServiceLogsRoutes
);
app.use(
  '/api/billing/invoices',
  billingInvoicesRoutes
);

app.use('/api/billing/payers', payerRoutes);


// Auto-generate CRUD routes for every model
const resourceMap = {
  'residents':             Models.Resident,
  'medications':           Models.Medication,
  'mar':                   Models.MarEntry,
  'incident-reports':      Models.IncidentReport,
  'notifications':         Models.Notification,
  'tasks':                 Models.Task,
  'bip-plans':             Models.BipPlan,
  'shifts':                Models.Shift,
  'training-courses':      Models.TrainingCourse,
  'outcome-metrics':       Models.OutcomeMetric,
  'audit':                 Models.AuditLog,
  'hipaa-log':             Models.HipaaAccessLog,
};

for (const [path, Model] of Object.entries(resourceMap)) {
  app.use(`/api/${path}`, crudRouter(Model));
  
}

app.use('/api/documents', documentRoutes);

// Custom populated certifications routes je jr siw sdoa disw  cjd ad 
app.use('/api/certifications', certificationRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/licensing', licensingRoutes);
app.use('/api/hipaa-log', hipaaRoutes);
app.use('/api/guardians', guardianRoutes);
app.use('/api/appointments', appointments);
app.use(
  '/api/behavioral-incidents',
  behavioralRoutes
);

app.use('/api/visits', visitRoutes);

app.use(
  '/api/guardian-messages',
  guardianMessageRoutes
);

app.use((err, _req, res, _next) => {
  
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/frontlines';

mongoose.connect(MONGO_URI).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
}).catch(err => {
  console.error('Mongo connection error:', err.message);
  process.exit(1);
});



