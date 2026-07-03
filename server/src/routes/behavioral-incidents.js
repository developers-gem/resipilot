import { Router } from 'express';
import { requireAuth, requireGuardian } from '../middleware/auth.js';
import { BehavioralIncident } from '../models/index.js';

const router = Router();


// GET ALL

router.get('/', requireAuth, async (req, res, next) => {
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


// GET INCIDENTS FOR A RESIDENT

router.get('/resident/:residentId', requireGuardian, async (req, res, next) => {
  try {
    console.log('Route resident ID:', req.params.residentId);

    const incidents = await BehavioralIncident.find({
      resident: req.params.residentId,
    })
    
      .populate('resident')
      .populate('reportedBy')
      .sort('-occurredAt');

    res.json(incidents);
  } catch (e) {
    next(e);
  }
});
// GET ONE

router.get('/:id', requireAuth, async (req, res, next) => {
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

router.post('/', requireAuth, async (req, res, next) => {
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

router.patch('/:id', requireAuth, async (req, res, next) => {
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

router.delete('/:id', requireAuth, async (req, res, next) => {
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