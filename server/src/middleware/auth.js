import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('-passwordHash');
    if (!user || !user.isActive) return res.status(401).json({ error: 'Invalid user' });
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const has = (req.user.roles || []).some(r => allowed.includes(r));
    if (!has) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}
