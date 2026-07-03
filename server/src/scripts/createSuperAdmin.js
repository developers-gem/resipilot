import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import SuperAdmin from '../models/SuperAdmin.js';

await mongoose.connect(process.env.MONGO_URI);

const existing = await SuperAdmin.findOne({
  email: 'superadmin@habitatpilot.com',
});

if (existing) {
  console.log('Super Admin already exists');
  process.exit();
}

const passwordHash = await bcrypt.hash(
  'superadmin123',
  10
);

await SuperAdmin.create({
  firstName: 'Habitat',
  lastName: 'Pilot',
  email: 'superadmin@habitatpilot.com',
  passwordHash,
  active: true,
});

console.log('✅ Super Admin created');

process.exit();