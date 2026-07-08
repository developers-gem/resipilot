import { Router } from 'express';
import { Payer } from '../models/index.js';
import { requireFacilityAdmin } from '../middleware/auth.js';

const router = Router();

router.use(requireFacilityAdmin);

/**
 * Get all payers for current facility
 */
router.get('/', async (req, res, next) => {
  try {
    const payers = await Payer.find({
      facility: req.facilityAdmin.facility,
    }).sort('name');

    res.json(payers);
  } catch (err) {
    next(err);
  }
});

/**
 * Create payer
 */
router.post('/', async (req, res, next) => {
  try {
    const payer = await Payer.create({
      ...req.body,
      facility: req.facilityAdmin.facility,
    });

    res.status(201).json(payer);
  } catch (err) {
    next(err);
  }
});

/**
 * Update payer
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const payer = await Payer.findOneAndUpdate(
      {
        _id: req.params.id,
        facility: req.facilityAdmin.facility,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!payer) {
      return res.status(404).json({
        error: 'Payer not found',
      });
    }

    res.json(payer);
  } catch (err) {
    next(err);
  }
});

/**
 * Delete payer
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const payer = await Payer.findOneAndDelete({
      _id: req.params.id,
      facility: req.facilityAdmin.facility,
    });

    if (!payer) {
      return res.status(404).json({
        error: 'Payer not found',
      });
    }

    res.json({
      ok: true,
    });
  } catch (err) {
    next(err);
  }
});

export default router;