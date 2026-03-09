const crypto = require('crypto');
require('dotenv').config();

const adminAuth = (req, res, next) => {
    const secret = req.headers['x-admin-secret'];

    if (!secret) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    try {
        const a = Buffer.from(secret);
        const b = Buffer.from(process.env.ADMIN_SECRET);

        if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    next();
};

module.exports = adminAuth;
