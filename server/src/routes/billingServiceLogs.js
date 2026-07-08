import { Router } from 'express';
import { ServiceLog } from '../models/index.js';
import { requireFacilityAdmin } from '../middleware/auth.js';

const router = Router();

router.use(requireFacilityAdmin);

router.get('/', async (req, res, next) => {
  try {
    const logs = await ServiceLog.find({
      facility: req.facilityAdmin.facility,
    })
      .populate('resident')
      .populate('service')
      .sort('-createdAt');

    res.json(logs);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const log = await ServiceLog.create({
      ...req.body,
      facility: req.facilityAdmin.facility,
    });

    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await ServiceLog.findByIdAndDelete(req.params.id);

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;