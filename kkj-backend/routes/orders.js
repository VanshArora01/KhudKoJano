const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { customAlphabet } = require('nanoid');
const Order = require('../models/Order');
const { generateAstrologyReport } = require('../services/groqService');
const { generatePDF } = require('../services/pdfService');
const { sendUserConfirmationEmail, sendAdminReportEmail } = require('../services/emailService');
const { createRazorpayOrder, verifyPaymentSignature } = require('../services/razorpayService');

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

const BYPASS_PAYMENT = true; // Set to true for rapid deployment testing

// POST /api/orders/create
router.post('/create', async (req, res) => {
    try {
        const { name, email, phone, dateOfBirth, timeOfBirth, placeOfBirth, currentLocation, specificQuestion, plan } = req.body;

        // Validation
        const errors = [];
        if (!name) errors.push('name');
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push('email');
        if (!phone) errors.push('phone');
        if (!dateOfBirth) errors.push('dateOfBirth');
        if (!timeOfBirth) errors.push('timeOfBirth');
        if (!placeOfBirth) errors.push('placeOfBirth');
        if (!specificQuestion) errors.push('specificQuestion');
        if (plan && !['standard', 'fasttrack'].includes(plan)) errors.push('plan');

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing or invalid fields: ${errors.join(', ')}`
            });
        }

        const orderId = `KKJ-${nanoid()}`;
        const amount = plan === 'fasttrack' ? 19900 : 9900;

        if (BYPASS_PAYMENT) {
            console.log("⚠️ Payment bypassed for testing");
            
            const newOrder = new Order({
                orderId,
                name,
                email,
                phone,
                dateOfBirth,
                timeOfBirth,
                placeOfBirth,
                currentLocation,
                specificQuestion,
                plan: plan || 'standard',
                status: 'received',
                payment: {
                    status: 'paid',
                    amount: amount,
                    razorpayOrderId: 'BYPASS_TEST'
                }
            });

            await newOrder.save();
            console.log(`[${orderId}] ✅ Order created with BYPASS mode — starting pipeline`);

            // Trigger pipeline immediately
            runPipeline(orderId);

            return res.status(201).json({
                success: true,
                orderId,
                message: "Payment bypassed, processing started",
                bypass: true
            });
        }

        const razorpayOrder = await createRazorpayOrder(orderId, plan);

        const newOrder = new Order({
            orderId,
            name,
            email,
            phone,
            dateOfBirth,
            timeOfBirth,
            placeOfBirth,
            currentLocation,
            specificQuestion,
            plan: plan || 'standard',
            status: 'awaiting_payment',
            payment: {
                razorpayOrderId: razorpayOrder.id,
                status: 'pending',
                amount: amount
            }
        });

        await newOrder.save();
        console.log(`[${orderId}] 📥 Order created — awaiting payment (₹${amount / 100} ${plan || 'standard'})`);

        res.status(201).json({
            success: true,
            orderId,
            razorpayOrderId: razorpayOrder.id,
            amount,
            currency: 'INR',
            keyId: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error('Create Route Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
});

async function runPipeline(orderId) {
    let order;
    try {
        order = await Order.findOne({ orderId });
        if (!order) {
            console.error(`[${orderId}] ❌ Order not found in database`);
            return;
        }

        console.log(`[${order.orderId}] 🚀 Pipeline started`);

        // Step 1 — Confirmation email (send first, before AI)
        try {
            if (order.confirmationEmailSent) {
                console.log(`[${order.orderId}] 📧 Confirmation email already sent, skipping...`);
            } else {
                console.log(`[${order.orderId}] 📧 Sending confirmation to: ${order.email}`);
                await sendUserConfirmationEmail(order, order.orderId);
                order.confirmationEmailSent = true;
                await order.save();
                console.log(`[${order.orderId}] ✅ Confirmation email sent`);
            }
        } catch (err) {
            console.error(`[${order.orderId}] ❌ Confirmation email FAILED:`, err.message);
            console.error(err.stack);
            // do NOT return — continue to next step
        }

        // Step 2 — Groq AI
        let reportData;
        try {
            order.status = 'generating';
            await order.save();
            console.log(`[${order.orderId}] 🤖 Calling Groq...`);
            reportData = await generateAstrologyReport(order);
            order.report.rawContent = JSON.stringify(reportData);
            await order.save();
            console.log(`[${order.orderId}] ✅ Groq report generated`);
        } catch (err) {
            console.error(`[${order.orderId}] ❌ Groq FAILED:`, err.message);
            console.error(err.stack);
            order.status = 'error';
            order.adminNotes = (order.adminNotes || '') + ' Groq failed: ' + err.message;
            await order.save();
            return; // can't generate PDF without report
        }

        // Step 3 — PDF
        let pdfPath;
        try {
            console.log(`[${order.orderId}] 📄 Generating PDF...`);
            // 3️⃣ WAIT FOR PDF GENERATION (VERY IMPORTANT)
            pdfPath = await generatePDF({
                ...reportData,
                name: order.name,
                plan: order.plan,
                specificQuestion: order.specificQuestion
            }, order.orderId);
            
            // 7️⃣ OPTIONAL: DELAY (IF RACE CONDITION)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 4️⃣ VERIFY FILE EXISTS BEFORE EMAIL
            if (!fs.existsSync(pdfPath)) {
                console.error(`❌ [${order.orderId}] PDF NOT FOUND after generation:`, pdfPath);
                throw new Error("PDF file not found on disk after generation trace.");
            }

            order.report.pdfPath = pdfPath;
            order.report.generatedAt = new Date();
            order.status = 'ready';
            await order.save();
            console.log(`[${order.orderId}] ✅ PDF verified at: ${pdfPath}`);
        } catch (err) {
            console.error(`[${order.orderId}] ❌ PDF FAILED:`, err.message);
            order.status = 'error';
            order.adminNotes = (order.adminNotes || '') + ' PDF failed: ' + err.message;
            await order.save();
            return;
        }

        // Step 4 — Admin email
        try {
            console.log(`[${order.orderId}] 📧 Sending admin alert to: ${process.env.ADMIN_EMAIL}`);
            // Ensure we use the latest order data
            await sendAdminReportEmail(order);
            console.log(`[${order.orderId}] ✅ Admin email sent`);
            console.log(`[${order.orderId}] 🎉 Pipeline complete`);
        } catch (err) {
            console.error(`[${order.orderId}] ❌ Admin email FAILED:`, err.message);
            console.error(err.stack);
        }
    } catch (pipelineError) {
        console.error(`[${orderId}] ❌ CRITICAL Pipeline Error:`, pipelineError.message);
        if (order) {
            order.status = 'error';
            order.adminNotes = (order.adminNotes || '') + `\nCritical Error: ${pipelineError.message}`;
            await order.save();
        }
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🧪 DIRECT TEST ROUTE (For Rapid Deployment Testing)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.post('/submit-form', async (req, res) => {
    try {
        console.log("-----------------------------------------");
        console.log("📥 DIRECT SUBMISSION START:", req.body.email);
        
        let order;
        if (req.body.orderId) {
            order = await Order.findOne({ orderId: req.body.orderId });
        }

        if (!order) {
           const { name, email, phone, dateOfBirth, timeOfBirth, placeOfBirth, currentLocation, specificQuestion, plan } = req.body;
           const orderId = req.body.orderId || `KKJ-TEST-${Math.random().toString(36).substring(7).toUpperCase()}`;
           
           order = new Order({
               orderId,
               name, email, phone, dateOfBirth, timeOfBirth, placeOfBirth, currentLocation, specificQuestion,
               plan: plan || 'standard',
               status: 'received',
               payment: { status: 'paid', amount: 0, razorpayOrderId: 'BYPASS_ADMIN' }
           });
           await order.save();
        }

        console.log(`[${order.orderId}] Direct submission accepted — triggering pipeline`);
        
        // Response immediately
        res.status(200).json({ success: true, orderId: order.orderId, message: "Pipeline started" });

        // Trigger in background
        runPipeline(order.orderId);

    } catch (error) {
        console.error('Submit Route Error:', error.message);
        if (!res.headersSent) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
});

// POST /api/orders/verify-payment
router.post('/verify-payment', async (req, res) => {
    try {
        const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        const order = await Order.findOne({ orderId });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.payment.status === 'paid') {
            return res.status(400).json({ success: false, message: 'Payment already verified for this order' });
        }

        const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

        if (!isValid) {
            order.payment.status = 'failed';
            await order.save();
            console.error(`[${orderId}] ❌ Payment signature invalid — possible tamper attempt`);
            return res.status(400).json({ success: false, message: 'Payment verification failed' });
        }

        // Signature is valid
        order.payment.razorpayPaymentId = razorpayPaymentId;
        order.payment.razorpaySignature = razorpaySignature;
        order.payment.status = 'paid';
        order.payment.paidAt = new Date();
        order.status = 'received';
        await order.save();

        console.log(`[${orderId}] ✅ Payment verified — starting pipeline`);

        // Respond immediately to Frontend
        res.status(200).json({ success: true, orderId });

        // ASYNC PIPELINE (Non-blocking)
        runPipeline(orderId);

    } catch (error) {
        console.error('Verify Payment Route Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
});

// GET /api/orders/status/:orderId
router.get('/status/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId }).select('orderId status name plan createdAt');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
