import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import FacilityAdmin from '../models/FacilityAdmin.js';
import { requireFacilityAdmin } from '../middleware/auth.js';

const router = Router();

function sign(admin) {
  return jwt.sign(
    {
      sub: admin._id.toString(),
      email: admin.email,
      role: 'facility-admin',
      facility: admin.facility,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
}

/**
 * Facility Admin Login
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await FacilityAdmin.findOne({
      email: (email || '').toLowerCase(),
    }).populate('facility');

    if (!admin || !admin.active) {
      return res.status(401).json({
        error: 'Invalid credentials',
      });
    }

    const ok = await bcrypt.compare(
      password,
      admin.passwordHash
    );

    if (!ok) {
      return res.status(401).json({
        error: 'Invalid credentials',
      });
    }

    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      token: sign(admin),
      admin,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Current Facility Admin
 */
router.get(
  '/me',
  requireFacilityAdmin,
  async (req, res) => {
    res.json({
      admin: req.facilityAdmin,
    });
  }
);

export default router;