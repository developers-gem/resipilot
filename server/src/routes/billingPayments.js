import { Router } from 'express';

import {
  Payment,
  Invoice,
} from '../models/index.js';

import { requireFacilityAdmin } from '../middleware/auth.js';

const router = Router();

router.use(requireFacilityAdmin);

/*
|--------------------------------------------------------------------------
| List Payments
|--------------------------------------------------------------------------
*/
router.get('/', async (req, res, next) => {
  try {
    const payments = await Payment.find({
      facility: req.facilityAdmin.facility,
    })
      .populate('resident', 'firstName lastName')
      .populate(
        'invoice',
        'invoiceNumber total balance status'
      )
      .sort('-paymentDate');

    res.json(payments);
  } catch (err) {
    next(err);
  }
});

/*
|--------------------------------------------------------------------------
| Record Payment
|--------------------------------------------------------------------------
*/
router.post('/', async (req, res, next) => {
  try {
    const {
      invoice,
      amount,
      method,
      reference,
      notes,
      paymentDate,
    } = req.body;

    const inv = await Invoice.findOne({
      _id: invoice,
      facility: req.facilityAdmin.facility,
    });

    if (!inv) {
      return res.status(404).json({
        error: 'Invoice not found',
      });
    }

    const payment = await Payment.create({
      facility: req.facilityAdmin.facility,

      invoice: inv._id,

      resident: inv.resident,

      amount: Number(amount),

      method,

      reference,

      notes,

      paymentDate,
    });

    // Calculate total paid
    const payments = await Payment.find({
      invoice: inv._id,
    });

    const totalPaid = payments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    inv.balance = Math.max(
      0,
      inv.total - totalPaid
    );

    if (inv.balance === 0) {
      inv.status = 'Paid';
      inv.paidDate = new Date();
    } else {
      inv.status = 'Partial';
    }

    await inv.save();

    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
});

/*
|--------------------------------------------------------------------------
| Delete Payment
|--------------------------------------------------------------------------
*/
router.delete('/:id', async (req, res, next) => {
  try {
    const payment = await Payment.findById(
      req.params.id
    );

    if (!payment) {
      return res.status(404).json({
        error: 'Payment not found',
      });
    }

    const invoice = await Invoice.findById(
      payment.invoice
    );

    await payment.deleteOne();

    if (invoice) {
      const payments = await Payment.find({
        invoice: invoice._id,
      });

      const totalPaid = payments.reduce(
        (sum, p) => sum + p.amount,
        0
      );

      invoice.balance = Math.max(
        0,
        invoice.total - totalPaid
      );

      if (invoice.balance === 0) {
        invoice.status = 'Draft';
        invoice.paidDate = null;
      } else {
        invoice.status = 'Partial';
      }

      await invoice.save();
    }

    res.json({
      ok: true,
    });
  } catch (err) {
    next(err);
  }
});

export default router;