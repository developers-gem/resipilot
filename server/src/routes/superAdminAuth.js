import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import SuperAdmin from '../models/SuperAdmin.js';
import { requireSuperAdmin } from '../middleware/auth.js';

const router = Router();

function sign(admin) {
    return jwt.sign(
        {
            sub: admin._id.toString(),
            email: admin.email,
            role: 'super-admin',
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        }
    );
}

/**
 * Super Admin Login
 */
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        console.log('EMAIL:', email);

        const admin = await SuperAdmin.findOne({
            email: (email || '').toLowerCase(),
        });

        console.log('ADMIN:', admin);

        if (!admin || !admin.active) {
            return res.status(401).json({
                error: 'Invalid credentials',
            });
        }

        const ok = await bcrypt.compare(
            password,
            admin.passwordHash
        );
console.log('PASSWORD MATCH:', ok);
        if (!ok) {
            return res.status(401).json({
                error: 'Invalid credentials',
            });
        }

        admin.lastLogin = new Date();
        await admin.save();

        res.json({
            token: sign(admin),
            admin,
        });
    } catch (err) {
        next(err);
    }
});

/**
 * Logged in Super Admin
 */
router.get(
    '/me',
    requireSuperAdmin,
    async (req, res) => {
        res.json({
            admin: req.superAdmin,
        });
    }
);

export default router;