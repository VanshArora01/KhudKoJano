import React from 'react';
import { motion } from 'framer-motion';
import CosmicBackground from '../components/CosmicBackground';

const TermsPage = () => {
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
                        <span className="text-accent-gold tracking-[0.4em] uppercase text-[10px] mb-4 block">The Covenant</span>
                        <h1 className="text-4xl md:text-7xl font-heading mb-8">Terms & <span className="text-gradient">Conditions</span></h1>
                        <div className="w-24 h-[1px] bg-accent-gold/30 mx-auto" />
                    </motion.header>

                    <div className="glass-pane p-12 md:p-20 space-y-16">
                        <section>
                            <h2 className="text-accent-gold font-heading tracking-widest text-xl mb-6 uppercase">1. Nature of Service</h2>
                            <p className="text-text-secondary font-light leading-loose">
                                Our service is provided for guidance and spiritual exploration purposes only. The analyses are artistic interpretations of astrological archetypes and should not be used as a substitute for professional medical, legal, or financial advice. We are not responsible for decisions made based on the report.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-accent-gold font-heading tracking-widest text-xl mb-6 uppercase">2. Accuracy of Data</h2>
                            <p className="text-text-secondary font-light leading-loose">
                                By placing an order, the user confirms that all birth details (date, time, and place) provided are accurate to the best of their knowledge. Astrological calculations are highly sensitive to these details.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-accent-gold font-heading tracking-widest text-xl mb-6 uppercase">3. Governing Law</h2>
                            <p className="text-text-secondary font-light leading-loose">
                                These terms and the use of the Khud Ko Jaano platform are governed by and construed in accordance with the laws of India.
                            </p>
                        </section>

                        <div className="pt-12 border-t border-accent-gold/10 text-center">
                            <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] mb-4">Official Contact</p>
                            <p className="text-accent-gold font-heading tracking-widest mb-2">khudkojano@gmail.com</p>
                            <p className="text-accent-gold font-heading tracking-widest">+91 70097 71810</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
