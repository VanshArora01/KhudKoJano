const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Order = require('../models/Order');
const adminAuth = require('../middleware/adminAuth');

router.use(adminAuth);

// GET /api/admin/orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find()
            .select('orderId name email plan status createdAt')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Admin Fetch Orders Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/admin/orders/:orderId
router.get('/orders/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId })
            .select('-payment.razorpaySignature -payment.razorpayPaymentId'); // Hide some secrets
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json(order);
    } catch (error) {
        console.error('Admin Fetch Order Detail Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/admin/pdf/:orderId
router.get('/pdf/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        const pdfPath = order.report?.pdfPath;
        if (!pdfPath || !fs.existsSync(pdfPath)) {
            // Fallback: Try generating if path missing but content exists
            if (!order.report?.rawContent) {
                return res.status(404).json({ success: false, message: 'Report PDF not found on disk' });
            }
            return res.status(404).json({ success: false, message: 'PDF file missing. Please regenerate or contact support.' });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${order.orderId}_Report.pdf"`);
        const fileStream = fs.createReadStream(pdfPath);
        fileStream.pipe(res);
    } catch (error) {
        console.error('Admin PDF download error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PUT /api/admin/orders/:orderId/status
router.put('/orders/:orderId/status', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['awaiting_payment', 'received', 'generating', 'ready', 'sent', 'error'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const order = await Order.findOneAndUpdate(
            { orderId: req.params.orderId },
            { status },
            { new: true }
        ).select('orderId status');

        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, order });
    } catch (error) {
        console.error('Admin Update Status Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PUT /api/admin/orders/:orderId/notes
router.put('/orders/:orderId/notes', async (req, res) => {
    try {
        const { notes } = req.body;
        const order = await Order.findOneAndUpdate(
            { orderId: req.params.orderId },
            { adminNotes: notes },
            { new: true }
        ).select('orderId adminNotes');

        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, order });
    } catch (error) {
        console.error('Admin Update Notes Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
