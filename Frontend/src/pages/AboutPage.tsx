import React from 'react';
import { motion } from 'framer-motion';
import CosmicBackground from '../components/CosmicBackground';

const AboutPage = () => {
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
                        <span className="text-accent-gold tracking-[0.4em] uppercase text-[10px] mb-4 block">The Philosophy</span>
                        <h1 className="text-4xl md:text-7xl font-heading mb-8">Decoding the <span className="text-gradient">Unknown</span></h1>
                        <div className="w-24 h-[1px] bg-accent-gold/30 mx-auto" />
                    </motion.header>

                    <div className="space-y-24">
                        <motion.section
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="grid md:grid-cols-2 gap-16 items-start"
                        >
                            <h2 className="text-2xl font-heading text-accent-gold tracking-widest">Our Origin</h2>
                            <div className="text-text-secondary font-light leading-loose space-y-6">
                                <p>
                                    Khud Ko Jaano emerged from a singular realization: that the modern world has disconnected us from the very rhythms that define our existence. We are not separate from the cosmos; we are the cosmos experiencing itself.
                                </p>
                                <p>
                                    Founded by a collective of traditional Vedic scholars and modern data architects, we seek to bridge the gap between ancient manuscript wisdom and the contemporary need for direction.
                                </p>
                            </div>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="grid md:grid-cols-2 gap-16 items-start"
                        >
                            <h2 className="text-2xl font-heading text-accent-gold tracking-widest">The "Why"</h2>
                            <div className="text-text-secondary font-light leading-loose space-y-6">
                                <p>
                                    Astrology is often misunderstood as fate. We understand it as navigation. Just as a captain uses a chart to navigate the tides, you use your birth chart to navigate the currents of your life.
                                </p>
                                <p>
                                    Knowing yourself—"Khud Ko Jaano"—is the highest form of rebellion in a world that tries to tell you who you are. We provide the map; you walk the path.
                                </p>
                            </div>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="astrology-card border-none !bg-accent-gold/[0.03] p-16 text-center"
                        >
                            <h2 className="text-3xl font-heading mb-10 text-gradient">The Oracle Commitment</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    { label: "Bespoke", val: "Every report is calculated and written uniquely." },
                                    { label: "Vedic", val: "Traditional Parashari & Jaimini principles." },
                                    { label: "Privacy", val: "Your energetic data remains yours alone." },
                                    { label: "Depth", val: "No generic sun-sign filler. Ever." }
                                ].map((item, i) => (
                                    <div key={i} className="space-y-4">
                                        <span className="text-accent-gold text-xs uppercase tracking-[0.2em] font-bold">{item.label}</span>
                                        <p className="text-[10px] text-text-muted leading-relaxed uppercase">{item.val}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
