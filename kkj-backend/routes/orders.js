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
const { uploadPDF } = require('../services/cloudinaryService');

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRODUCTION CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const BYPASS_PAYMENT = true; // ⚠️ ENABLED FOR TESTING (BYPASSES RAZORPAY)

// POST /api/orders/create
router.post('/create', async (req, res) => {
    try {
        const { name, email, phone, dateOfBirth, timeOfBirth, placeOfBirth, currentLocation, specificQuestion, plan } = req.body;

        // 1. Validation
        const errors = [];
        if (!name) errors.push('name');
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push('email');
        if (!phone) errors.push('phone');
        if (!dateOfBirth) errors.push('dateOfBirth');
        if (!timeOfBirth) errors.push('timeOfBirth');
        if (!placeOfBirth) errors.push('placeOfBirth');
        if (!specificQuestion) errors.push('specificQuestion');

        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: `Invalid fields: ${errors.join(', ')}` });
        }

        const orderId = `KKJ-${nanoid()}`;
        const amount = plan === 'fasttrack' ? 19900 : 9900; // in paisa

        // ⚠️ BYPASS FOR TESTING
        if (BYPASS_PAYMENT) {
            console.log(`[${orderId}] 🧪 PAYMENT BYPASS ENABLED — Processing immediately`);
            const newOrder = new Order({
                orderId, name, email, phone, dateOfBirth, timeOfBirth, placeOfBirth, currentLocation, specificQuestion,
                plan: plan || 'standard', status: 'received',
                payment: { status: 'paid', amount, razorpayOrderId: 'BYPASS_TEST', paidAt: new Date() }
            });
            await newOrder.save();
            res.status(201).json({ success: true, orderId, bypass: true });
            
            // Trigger pipeline asynchronously
            runPipeline(orderId);
            return;
        }

        // 2. Real Razorpay Order Creation
        const rzp = await createRazorpayOrder(orderId, plan);
        const order = new Order({
            orderId, name, email, phone, dateOfBirth, timeOfBirth, placeOfBirth, currentLocation, specificQuestion,
            plan: plan || 'standard', status: 'awaiting_payment',
            payment: { razorpayOrderId: rzp.id, status: 'pending', amount }
        });
        await order.save();

        res.status(201).json({ 
            success: true, orderId, razorpayOrderId: rzp.id, amount, currency: 'INR', keyId: process.env.RAZORPAY_KEY_ID 
        });

    } catch (error) {
        console.error('Create Order Error:', error);
        if (!res.headersSent) res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

/**
 * Main Order Pipeline (Only triggers after payment)
 */
async function runPipeline(orderId) {
    let order;
    let pdfPath;
    let emailSuccess = false;
    let cloudinarySuccess = false;

    try {
        order = await Order.findOne({ orderId });
        if (!order) return console.error(`[${orderId}] Order not found`);
        if (order.status === 'ready' || order.status === 'error') return;

        console.log(`[${orderId}] ⚙️ Starting pipeline for payment-verified order`);

        // 1. User Confirmation
        try {
            await sendUserConfirmationEmail(order);
            order.confirmationEmailSent = true;
            await order.save();
        } catch (e) { console.error(`[${orderId}] Confirmation email error:`, e.message); }

        // 2. AI Content Generation
        let reportData;
        try {
            order.status = 'generating';
            await order.save();
            reportData = await generateAstrologyReport(order);
            order.report.rawContent = JSON.stringify(reportData);
            await order.save();
        } catch (e) {
            console.error(`[${orderId}] AI failure:`, e.message);
            order.status = 'error';
            await order.save();
            return;
        }

        // 3. PDF Generation
        try {
            pdfPath = await generatePDF({
                ...reportData, 
                name: order.name, plan: order.plan, specificQuestion: order.specificQuestion
            }, orderId);
            
            if (!pdfPath || !fs.existsSync(pdfPath)) throw new Error("File generation trace lost");
            
            order.report.pdfPath = pdfPath;
            order.report.generatedAt = new Date();
            await order.save();
        } catch (e) {
            console.error(`[${orderId}] PDF creation failure:`, e.message);
            order.status = 'error';
            await order.save();
            return;
        }

        // 4. Cloudinary Storage (Backup)
        try {
            const url = await uploadPDF(pdfPath, `backups/${orderId}`);
            if (url) {
                order.report.cloudinaryUrl = url;
                cloudinarySuccess = true;
                await order.save();
            }
        } catch (e) { console.error(`[${orderId}] Cloudinary failure:`, e.message); }

        // 5. Admin Notification (Main Channel - Attachment)
        try {
            await sendAdminReportEmail(order);
            emailSuccess = true;
            console.log(`[${orderId}] ✅ Admin notified with attachment`);
        } catch (e) { console.error(`[${orderId}] Admin email failure:`, e.message); }

        order.status = 'ready';
        await order.save();
        console.log(`[${orderId}] 🎉 Full processing complete`);

    } catch (err) {
        console.error(`[${orderId}] ❌ Critical Pipeline Failure:`, err.message);
    } finally {
        // Safe Cleanup: Only if both the admin have it and the cloud has it
        if (emailSuccess && cloudinarySuccess && pdfPath && fs.existsSync(pdfPath)) {
            try {
                fs.unlinkSync(pdfPath);
                console.log(`[${orderId}] 🗑️ Temporary local file cleaned up`);
            } catch (e) {}
        }
    }
}

/**
 * Secure Payment Verification Channel
 */
router.post('/verify-payment', async (req, res) => {
    try {
        const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
        const order = await Order.findOne({ orderId });
        
        if (!order) return res.status(404).json({ success: false, message: 'Order missing' });

        // IMPORTANT security: only verify pending orders
        if (order.payment.status === 'paid') {
            return res.status(400).json({ success: false, message: 'Payment already processed' });
        }

        const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
        if (!isValid) {
            order.payment.status = 'failed';
            await order.save();
            return res.status(401).json({ success: false, message: 'Payment verification failed' });
        }

        // SET PAID STATUS before triggering pipeline
        order.payment = { 
            ...order.payment, 
            razorpayPaymentId, 
            razorpaySignature, 
            status: 'paid', 
            paidAt: new Date() 
        };
        order.status = 'received';
        await order.save();

        res.status(200).json({ success: true, message: "Payment verified successfully" });
        
        // ASYNC PIPELINE TRIGGER
        runPipeline(orderId);

    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

/**
 * Admin Panel & Support Status Check
 */
router.get('/status/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId }).select('orderId status name plan createdAt');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * Compatibility route for frontend bypass testing
 */
router.post('/submit-form', async (req, res) => {
    try {
        const { orderId } = req.body;
        console.log(`[${orderId}] 📥 Direct submission received (Bypass Flow)`);
        // The pipeline is likely already running from /create, but we can re-trigger
        // runPipeline handles cases where status is already 'received' or further.
        runPipeline(orderId);
        res.json({ success: true, message: "Bypass submission accepted" });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

module.exports = router;
