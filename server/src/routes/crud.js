import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

// Generic REST router for a Mongoose model.
// GET /        -> list (supports ?limit, ?skip, and any field=value filter)
// GET /:id     -> read one
// POST /       -> create
// PATCH /:id   -> update
// DELETE /:id  -> delete
export function crudRouter(Model) {
  const r = Router();
  r.use(requireAuth);

  r.get('/', async (req, res, next) => {
    try {
      const { limit = 100, skip = 0, sort = '-createdAt', ...filter } = req.query;
      const docs = await Model.find(filter).sort(sort).skip(Number(skip)).limit(Math.min(Number(limit), 500));
      res.json(docs);
    } catch (e) { next(e); }
  });

  r.get('/:id', async (req, res, next) => {
    try {
      const doc = await Model.findById(req.params.id);
      if (!doc) return res.status(404).json({ error: 'Not found' });
      res.json(doc);
    } catch (e) { next(e); }
  });

  r.post('/', async (req, res, next) => {
    try {
      const doc = await Model.create(req.body);
      res.status(201).json(doc);
    } catch (e) { next(e); }
  });

  r.patch('/:id', async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!doc) return res.status(404).json({ error: 'Not found' });
      res.json(doc);
    } catch (e) { next(e); }
  });

  r.delete('/:id', async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ error: 'Not found' });
      res.json({ ok: true });
    } catch (e) { next(e); }
  });

  return r;
}
