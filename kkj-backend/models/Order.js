const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, unique: true, required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true },
    age: { type: String },
    currentLocation: { type: String },
    dateOfBirth: { type: String, required: true },
    timeOfBirth: { type: String, required: true },
    placeOfBirth: { type: String, required: true },
    specificQuestion: { type: String, required: true },
    plan: { type: String, enum: ['standard', 'fasttrack'], default: 'standard', required: true },
    report: {
        rawContent: { type: String },
        pdfPath: { type: String },
        generatedAt: { type: Date }
    },
    payment: {
        razorpayOrderId: { type: String },
        razorpayPaymentId: { type: String },
        razorpaySignature: { type: String },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending'
        },
        amount: { type: Number },
        paidAt: { type: Date }
    },
    status: {
        type: String,
        enum: ['awaiting_payment', 'received', 'generating', 'ready', 'sent', 'error'],
        default: 'awaiting_payment',
        index: true
    },
    confirmationEmailSent: { type: Boolean, default: false },
    adminNotes: { type: String },
}, { timestamps: true });

// Compound index for status and createdAt
OrderSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Order', OrderSchema);
