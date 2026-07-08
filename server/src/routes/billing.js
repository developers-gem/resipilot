import { Router } from 'express';

import BillingService from '../models/BillingService.js';
import ServiceLog from '../models/ServiceLog.js';
import { Resident } from '../models/index.js';

import { requireFacilityAdmin } from '../middleware/auth.js';

const router = Router();

router.use(requireFacilityAdmin);

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get('/dashboard', async (req, res, next) => {
  try {
    const facilityId = req.facilityAdmin.facility;

    const activeResidents = await Resident.countDocuments({
      facility: facilityId,
      isActive: true,
    });

    const outstanding = await ServiceLog.aggregate([
      {
        $match: {
          facility: facilityId,
          status: { $ne: 'Billed' },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$amount',
          },
        },
      },
    ]);

    const billed = await ServiceLog.aggregate([
      {
        $match: {
          facility: facilityId,
          status: 'Billed',
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$amount',
          },
        },
      },
    ]);

    const overdue = await ServiceLog.countDocuments({
      facility: facilityId,
      status: 'Pending',
    });

    res.json({
      activeResidents,
      outstanding:
        outstanding[0]?.total || 0,
      invoiced:
        billed[0]?.total || 0,
      overdueInvoices: overdue,
    });
  } catch (err) {
    next(err);
  }
});

/*
|--------------------------------------------------------------------------
| Residents
|--------------------------------------------------------------------------
*/

router.get('/residents', async (req, res, next) => {
  try {
    const residents = await Resident.find({
      facility: req.facilityAdmin.facility,
    })
      .select(
        'firstName lastName roomNumber medicaidId isActive'
      )
      .sort('firstName');

    res.json(residents);
  } catch (err) {
    next(err);
  }
});

/*
|--------------------------------------------------------------------------
| Services
|--------------------------------------------------------------------------
*/

router.get('/services', async (req, res, next) => {
  try {
    const services =
      await BillingService.find({
        facility: req.facilityAdmin.facility,
      }).sort('name');

    res.json(services);
  } catch (err) {
    next(err);
  }
});

router.post('/services', async (req, res, next) => {
  try {
    const service =
      await BillingService.create({
        ...req.body,
        facility:
          req.facilityAdmin.facility,
      });

    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
});

router.patch(
  '/services/:id',
  async (req, res, next) => {
    try {
      const service =
        await BillingService.findOneAndUpdate(
          {
            _id: req.params.id,
            facility:
              req.facilityAdmin.facility,
          },
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );

      res.json(service);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/services/:id',
  async (req, res, next) => {
    try {
      await BillingService.findOneAndDelete({
        _id: req.params.id,
        facility:
          req.facilityAdmin.facility,
      });

      res.json({
        ok: true,
      });
    } catch (err) {
      next(err);
    }
  }
);

/*
|--------------------------------------------------------------------------
| Service Logs
|--------------------------------------------------------------------------
*/

router.get('/service-logs', async (req, res, next) => {
  try {
    const logs =
      await ServiceLog.find({
        facility: req.facilityAdmin.facility,
      })
        .populate(
          'resident',
          'firstName lastName'
        )
        .populate(
          'service',
          'name code'
        )
        .sort('-serviceDate');

    res.json(logs);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/service-logs',
  async (req, res, next) => {
    try {
      const service =
        await BillingService.findById(
          req.body.service
        );

      if (!service) {
        return res.status(404).json({
          error: 'Service not found',
        });
      }

      const units =
        Number(req.body.units || 1);

      const log =
        await ServiceLog.create({
          facility:
            req.facilityAdmin.facility,

          resident:
            req.body.resident,

          service:
            service._id,

          serviceCode:
            service.code,

          serviceName:
            service.name,

          unit:
            service.unit,

          rate:
            service.rate,

          units,

          amount:
            units * service.rate,

          serviceDate:
            req.body.serviceDate,

          staffName:
            req.body.staffName,

          notes:
            req.body.notes,
        });

      res.status(201).json(log);
    } catch (err) {
      next(err);
    }
  }
);

export default router;