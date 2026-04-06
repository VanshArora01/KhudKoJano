import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CosmicBackground from '../components/CosmicBackground';
import { api } from '../lib/api';

const PaymentPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [planInfo, setPlanInfo] = useState({ plan: 'The Seeker', price: 99 });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const stored = sessionStorage.getItem('selectedPlan');
        if (stored) {
            try {
                setPlanInfo(JSON.parse(stored));
            } catch { }
        }
    }, []);

    const handlePay = async () => {
        if (loading) return; // Prevent double submit

        setLoading(true);
        setError(null);
        try {
            const userDetails = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
            const selectedPlan = JSON.parse(sessionStorage.getItem('selectedPlan') || '{}');

            const orderData = {
                name: userDetails.fullName,
                email: userDetails.email,
                phone: userDetails.phone,
                dateOfBirth: userDetails.dob,
                timeOfBirth: userDetails.timeOfBirth,
                placeOfBirth: userDetails.cityOfBirth,
                currentLocation: userDetails.currentLocation,
                specificQuestion: userDetails.specificQuestion,
                plan: selectedPlan.plan?.toLowerCase().includes('oracle') ? 'fasttrack' : 'standard'
            };

            // 1. Create order on backend
            const order = await api.createOrder(orderData);

            // TEMPORARY BYPASS CHECK — pipeline already started by /api/orders/create
            if (order.bypass) {
                console.log("⚠️ Payment bypassed — pipeline running from /create");
                sessionStorage.setItem('orderId', order.orderId);
                sessionStorage.setItem('paymentSuccess', 'true');
                setLoading(false);
                navigate('/confirmation');
                return;
            }

            // 2. Open Razorpay checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'Khud Ko Jaano',
                description: 'Your Cosmic Blueprint',
                order_id: order.razorpayOrderId,
                prefill: {
                    name: orderData.name,
                    email: orderData.email,
                    contact: orderData.phone
                },
                theme: { color: '#c9a84c' },
                modal: {
                    ondismiss: () => {
                        console.log('Payment cancelled by user');
                        setLoading(false);
                    }
                },
                handler: async function (response: any) {
                    setLoading(true);
                    try {
                        // 3. Verify payment on backend
                        const verification = await api.verifyPayment({
                            orderId: order.orderId,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature
                        });

                        if (verification.success) {
                            sessionStorage.setItem('orderId', verification.orderId);
                            sessionStorage.setItem('paymentSuccess', 'true');
                            setLoading(false);
                            navigate('/confirmation');
                        }
                    } catch (verifyError: any) {
                        console.error('Verification Error:', verifyError);
                        setLoading(false);
                        setError(verifyError.message || 'Payment verification failed. Please contact support.');
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', (response: any) => {
                console.error('Payment failed:', response.error);
                setLoading(false);
                setError('Payment failed. Please try again.');
            });
            rzp.open();

        } catch (error: any) {
            console.error('Payment Error:', error);
            setLoading(false);
            setError(error.message || 'The celestial alignment failed. Please try again.');
        }
    };

    return (
        <div className="relative min-h-screen">
            <CosmicBackground />

            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2000] bg-bg-deep flex flex-col items-center justify-center"
                    >
                        <div className="relative w-32 h-32 mb-10">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border border-accent-gold/20 rounded-full"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-4 border border-accent-gold/40 rounded-full border-t-transparent"
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-accent-gold text-2xl font-heading animate-pulse">
                                ✧
                            </div>
                        </div>
                        <p className="text-accent-gold tracking-[0.4em] uppercase text-[10px] animate-pulse">Synchronizing with the Stars</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 pt-32 pb-20 px-6">
                <div className="max-w-xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="astrology-card p-12 text-center"
                    >
                        <span className="text-accent-gold tracking-[0.4em] uppercase text-[10px] mb-8 block">Final Step</span>
                        <h1 className="text-3xl font-heading mb-12">Sacred <span className="text-gradient">Exchange</span></h1>

                        <div className="space-y-6 mb-12 text-left">
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-text-muted text-xs uppercase tracking-widest">Selected Transmission</span>
                                <span className="text-text-primary font-medium tracking-widest uppercase text-sm">{planInfo.plan}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-text-muted text-xs uppercase tracking-widest">Offering</span>
                                <span className="text-accent-gold font-heading text-2xl">₹{planInfo.price}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-text-muted text-xs uppercase tracking-widest">Delivery Channel</span>
                                <span className="text-text-primary text-sm font-light">Ethereal PDF (Email)</span>
                            </div>
                        </div>

                        <div className="glass-pane p-6 mb-12 flex items-start gap-4 text-left">
                            <span className="text-accent-gold">🔒</span>
                            <p className="text-[10px] text-text-muted leading-relaxed uppercase tracking-wider">
                                Your energetic data is encrypted using 256-bit celestial standards. No real transaction will occur in this simulator.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs uppercase tracking-widest">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handlePay}
                            disabled={loading}
                            className={`btn-gold w-full !py-5 !text-base ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Processing...' : 'Finalize Exchange'}
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
