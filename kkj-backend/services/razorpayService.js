const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create a Razorpay order (called before showing checkout)
async function createRazorpayOrder(orderId, plan) {
    try {
        const amount = plan === 'fasttrack' ? 19900 : 9900; // in paise (₹199 or ₹99)

        const razorpayOrder = await razorpay.orders.create({
            amount,
            currency: 'INR',
            receipt: orderId,  // your KKJ-XXXXXX order ID
            notes: {
                orderId,
                plan
            }
        });

        return razorpayOrder;
    } catch (error) {
        console.error('Razorpay Order Creation Error:', error.message);
        throw new Error('Failed to initiate payment. Please try again.');
    }
}

// Verify payment signature after user pays
// This is critical — never skip this step
function verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, signature) {
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

    return expectedSignature === signature;
}

module.exports = { createRazorpayOrder, verifyPaymentSignature };
