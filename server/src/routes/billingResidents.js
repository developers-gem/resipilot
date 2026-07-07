import { Router } from 'express';

import { Resident } from '../models/index.js';

import {
  requireFacilityAdmin,
} from '../middleware/auth.js';

const router = Router();

router.use(requireFacilityAdmin);

/**
 * Billing Residents
 */
router.get('/', async (req, res, next) => {
  try {
    const facilityId =
      req.facilityAdmin.facility._id;

    const residents =
      await Resident.find({
        facility: facilityId,
      })
        .sort('firstName lastName')
        .lean();

    res.json(residents);
  } catch (err) {
    next(err);
  }
});

export default router;