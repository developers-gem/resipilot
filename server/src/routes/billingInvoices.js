import { Router } from 'express';
import { Invoice, ServiceLog } from '../models/index.js';
import { requireFacilityAdmin } from '../middleware/auth.js';
import PDFDocument from 'pdfkit';
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
| Get Single Invoice
|--------------------------------------------------------------------------
*/

router.get('/:id', async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      facility: req.facilityAdmin.facility,
    })
      .populate('resident')
      .populate('items.serviceLog');

    if (!invoice) {
      return res.status(404).json({
        error: 'Invoice not found',
      });
    }

    res.json(invoice);
  } catch (err) {
    next(err);
  }
});




/*
|--------------------------------------------------------------------------
| Download Invoice PDF
|--------------------------------------------------------------------------
*/

router.get('/:id/pdf', async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      facility: req.facilityAdmin.facility,
    })
      .populate('resident')
      .populate('items.serviceLog');

    if (!invoice) {
      return res.status(404).json({
        error: 'Invoice not found',
      });
    }

    res.setHeader(
      'Content-Type',
      'application/pdf'
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${invoice.invoiceNumber}.pdf`
    );

    const doc = new PDFDocument({
      margin: 50,
    });

    doc.pipe(res);

    // Title
    doc
      .fontSize(22)
      .text('Habitat Pilot', {
        align: 'center',
      });

    doc.moveDown();

    doc
      .fontSize(18)
      .text(
        `Invoice # ${invoice.invoiceNumber}`
      );

    doc.moveDown();

    doc
      .fontSize(12)
      .text(
        `Resident : ${invoice.resident?.firstName || ''} ${invoice.resident?.lastName || ''}`
      );

    doc.text(
      `Status : ${invoice.status}`
    );

    doc.text(
      `Due Date : ${new Date(
        invoice.dueDate
      ).toLocaleDateString()}`
    );

    doc.moveDown();

    doc
      .fontSize(14)
      .text('Services');

    doc.moveDown(0.5);

    invoice.items.forEach(item => {
      doc.text(
        `${item.serviceName}     ${item.units} × $${item.rate} = $${item.amount}`
      );
    });

    doc.moveDown();

    doc
      .fontSize(16)
      .text(
        `Total : $${invoice.total}`,
        {
          align: 'right',
        }
      );

    doc.end();
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
    const { serviceLogId } = req.body;

    const log = await ServiceLog.findOne({
      _id: serviceLogId,
      facility: req.facilityAdmin.facility,
    })
      .populate('resident')
      .populate('service');

    if (!log) {
      return res.status(404).json({
        error: 'Service log not found.',
      });
    }

    if (log.status === 'Billed') {
      return res.status(400).json({
        error: 'Invoice already generated.',
      });
    }

    const invoice = await Invoice.create({
      facility: req.facilityAdmin.facility,

      resident: log.resident._id,

      invoiceNumber: 'INV-' + Date.now(),

      items: [
        {
          serviceLog: log._id,

          serviceName:
            log.service?.name || log.serviceName,

          units: log.units,

          rate: log.rate,

          amount: log.amount,
        },
      ],

      subtotal: log.amount,

      total: log.amount,

      balance: log.amount,

      status: 'Draft',

      dueDate: new Date(
        Date.now() + 15 * 24 * 60 * 60 * 1000
      ),
    });

    log.status = 'Billed';

    log.invoice = invoice._id;

    await log.save();

    res.status(201).json(invoice);
  } catch (err) {
    next(err);
  }
});
export default router;