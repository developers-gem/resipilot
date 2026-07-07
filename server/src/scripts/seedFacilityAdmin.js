import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import { Facility } from '../models/index.js';
import FacilityAdmin from '../models/FacilityAdmin.js';

const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb://localhost:27017/frontlines';

async function run() {
  await mongoose.connect(MONGO_URI);

  console.log('MongoDB connected');

  // -------------------------
  // Create Facility
  // -------------------------

  let facility = await Facility.findOne({
    name: 'Sunrise Care',
  });

  if (!facility) {
    facility = await Facility.create({
      name: 'Sunrise Care',
      slug: 'sunrise-care',

      type: 'FFA',

      addressLine1: '123 Main Street',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',

      phone: '(555) 555-5555',
      email: 'info@sunrisecare.com',

      capacity: 25,
    });

    console.log('Facility created');
  }

  // -------------------------
  // Create Facility Admin
  // -------------------------

  const email = 'admin@sunrisecare.com';

  let admin = await FacilityAdmin.findOne({
    email,
  });

  if (!admin) {
    admin = await FacilityAdmin.create({
      facility: facility._id,

      firstName: 'John',
      lastName: 'Smith',

      email,

      passwordHash: await bcrypt.hash(
        'admin123',
        10
      ),
    });

    console.log('Facility Admin created');
  }

  console.log();

  console.log('=====================');

  console.log('Facility Login');

  console.log(email);

  console.log('admin123');

  console.log('=====================');

  process.exit();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

