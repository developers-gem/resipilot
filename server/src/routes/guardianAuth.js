import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Guardian from '../models/Guardian.js';
import { requireGuardian } from '../middleware/auth.js';

const router = Router();

function sign(guardian) {
  return jwt.sign(
    {
      sub: guardian._id.toString(),
      email: guardian.email,
      role: 'guardian',
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
}

/**
 * Guardian Login
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const guardian = await Guardian.findOne({
      email: (email || '').toLowerCase(),
    })
    .populate({
  path: 'resident',
  select: `
    firstName
    lastName
    preferredName
    gender
    dob
    admissionDate
    dischargeDate
    diagnosis
    allergies
    room
    riskLevel
    status
    facility
  `,
  populate: {
    path: 'facility',
    select: 'name city state',
  },
});

    if (!guardian || !guardian.active) {
      return res.status(401).json({
        error: 'Invalid credentials',
      });
    }

    const ok = await bcrypt.compare(
      password,
      guardian.passwordHash
    );

    if (!ok) {
      return res.status(401).json({
        error: 'Invalid credentials',
      });
    }

    await guardian.save();

    res.json({
      token: sign(guardian),
      guardian,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Logged in Guardian
 */
router.get(
  '/me',
  requireGuardian,
  async (req, res) => {
    res.json({
      guardian: req.guardian,
    });
  }
);

export default router;