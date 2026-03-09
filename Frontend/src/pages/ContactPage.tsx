import React from 'react';
import { motion } from 'framer-motion';
import CosmicBackground from '../components/CosmicBackground';

const ContactPage = () => {
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
                        <span className="text-accent-gold tracking-[0.4em] uppercase text-[10px] mb-4 block">The Connection</span>
                        <h1 className="text-4xl md:text-7xl font-heading mb-8">Reach the <span className="text-gradient">Portal</span></h1>
                        <p className="text-text-secondary font-light max-w-lg mx-auto leading-relaxed">
                            Have a question about your chart or a technical inquiry? Our initiates are ready to assist.
                        </p>
                    </motion.header>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Email Card */}
                        <motion.a
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            href="mailto:khudkojano@gmail.com"
                            className="glass-pane p-12 border border-accent-gold/30 hover:border-accent-gold transition-all flex flex-col items-center text-center group"
                        >
                            <span className="text-4xl mb-6 group-hover:scale-110 transition-transform block">✉</span>
                            <span className="text-accent-gold text-[10px] uppercase tracking-[0.3em] mb-2 block">Email Us</span>
                            <p className="text-lg md:text-xl font-heading tracking-wider text-white">khudkojano@gmail.com</p>
                        </motion.a>

                        {/* Phone Card */}
                        <motion.a
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            href="https://wa.me/917009771810"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-pane p-12 border border-accent-gold/30 hover:border-accent-gold transition-all flex flex-col items-center text-center group"
                        >
                            <span className="text-4xl mb-6 group-hover:scale-110 transition-transform block">📱</span>
                            <span className="text-accent-gold text-[10px] uppercase tracking-[0.3em] mb-2 block">WhatsApp / Call</span>
                            <p className="text-lg md:text-xl font-heading tracking-wider text-white">+91 70097 71810</p>
                        </motion.a>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mt-20 text-center"
                    >
                        <p className="text-text-muted text-[10px] uppercase tracking-[0.4em] mb-8">Celestial Hours</p>
                        <p className="text-text-secondary font-light text-sm max-w-md mx-auto leading-loose">
                            Our oracles are available from 10:00 AM to 08:00 PM IST. <br />
                            Response velocity is approximately 12 terrestrial hours.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
