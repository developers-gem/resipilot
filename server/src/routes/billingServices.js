import { Router } from 'express';

import { BillingService } from '../models/index.js';

import {
  requireFacilityAdmin,
} from '../middleware/auth.js';

const router = Router();

router.use(requireFacilityAdmin);

/*
 * List Services
 */

router.get('/', async (req, res, next) => {
  try {
    const services =
      await BillingService.find({
        facility:
          req.facilityAdmin.facility._id,
      }).sort('name');

    res.json(services);
  } catch (err) {
    next(err);
  }
});

/*
 * Create Service
 */

router.post('/', async (req, res, next) => {
  try {
    const service =
      await BillingService.create({
        ...req.body,

        facility:
          req.facilityAdmin.facility._id,
      });

    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
});

export default router;