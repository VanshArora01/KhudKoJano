const express = require('express');
const router = express.Router();
const { customAlphabet } = require('nanoid');
const Order = require('../models/Order');
const { generateAstrologyReport } = require('../services/groqService');
const { generatePDF } = require('../services/pdfService');
const { sendUserConfirmationEmail, sendAdminReportEmail } = require('../services/emailService');
const { createRazorpayOrder, verifyPaymentSignature } = require('../services/razorpayService');

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

// POST /api/orders/create
router.post('/create', async (req, res) => {
    try {
        const { name, email, phone, dateOfBirth, timeOfBirth, placeOfBirth, specificQuestion, plan } = req.body;

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

        const razorpayOrder = await createRazorpayOrder(orderId, plan);

        const newOrder = new Order({
            orderId,
            name,
            email,
            phone,
            dateOfBirth,
            timeOfBirth,
            placeOfBirth,
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
        if (!order) return;

        // 1. Send confirmation email to user immediately
        console.log(`[${orderId}] Sending confirmation to ${order.email}...`);
        await sendUserConfirmationEmail(order, orderId);

        // 2. Set status to generating
        order.status = 'generating';
        await order.save();

        // 3. Call Groq AI for report JSON
        console.log(`[${orderId}] 🤖 Calling Groq AI...`);
        const reportData = await generateAstrologyReport(order);
        order.report.rawContent = JSON.stringify(reportData);
        await order.save();

        // 4. Generate PDF
        console.log(`[${orderId}] ✅ Generating PDF...`);
        const pdfPath = await generatePDF({
            ...reportData,
            name: order.name,
            plan: order.plan,
            specificQuestion: order.specificQuestion
        }, orderId);

        order.report.pdfPath = pdfPath;
        console.log(`[${orderId}] ✅ PDF generated at ${pdfPath}`);

        // 5. Update order to ready
        order.status = 'ready';
        order.report.generatedAt = new Date();
        await order.save();

        // 6. Send PDF to Admin
        console.log(`[${orderId}] Sending PDF to Admin (${process.env.ADMIN_EMAIL})...`);
        await sendAdminReportEmail(order, pdfPath);

        console.log(`[${orderId}] ✅ Pipeline complete.`);

    } catch (pipelineError) {
        console.error(`[${orderId}] Pipeline Error:`, pipelineError);
        if (order) {
            order.status = 'error';
            order.adminNotes = (order.adminNotes || '') + `\nPipeline Error: ${pipelineError.message}`;
            await order.save();
        }
    }
}

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
