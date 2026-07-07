import { Router } from 'express';

import { Resident } from '../models/index.js';

import {
  requireFacilityAdmin,
} from '../middleware/auth.js';

const router = Router();

router.use(requireFacilityAdmin);

/**
 * Billing Dashboard
 */
router.get('/dashboard', async (req, res, next) => {
  try {
    const facilityId =
      req.facilityAdmin.facility._id;

    const activeResidents =
      await Resident.countDocuments({
        facility: facilityId,
        isActive: true,
      });

    res.json({
      activeResidents,

      outstandingAR: 0,

      totalInvoiced: 0,

      overdueInvoices: 0,

      recentInvoices: [],
    });
  } catch (err) {
    next(err);
  }
});

export default router;