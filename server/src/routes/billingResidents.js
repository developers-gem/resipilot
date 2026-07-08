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

/**
 * Billing Resident Profile
 */
router.get('/:id', async (req, res, next) => {
  try {
    const resident = await Resident.findOne({
      _id: req.params.id,
      facility: req.facilityAdmin.facility._id,
    });

    if (!resident) {
      return res.status(404).json({
        error: 'Resident not found',
      });
    }

    res.json({
      resident,

      billing: {
        outstandingBalance: 0,
        currentPayer: '-',
        lastInvoice: null,
        activeServices: 0,
      },
    });
  } catch (err) {
    next(err);
  }
});


export default router;