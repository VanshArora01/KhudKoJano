import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CosmicBackground from '../components/CosmicBackground';

const ConfirmationPage = () => {
    const [details, setDetails] = useState({
        id: 'KKJ-XXXXXX',
        plan: 'The Seeker',
        email: 'seeker@stars.com',
    });

    useEffect(() => {
        const orderId = sessionStorage.getItem('orderId') || 'KKJ-8271AS';
        const planStored = sessionStorage.getItem('selectedPlan');
        const userStored = sessionStorage.getItem('userDetails');

        let planName = 'The Seeker';
        let userEmail = 'seeker@stars.com';

        if (planStored) planName = JSON.parse(planStored).plan;
        if (userStored) userEmail = JSON.parse(userStored).email;

        setDetails({ id: orderId, plan: planName, email: userEmail });
    }, []);

    return (
        <div className="relative min-h-screen">
            <CosmicBackground />

            <div className="relative z-10 pt-32 pb-20 px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="mb-12"
                    >
                        <div className="w-24 h-24 rounded-full border border-accent-gold/40 flex items-center justify-center mx-auto mb-10 relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-t border-accent-gold"
                            />
                            <span className="text-accent-gold text-4xl">✦</span>
                        </div>
                        <span className="text-accent-gold tracking-[0.6em] uppercase text-xs mb-6 block">Order Confirmed</span>
                        <h1 className="text-5xl md:text-7xl font-heading mb-8">The Stars are <span className="text-gradient">Aligning</span></h1>
                        <p className="text-text-secondary text-lg font-light leading-relaxed max-w-lg mx-auto mb-16">
                            Your transmission has been received. Our oracles have begun analyzing the celestial alignment of your arrival.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass-pane p-12 text-left"
                    >
                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-1">
                                <span className="text-text-muted text-[10px] uppercase tracking-widest">Order Identifier</span>
                                <p className="text-accent-gold font-heading text-xl">{details.id}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-text-muted text-[10px] uppercase tracking-widest">Report Type</span>
                                <p className="text-text-primary uppercase tracking-widest text-sm">{details.plan}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-text-muted text-[10px] uppercase tracking-widest">Delivery Target</span>
                                <p className="text-text-primary text-sm font-light">{details.email}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-text-muted text-[10px] uppercase tracking-widest">Status</span>
                                <p className="text-accent-gold text-[10px] uppercase tracking-[0.25em] font-bold animate-pulse">Calculating Positions...</p>
                            </div>
                        </div>
                        <div className="mt-10 mb-2 py-6 border-y border-white/5 text-center">
                            <p className="text-[13px] font-lato italic text-[#c0c0c8]/50">
                                Questions? Reach us at <a href="mailto:khudkojano@gmail.com" className="text-accent-gold/70 hover:text-accent-gold no-underline transition-colors">khudkojano@gmail.com</a><br className="md:hidden" /> or WhatsApp <a href="https://wa.me/917009771810" target="_blank" rel="noopener noreferrer" className="text-accent-gold/70 hover:text-accent-gold no-underline transition-colors">+91 70097 71810</a>
                            </p>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] mb-10 leading-loose">
                                You will receive your personalized PDF blueprint via email <br className="hidden md:block" /> within the promised timeframe.
                            </p>
                            <div className="flex flex-col md:flex-row gap-6 justify-center">
                                <Link to="/" className="btn-gold !text-[10px]">Return to Galaxy</Link>
                                <Link to="/details" className="text-[10px] uppercase tracking-widest text-text-secondary hover:text-white transition-colors flex items-center justify-center">Another Report →</Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPage;
