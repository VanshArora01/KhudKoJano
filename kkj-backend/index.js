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
const { generatePDF } = require('./services/pdfService');
const { sendUserConfirmationEmail, sendAdminReportEmail } = require('./services/emailService');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 5000;

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Middleware
app.use(helmet({
    contentSecurityPolicy: false,
}));

app.use(cors()); // Allow all for testing - fix later with specific origins
app.use(express.json());

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('Khud Ko Jaano Backend API is running...');
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DEBUG ROUTES (TEMPORARY — Remove after deploy)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.get('/api/debug/env', (req, res) => {
  if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'unauthorized' })
  }
  const vars = [
    'MONGO_URI', 'GROQ_API_KEY',
    'EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 
    'EMAIL_PASS', 'EMAIL_FROM', 'ADMIN_EMAIL',
    'ADMIN_SECRET', 'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'
  ]
  const result = {}
  vars.forEach(v => {
    result[v] = process.env[v] ? '✅ SET' : '❌ MISSING'
  })
  res.json(result)
})

app.get('/api/debug/test-email', async (req, res) => {
  if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'unauthorized' })
  }
  
  try {
    const { transporter } = require('./services/emailService');
    await transporter.verify()
    console.log('SMTP verify passed')
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: 'KKJ Email Test ' + new Date().toISOString(),
      text: 'If you see this, email is working on Render.'
    })
    
    res.json({ 
      success: true, 
      messageId: info.messageId,
      response: info.response,
      to: process.env.ADMIN_EMAIL
    })
  } catch (err) {
    res.json({ 
      success: false, 
      error: err.message,
      code: err.code,
      response: err.response
    })
  }
})

// STANDALONE TEST ROUTE - Google Drive Upload
app.get('/test-drive-upload', async (req, res) => {
    const testFilePath = path.join(__dirname, 'test-report.pdf');
    let browser;
    try {
        console.log('[Test] Starting Google Drive upload test...');

        // 1. Generate Sample PDF
        console.log('[Test] Generating sample PDF...');
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        const htmlContent = `
            <div style="font-family: sans-serif; padding: 40px; text-align: center;">
                <h1 style="color: #c9a84c;">Test Astrology Report</h1>
                <p><strong>Name:</strong> Test User</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <div style="margin-top: 20px; padding: 20px; border: 1px solid #ddd;">
                    <p>This is a test PDF to verify Google Drive upload.</p>
                </div>
            </div>
        `;
        await page.setContent(htmlContent);
        await page.pdf({ path: testFilePath, format: 'A4' });
        await browser.close();
        console.log('[Test] PDF generated at:', testFilePath);

        // 2. Upload to Google Drive
        console.log('[Test] Uploading to Google Drive...');
        const driveLink = await uploadToDrive(testFilePath, 'test-report.pdf');

        if (driveLink) {
            console.log('✅ Drive Upload Successful');
            console.log(`✅ File Link: ${driveLink}`);
            
            // 3. Optional Cleanup
            if (fs.existsSync(testFilePath)) {
                fs.unlinkSync(testFilePath);
                console.log('[Test] Local test file deleted.');
            }

            return res.json({
                success: true,
                message: "Drive Upload Successful",
                link: driveLink
            });
        } else {
            throw new Error("driveService returned null link");
        }

    } catch (error) {
        console.error('❌ Drive Upload Test Failed:', error.message);
        if (browser) await browser.close();
        
        // Cleanup on failure
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }

        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
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
        const tempDir = path.join(process.cwd(), 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
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
