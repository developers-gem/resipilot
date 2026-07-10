import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import Guardian from '../models/Guardian.js';

import SuperAdmin from '../models/SuperAdmin.js';
import FacilityAdmin from '../models/FacilityAdmin.js';



export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('-passwordHash');
    if (!user || !user.isActive) return res.status(401).json({ error: 'Invalid user' });
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const has = (req.user.roles || []).some(r => allowed.includes(r));
    if (!has) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}


export async function requireGuardian(req, res, next) {
  try {
    const header = req.headers.authorization || '';

    console.log('HEADER:', header);

    const token = header.startsWith('Bearer ')
      ? header.slice(7)
      : null;

    if (!token) {
      console.log('NO TOKEN');
      return res.status(401).json({ error: 'Missing token' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    console.log('PAYLOAD:', payload);

    const guardian = await Guardian.findById(payload.sub)
      .populate({
        path: 'resident',
        populate: {
          path: 'facility',
        },
      });

    console.log('GUARDIAN:', guardian);

    if (!guardian) {
      console.log('Guardian not found');
      return res.status(401).json({ error: 'Guardian not found' });
    }

    if (!guardian.active) {
      console.log('Guardian inactive');
      return res.status(401).json({ error: 'Guardian inactive' });
    }

    req.guardian = guardian;

    next();
  } catch (err) {
    console.log('AUTH ERROR:', err);

    return res.status(401).json({
      error: err.message,
    });
  }
}


export async function requireSuperAdmin(
  req,
  res,
  next
) {
  try {
    const header =
      req.headers.authorization || '';

    const token = header.startsWith('Bearer ')
      ? header.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({
        error: 'Missing token',
      });
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const admin =
      await SuperAdmin.findById(
        payload.sub
      ).select('-passwordHash');

    if (!admin || !admin.active) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }

    req.superAdmin = admin;

    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Invalid token',
    });
  }
}

export async function requireFacilityAdmin(
  req,
  res,
  next
) {
   try {
    console.log('AUTH HEADER:', req.headers.authorization);

    const auth = req.headers.authorization;

    if (!auth?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }


    const token = auth.split(' ')[1];

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const admin = await FacilityAdmin.findById(
      payload.sub
    ).populate('facility');

    if (!admin || !admin.active) {
      return res
        .status(401)
        .json({ error: 'Unauthorized' });
    }

    req.facilityAdmin = admin;

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: 'Unauthorized' });
  }
}