import React from 'react';
import { motion } from 'framer-motion';
import CosmicBackground from '../components/CosmicBackground';

const PrivacyPolicy = () => {
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
                        <span className="text-accent-gold tracking-[0.4em] uppercase text-[10px] mb-4 block">Privacy Protocol</span>
                        <h1 className="text-4xl md:text-7xl font-heading mb-8">Privacy <span className="text-gradient">Policy</span></h1>
                        <div className="w-24 h-[1px] bg-accent-gold/30 mx-auto" />
                        <p className="text-text-muted text-[10px] uppercase tracking-widest mt-8">Last updated: March 9, 2026</p>
                    </motion.header>

                    <div className="glass-pane p-12 md:p-20 space-y-16">
                        <section>
                            <h2 className="text-accent-gold font-heading tracking-widest text-xl mb-6 uppercase">1. Data Collection</h2>
                            <p className="text-text-secondary font-light leading-loose">
                                To generate your personalized astrology reports, we collect the following information: name, email address, phone number, date of birth, time of birth, and place of birth. We also collect any specific questions you provide to tailor our analysis.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-accent-gold font-heading tracking-widest text-xl mb-6 uppercase">2. Purpose of Collection</h2>
                            <p className="text-text-secondary font-light leading-loose">
                                This data is used exclusively to perform complex astrological calculations and generate your bespoke Cosmic Blueprint. Your email address is used to deliver the finalized report and related communications.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-accent-gold font-heading tracking-widest text-xl mb-6 uppercase">3. Data Security & Sharing</h2>
                            <p className="text-text-secondary font-light leading-loose">
                                Your personal data is stored in our secure, encrypted database. We maintain strict confidentiality and do not sell, share, or distribute your information to any third parties for marketing purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-accent-gold font-heading tracking-widest text-xl mb-6 uppercase">4. Your Rights</h2>
                            <p className="text-text-secondary font-light leading-loose">
                                You have the right to request the deletion of your personal data at any time. Simply email us at the address provided below, and we will purge your information from our records within 48 terrestrial hours.
                            </p>
                        </section>

                        <div className="pt-12 border-t border-accent-gold/10 text-center">
                            <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] mb-4">Contact for Data Requests</p>
                            <p className="text-accent-gold font-heading tracking-widest mb-2">khudkojano@gmail.com</p>
                            <p className="text-accent-gold font-heading tracking-widest">+91 70097 71810</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
