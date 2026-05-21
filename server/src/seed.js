
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, Facility } from './models/index.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/frontlines';

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected');

  const email = 'admin@example.com';
  let admin = await User.findOne({ email });
  if (!admin) {
    admin = await User.create({
      email,
      passwordHash: await bcrypt.hash('admin123', 10),
      fullName: 'Site Admin',
      roles: ['admin'],
    });
    console.log('Created admin:', email, '/ admin123');
  } else {
    console.log('Admin already exists');
  }

  if (!(await Facility.findOne({ slug: 'sunrise' }))) {
    await Facility.create({ slug: 'sunrise', name: 'Sunrise House', capacity: 6, city: 'San Jose', state: 'CA' });
    console.log('Created Sunrise facility');
  }

  await mongoose.disconnect();
  console.log('Done');
}
run().catch(e => { console.error(e); process.exit(1); });
