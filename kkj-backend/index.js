const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECURITY & SYSTEM DESIGN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 1. Helmet for Security Headers
app.use(helmet({
    contentSecurityPolicy: false, // Set to true if not using inline scripts/styles
}));

// 2. Rate Limiting (Protection against DDoS/Brute force)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { success: false, message: "Too many requests from this IP, please try again after 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter); // Apply to all API routes

// 3. CORS Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-secret']
}));

// 4. Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(express.json());

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ROUTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('Khud Ko Jaano Backend API — System Online ☸️');
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DEBUG ROUTES (SAFE FOR DEPLOYMENT)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.get('/api/debug/status', async (req, res) => {
    if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ error: 'unauthorized' });
    }
    res.json({
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STARTUP SEQUENCE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function startServer() {
    console.log('\x1b[36m%s\x1b[0m', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\x1b[36m%s\x1b[0m', '  KhudKoJano Backend — Starting');
    console.log('\x1b[36m%s\x1b[0m', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`ENV: ${process.env.NODE_ENV || 'production'}`);

    try {
        // 1. ENV Check
        const requiredVars = ['MONGO_URI', 'GROQ_API_KEY', 'EMAIL_USER', 'EMAIL_PASS', 'ADMIN_EMAIL', 'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'];
        const missing = requiredVars.filter(v => !process.env[v]);
        if (missing.length > 0) throw new Error(`Missing ENV variables: ${missing.join(', ')}`);
        console.log('✅ ENV        — Loaded');

        // 2. MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB    — Connected');

        // 3. Email
        const { verifyEmailConnection } = require('./services/emailService');
        const emailOk = await verifyEmailConnection();
        if (emailOk) console.log('✅ Email      — SMTP Verified');

        // 4. Razorpay Verification
        const Razorpay = require('razorpay');
        const rzpStatus = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        await rzpStatus.orders.all({ count: 1 });
        console.log('✅ Razorpay   — Keys Valid');

        // 5. Build Check
        const tempDir = path.join(process.cwd(), 'temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
        console.log('✅ Storage    — Ready');

        console.log('\x1b[32m%s\x1b[0m', '  ✅ All systems operational');
        console.log('\x1b[32m%s\x1b[0m', `  🚀 Running on port ${PORT}`);
        console.log('\x1b[36m%s\x1b[0m', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        app.listen(PORT);
    } catch (err) {
        console.log('\x1b[31m%s\x1b[0m', `  ❌ System boot failed: ${err.message}`);
        process.exit(1);
    }
}

// Global Process Handlers
process.on('unhandledRejection', (err) => console.error('Unhandled Rejection:', err));
process.on('SIGTERM', async () => {
    await mongoose.connection.close();
    process.exit(0);
});

startServer();
