import { Router } from 'express';
import { Invoice, ServiceLog } from '../models/index.js';
import { requireFacilityAdmin } from '../middleware/auth.js';

const router = Router();

router.use(requireFacilityAdmin);

/*
|--------------------------------------------------------------------------
| List Invoices
|--------------------------------------------------------------------------
*/

router.get('/', async (req, res, next) => {
  try {
    const invoices = await Invoice.find({
      facility: req.facilityAdmin.facility,
    })
      .populate('resident')
      .sort('-createdAt');

    res.json(invoices);
  } catch (err) {
    next(err);
  }
});

/*
|--------------------------------------------------------------------------
| Generate Invoice
|--------------------------------------------------------------------------
*/

router.post('/generate', async (req, res, next) => {
  try {
    const {
      resident,
      fromDate,
      toDate,
    } = req.body;

    const logs = await ServiceLog.find({
      facility: req.facilityAdmin.facility,
      resident,
      status: 'Pending',
      serviceDate: {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      },
    });

    if (!logs.length) {
      return res.status(400).json({
        error: 'No pending service logs found.',
      });
    }

    const subtotal = logs.reduce(
      (sum, l) => sum + l.amount,
      0
    );

    const invoice = await Invoice.create({
      facility: req.facilityAdmin.facility,

      resident,

      invoiceNumber:
        'INV-' + Date.now(),

      items: logs.map(log => ({
        serviceLog: log._id,
        serviceName: log.serviceName,
        units: log.units,
        rate: log.rate,
        amount: log.amount,
      })),

      subtotal,

      total: subtotal,

      dueDate: new Date(),
    });

    await ServiceLog.updateMany(
      {
        _id: {
          $in: logs.map(l => l._id),
        },
      },
      {
        status: 'Billed',
        invoice: invoice._id,
      }
    );

    res.status(201).json(invoice);
  } catch (err) {
    next(err);
  }
});

export default router;