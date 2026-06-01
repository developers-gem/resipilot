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

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json({ limit: '5mb' }));

app.use('/uploads', express.static('uploads'));

app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);

// Auto-generate CRUD routes for every model
const resourceMap = {
  'facilities':            Models.Facility,
  'residents':             Models.Resident,
  // 'staff':                 Models.Staff,
  // 'guardians':             Models.Guardian,
  'appointments':          Models.Appointment,
  'medications':           Models.Medication,
  'mar':                   Models.MarEntry,
  'behavioral-incidents':  Models.BehavioralIncident,
  'incident-reports':      Models.IncidentReport,
  'notifications':         Models.Notification,
  // 'documents':             Models.Document,
  'tasks':                 Models.Task,
  'bip-plans':             Models.BipPlan,
  'shifts':                Models.Shift,
  // 'licensing':             Models.LicensingRecord,
  // 'certifications':        Models.StaffCertification,
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
