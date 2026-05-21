import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function sign(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email, roles: user.roles },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, fullName, roles } = req.body;
    if (!email || !password || !fullName) return res.status(400).json({ error: 'Missing fields' });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ error: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      fullName,
      roles: Array.isArray(roles) && roles.length ? roles : ['staff'],
    });
    res.status(201).json({ token: sign(user), user: user.toJSON() });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user || !user.isActive) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    user.lastLoginAt = new Date();
    await user.save();
    res.json({ token: sign(user), user: user.toJSON() });
  } catch (e) { next(e); }
});

router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

export default router;
