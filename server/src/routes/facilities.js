import { Router } from 'express';
import bcrypt from 'bcryptjs';

import FacilityAdmin from '../models/FacilityAdmin.js';
import { Facility } from '../models/index.js';

import {
  requireSuperAdmin,
} from '../middleware/auth.js';

const router = Router();

router.use(requireSuperAdmin);

/**
 * List Facilities
 */
router.get('/', async (req, res, next) => {
  try {
    const facilities = await Facility.find().sort('-createdAt');

    res.json(facilities);
  } catch (err) {
    next(err);
  }
});

/**
 * Get One Facility
 */
router.get('/:id', async (req, res, next) => {
  try {
    const facility = await Facility.findById(req.params.id);

    if (!facility) {
      return res.status(404).json({
        error: 'Facility not found',
      });
    }

    res.json(facility);
  } catch (err) {
    next(err);
  }
});

/**
 * Create Facility
 */
router.post('/', async (req, res, next) => {
  try {
    const {
      adminName,
      adminEmail,
      adminPhone,
      adminPassword,

      ...facilityData
    } = req.body;

    // Check if email already exists
    const existingAdmin =
      await FacilityAdmin.findOne({
        email: adminEmail.toLowerCase(),
      });

    if (existingAdmin) {
      return res.status(400).json({
        error:
          'Facility administrator email already exists.',
      });
    }

    // Validate password
    if (
      !adminPassword ||
      adminPassword.length < 6
    ) {
      return res.status(400).json({
        error:
          'Password must be at least 6 characters.',
      });
    }

    const facility =
      await Facility.create(facilityData);

    const passwordHash =
      await bcrypt.hash(
        adminPassword,
        10
      );

    const names =
      (adminName || '')
        .trim()
        .split(' ');

    const firstName =
      names.shift() || 'Admin';

    const lastName =
      names.join(' ') || '';

    const admin =
      await FacilityAdmin.create({
        firstName,
        lastName,
        email: adminEmail.toLowerCase(),
        phone: adminPhone,

        passwordHash,

        facility: facility._id,

        active: true,
      });

    res.status(201).json({
      facility,
      admin,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Update Facility
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const facility =
      await Facility.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    res.json(facility);
  } catch (err) {
    next(err);
  }
});

/**
 * Delete Facility
 */
router.delete('/:id', async (req, res, next) => {
  try {
    await Facility.findByIdAndDelete(
      req.params.id
    );

    res.json({
      ok: true,
    });
  } catch (err) {
    next(err);
  }
});

export default router;