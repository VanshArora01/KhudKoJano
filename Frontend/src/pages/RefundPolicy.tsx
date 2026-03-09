import React from 'react';
import { motion } from 'framer-motion';
import CosmicBackground from '../components/CosmicBackground';

const RefundPolicy = () => {
    return (
        <div className="relative min-h-screen">
            <CosmicBackground />
            <div className="relative z-10 pt-32 md:pt-40 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.header
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-24 text-center"
                    >
                        <span className="text-accent-gold tracking-[0.4em] uppercase text-[10px] mb-4 block">Exchange Protocol</span>
                        <h1 className="text-4xl md:text-7xl font-heading mb-8">Refund <span className="text-gradient">Policy</span></h1>
                        <div className="w-24 h-[1px] bg-accent-gold/30 mx-auto" />
                    </motion.header>

                    <div className="glass-pane p-12 md:p-20 space-y-16">
                        <section>
                            <h2 className="text-accent-gold font-heading tracking-widest text-xl mb-6 uppercase">1. Digital Nature</h2>
                            <p className="text-text-secondary font-light leading-loose">
                                Our astrology reports are personalized digital products, handcrafted using AI and astrological expertise based on your unique birth details. Because of their bespoke nature, we do not provide refunds once the generation process has been initiated.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-accent-gold font-heading tracking-widest text-xl mb-6 uppercase">2. Delivery Timeframes</h2>
                            <p className="text-text-secondary font-light leading-loose">
                                We strive to deliver reports within the following windows:
                            </p>
                            <ul className="mt-6 space-y-4 text-sm text-text-secondary font-light">
                                <li className="flex gap-4">
                                    <span className="text-accent-gold">✦</span>
                                    <span>Standard Analysis: Within 24 terrestrial hours.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-accent-gold">✦</span>
                                    <span>Fast Track Analysis: Within 2 terrestrial hours.</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-accent-gold font-heading tracking-widest text-xl mb-6 uppercase">3. Eligibility for Resolution</h2>
                            <p className="text-text-secondary font-light leading-loose">
                                In the rare event of a technical failure on our end that prevents the delivery of your report beyond the promised timeframe, a full refund will be issued. If you have not received your report, please contact us for immediate resolution.
                            </p>
                        </section>

                        <div className="pt-12 border-t border-accent-gold/10 text-center">
                            <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] mb-4">Support Contact</p>
                            <p className="text-accent-gold font-heading tracking-widest mb-2">khudkojano@gmail.com</p>
                            <p className="text-accent-gold font-heading tracking-widest">+91 70097 71810</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
