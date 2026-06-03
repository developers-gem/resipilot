import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { BehavioralIncident } from '../models/index.js';

const router = Router();

router.use(requireAuth);

// GET ALL

router.get('/', async (req, res, next) => {
  try {
    const incidents = await BehavioralIncident.find()
      .populate('resident')
      .populate('reportedBy')
      .sort('-occurredAt');

    res.json(incidents);
  } catch (e) {
    next(e);
  }
});

// GET ONE

router.get('/:id', async (req, res, next) => {
  try {
    const incident = await BehavioralIncident.findById(
      req.params.id
    )
      .populate('resident')
      .populate('reportedBy');

    if (!incident) {
      return res.status(404).json({
        error: 'Incident not found'
      });
    }

    res.json(incident);
  } catch (e) {
    next(e);
  }
});

// CREATE

router.post('/', async (req, res, next) => {
  try {
    const incident =
      await BehavioralIncident.create({
        resident: req.body.resident,
        reportedBy: req.body.reportedBy,
        occurredAt: req.body.occurredAt,
        location: req.body.location,
        behaviorTypes: req.body.behaviorTypes,
        severity: req.body.severity,
        antecedent: req.body.antecedent,
        behavior: req.body.behavior,
        consequence: req.body.consequence,
        interventions: req.body.interventions,
        durationMin: req.body.durationMin,
        injury: req.body.injury,
        notified: req.body.notified
      });

    const populated =
      await BehavioralIncident.findById(
        incident._id
      )
        .populate('resident')
        .populate('reportedBy');

    res.status(201).json(populated);
  } catch (e) {
    next(e);
  }
});

// UPDATE

router.patch('/:id', async (req, res, next) => {
  try {
    const incident =
      await BehavioralIncident.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      )
        .populate('resident')
        .populate('reportedBy');

    if (!incident) {
      return res.status(404).json({
        error: 'Incident not found'
      });
    }

    res.json(incident);
  } catch (e) {
    next(e);
  }
});

// DELETE

router.delete('/:id', async (req, res, next) => {
  try {
    const incident =
      await BehavioralIncident.findByIdAndDelete(
        req.params.id
      );

    if (!incident) {
      return res.status(404).json({
        error: 'Incident not found'
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