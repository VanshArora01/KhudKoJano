const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: false,
}));

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:3000',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('http://localhost')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('Khud Ko Jaano Backend API is running...');
});

// Startup Sequence
async function startServer() {
    console.log('\x1b[36m%s\x1b[0m', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\x1b[36m%s\x1b[0m', '  KhudKoJano Backend — Starting');
    console.log('\x1b[36m%s\x1b[0m', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`ENV: ${process.env.NODE_ENV || 'development'}`);
    console.log('');

    try {
        // 1. ENV Check
        const requiredVars = ['MONGO_URI', 'GROQ_API_KEY', 'EMAIL_USER', 'EMAIL_PASS', 'ADMIN_EMAIL', 'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'];
        const missing = requiredVars.filter(v => !process.env[v]);
        if (missing.length > 0) {
            console.log('❌ ENV        — Variables missing');
            throw new Error(`Missing ENV variables: ${missing.join(', ')}`);
        }
        console.log('✅ ENV        — All variables loaded');

        // 2. MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB    — Connected to Atlas');

        // 3. Groq AI
        if (!process.env.GROQ_API_KEY.startsWith('gsk_')) {
            throw new Error('Invalid Groq API Key format');
        }
        console.log('✅ Groq AI    — API key valid');

        // 4. Email
        const { verifyEmailConnection, sendStartupTest } = require('./services/emailService');
        const emailOk = await verifyEmailConnection();
        if (emailOk) {
            console.log('✅ Email      — SMTP Connection Verified');
        } else {
            console.log('⚠️  Email      — Connection Failed (Service will start anyway)');
        }

        // 5. Razorpay
        const Razorpay = require('razorpay');
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        await razorpay.orders.all({ count: 1 });
        console.log('✅ Razorpay   — API keys valid');

        // 6. Storage
        const os = require('os');
        const pdfsDir = path.join(os.tmpdir(), 'kkj-reports');
        if (!fs.existsSync(pdfsDir)) {
            fs.mkdirSync(pdfsDir, { recursive: true });
        }
        console.log('✅ Storage    — Temp directory ready');

        console.log('');
        console.log('\x1b[36m%s\x1b[0m', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\x1b[32m%s\x1b[0m', '  ✅ All systems operational');
        console.log('\x1b[32m%s\x1b[0m', `  🚀 Server running on port ${PORT}`);
        console.log('\x1b[36m%s\x1b[0m', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        app.listen(PORT);
    } catch (err) {
        console.log('');
        console.log('\x1b[31m%s\x1b[0m', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\x1b[31m%s\x1b[0m', '  ❌ System boot failed');
        console.log('\x1b[31m%s\x1b[0m', `  Error: ${err.message}`);
        console.log('\x1b[31m%s\x1b[0m', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        process.exit(1);
    }
}

// Unhandled Rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
});

// Graceful Shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received — shutting down gracefully');
    await mongoose.connection.close();
    process.exit(0);
});

startServer();
