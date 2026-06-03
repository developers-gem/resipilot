import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Appointment } from '../models/index.js';

const router = Router();

router.use(requireAuth);

// GET ALL

router.get('/', async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate('resident')
      .populate('staff')
      .sort('-scheduledAt');

    res.json(appointments);
  } catch (e) {
    next(e);
  }
});

// GET ONE

router.get('/:id', async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('resident')
      .populate('staff');

    if (!appointment) {
      return res.status(404).json({
        error: 'Appointment not found'
      });
    }

    res.json(appointment);
  } catch (e) {
    next(e);
  }
});

// CREATE

router.post('/', async (req, res, next) => {
  try {
    const appointment = await Appointment.create({
      resident: req.body.resident,
      staff: req.body.staff,
      title: req.body.title,
      apptType: req.body.apptType,
      providerName: req.body.providerName,
      location: req.body.location,
      scheduledAt: req.body.scheduledAt,
      durationMin: req.body.durationMin,
      status: req.body.status || 'scheduled',
      notes: req.body.notes
    });

    const populated = await Appointment.findById(
      appointment._id
    )
      .populate('resident')
      .populate('staff');

    res.status(201).json(populated);
  } catch (e) {
    next(e);
  }
});

// UPDATE

router.patch('/:id', async (req, res, next) => {
  try {
    const appointment =
      await Appointment.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      )
        .populate('resident')
        .populate('staff');

    if (!appointment) {
      return res.status(404).json({
        error: 'Appointment not found'
      });
    }

    res.json(appointment);
  } catch (e) {
    next(e);
  }
});

// DELETE

router.delete('/:id', async (req, res, next) => {
  try {
    const appointment =
      await Appointment.findByIdAndDelete(
        req.params.id
      );

    if (!appointment) {
      return res.status(404).json({
        error: 'Appointment not found'
      });
    }

    res.json({
      ok: true
    });
  } catch (e) {
    next(e);
  }
});

export default router;