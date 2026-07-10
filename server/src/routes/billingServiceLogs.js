import { Router } from 'express';
import {
  ServiceLog,
  BillingService,
} from '../models/index.js';
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
      .sort('-serviceDate');

    res.json(logs);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const service = await BillingService.findById(
      req.body.service
    );

    if (!service) {
      return res.status(404).json({
        error: 'Billing service not found.',
      });
    }

    const units = Number(req.body.units || 1);

    const log = await ServiceLog.create({
      facility: req.facilityAdmin.facility,

      resident: req.body.resident,

      service: service._id,

      serviceCode: service.code,

      serviceName: service.name,

      unit: service.unit,

      rate: service.rate,

      units,

      amount: units * service.rate,

      serviceDate: req.body.serviceDate,

      staffName: req.body.staffName,

      notes: req.body.notes,

      status: 'Pending',
    });

    const populated = await ServiceLog.findById(log._id)
      .populate('resident')
      .populate('service');

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await ServiceLog.findByIdAndDelete(req.params.id);

    res.json({
      ok: true,
    });
  } catch (err) {
    next(err);
  }
});

export default router;