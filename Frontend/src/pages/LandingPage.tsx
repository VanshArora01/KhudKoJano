import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CosmicBackground from '../components/CosmicBackground';
import SacredIcon from '../components/SacredIcon';

const LandingPage = () => {
    return (
        <div className="relative min-h-screen overflow-hidden">
            <CosmicBackground />

            {/* ===== HERO SECTION ===== */}
            <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center section-padding px-6 md:px-16 lg:px-24">
                <div className="max-w-5xl w-full text-center relative z-10 flex flex-col items-center">

                    {/* Mobile-Only Visual (Creative Element) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="md:hidden mb-8 relative"
                    >
                        <div className="absolute inset-0 bg-accent-gold/20 blur-[60px] rounded-full scale-150" />
                        <SacredIcon type="stars" className="w-24 h-24 relative z-10 text-accent-gold animate-pulse" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="relative"
                    >
                        <span className="inline-block text-accent-gold tracking-[0.3em] md:tracking-[0.4em] uppercase text-[10px] md:text-xs mb-4 md:mb-6 font-medium">
                            Ancient Wisdom • Modern Clarity
                        </span>

                        <h1 className="text-4xl sm:text-5xl md:text-8xl mb-6 md:mb-8 leading-[1.1] md:leading-tight font-heading">
                            <span className="md:hidden">Decoding Your</span>
                            <span className="hidden md:inline">Decoding Your <br /></span>
                            <span className="text-gradient block md:inline mt-2 md:mt-0">Cosmic Blueprint</span>
                        </h1>

                        <p className="text-text-secondary text-sm md:text-xl max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed font-light px-2 md:px-4">
                            Your existence isn't accidental. The stars were aligned in a specific pattern the moment you arrived. <span className="hidden sm:inline">We help you read that design.</span>
                        </p>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-block"
                        >
                            <Link to="/details" className="btn-gold px-8 md:px-12 py-3 md:py-4 text-sm md:text-base">
                                Begin Your Journey
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Central Zodiac Wheel visual (Desktop mainly, adapted for mobile) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.15 }}
                        transition={{ delay: 1, duration: 2 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[150%] sm:w-[120%] aspect-square rounded-full border border-accent-gold/20 flex items-center justify-center pointer-events-none overflow-hidden"
                    >
                        <div className="w-[85%] aspect-square rounded-full border border-accent-gold/10" />
                        <div className="absolute inset-0 rotate-anim opacity-20">
                            {/* Simplified Zodiac Wheel Visual */}
                            <svg viewBox="0 0 100 100" className="w-full h-full stroke-accent-gold fill-none opacity-20">
                                <circle cx="50" cy="50" r="48" strokeWidth="0.05" />
                                {[...Array(12)].map((_, i) => (
                                    <line key={i} x1="50" y1="2" x2="50" y2="10" transform={`rotate(${i * 30} 50 50)`} strokeWidth="0.05" />
                                ))}
                            </svg>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-accent-gold/40 text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.5em] uppercase pointer-events-none whitespace-nowrap"
                >
                    Scroll to explore
                </motion.div>
            </section>

            {/* ===== THE THREE PILLARS (HOW IT WORKS) ===== */}
            <section className="relative py-32 geometry-pattern" id="how-it-works">
                <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
                    <div className="mb-24 text-center">
                        <h2 className="text-3xl md:text-5xl mb-4 font-heading">The Path to <span className="text-accent-gold">Insight</span></h2>
                        <div className="w-20 h-[1.5px] bg-accent-gold mx-auto" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                step: "01",
                                title: "Celestial Entry",
                                desc: "Provide the precise moment and location of your descent to Earth.",
                                icon: <SacredIcon type="stars" className="w-16 h-16" />
                            },
                            {
                                step: "02",
                                title: "Archetypal Analysis",
                                desc: "Our systems calculate the dasha systems and planetary strengths tailored to you.",
                                icon: <SacredIcon type="sun" className="w-16 h-16" />
                            },
                            {
                                step: "03",
                                title: "Soul Blueprint",
                                desc: "Receive a comprehensive report that mirrors your internal chemistry and external destiny.",
                                icon: <SacredIcon type="moon" className="w-16 h-16" />
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="astrology-card group"
                            >
                                <span className="text-accent-gold/10 text-8xl font-heading absolute top-4 right-6 transition-all group-hover:text-accent-gold/30 pointer-events-none select-none">
                                    {item.step}
                                </span>
                                <div className="mb-6">{item.icon}</div>
                                <h3 className="text-xl mb-4 font-heading tracking-widest">{item.title}</h3>
                                <p className="text-text-secondary leading-relaxed font-light">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== DISCOVERIES SECTION ===== */}
            <section className="relative py-32 bg-bg-deep/50">
                <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-6xl mb-8 font-heading leading-tight">
                                Beyond the <br /> <span className="text-gradient">Surface</span>
                            </h2>
                            <p className="text-text-secondary text-lg mb-10 font-light leading-loose">
                                Most horoscopes offer a keyhole view. We provide the blueprint to the entire house. Understand the forces that pull your tides and the rhythms that guide your growth.
                            </p>
                            <div className="space-y-6">
                                {['Karmic Debt & Lessons', 'Evolutionary Purpose', 'Elemental Balance', 'Shadow Integration'].map((point, i) => (
                                    <div key={i} className="flex items-center gap-4 text-accent-gold">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
                                        <span className="tracking-[0.2em] uppercase text-xs font-semibold">{point}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-4 md:gap-8 relative">
                            <div className="absolute -inset-10 bg-accent-gold/10 blur-[120px] rounded-full -z-10" />
                            {[
                                { t: "Career", d: "Professional peak periods", icon: "briefcase" },
                                { t: "Love", d: "Synergy and connection", icon: "heart" },
                                { t: "Health", d: "Vitality cycles", icon: "lotus" },
                                { t: "Wealth", d: "Venusian flow and legacy", icon: "diamond" }
                            ].map((box, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10, backgroundColor: 'rgba(198, 168, 94, 0.08)' }}
                                    className={`glass-pane p-6 md:p-10 flex flex-col justify-center items-center text-center group transition-all duration-500 ${i % 2 !== 0 ? 'md:translate-y-12' : ''}`}
                                >
                                    <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500">
                                        <SacredIcon type={box.icon as any} className="w-10 h-10 md:w-14 md:h-14" />
                                    </div>
                                    <div className="text-text-primary text-sm md:text-base font-heading tracking-[0.2em] mb-3">{box.t}</div>
                                    <p className="text-[10px] md:text-xs text-text-muted leading-relaxed max-w-[120px] mx-auto uppercase tracking-wider">{box.d}</p>

                                    {/* Decorative corner element */}
                                    <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-accent-gold/20 group-hover:border-accent-gold/60 transition-colors" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== PRICING (MODERN ASYMMETRIC) ===== */}
            <section className="relative py-32" id="plans">
                <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24">
                    <div className="flex flex-col md:flex-row gap-12 items-stretch">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="flex-1 astrology-card !bg-transparent !border-accent-gold/20 flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="text-2xl font-heading mb-2">The Seeker</h3>
                                <p className="text-text-muted text-sm mb-8 uppercase tracking-[0.2em]">Standard Analysis</p>
                                <ul className="space-y-4 mb-12">
                                    <li className="flex justify-between border-b border-white/5 pb-2"><span className="text-text-secondary text-sm">Birth Chart</span> <span className="text-accent-gold">✓</span></li>
                                    <li className="flex justify-between border-b border-white/5 pb-2"><span className="text-text-secondary text-sm">Life Overview</span> <span className="text-accent-gold">✓</span></li>
                                    <li className="flex justify-between border-b border-white/5 pb-2"><span className="text-text-secondary text-sm">Career & Money</span> <span className="text-accent-gold">✓</span></li>
                                </ul>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-heading text-gradient">₹99</span>
                                <Link to="/details" className="text-xs uppercase tracking-widest text-accent-gold hover:text-white transition-colors">Select Plan →</Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 1.05 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="flex-[1.2] astrology-card border-accent-gold/60 bg-accent-gold/5 flex flex-col justify-between relative"
                        >
                            <div className="absolute top-0 right-0 bg-accent-gold text-bg-deep px-4 py-1 text-[10px] tracking-widest font-bold">PREMIUM</div>
                            <div>
                                <h3 className="text-3xl font-heading mb-2">The Oracle</h3>
                                <p className="text-accent-gold text-sm mb-8 uppercase tracking-[0.2em]">Full Cosmic Download</p>
                                <ul className="space-y-4 mb-12">
                                    <li className="flex justify-between border-b border-accent-gold/10 pb-2"><span className="text-text-secondary text-sm">Everything in Seeker</span> <span className="text-accent-gold">✦</span></li>
                                    <li className="flex justify-between border-b border-accent-gold/10 pb-2"><span className="text-text-secondary text-sm">10-Year Predictions</span> <span className="text-accent-gold">✦</span></li>
                                    <li className="flex justify-between border-b border-accent-gold/10 pb-2"><span className="text-text-secondary text-sm">Remedial Rituals</span> <span className="text-accent-gold">✦</span></li>
                                    <li className="flex justify-between border-b border-accent-gold/10 pb-2"><span className="text-text-secondary text-sm">Dasha Timeline</span> <span className="text-accent-gold">✦</span></li>
                                </ul>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <span className="text-4xl font-heading text-gradient">₹199</span>
                                    <p className="text-[10px] text-accent-gold/60 tracking-widest uppercase">24h Priority Delivery</p>
                                </div>
                                <Link to="/details" className="btn-gold !bg-accent-gold !text-bg-deep">Begin Oracle</Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS (MINIMALIST) ===== */}
            <section className="relative py-32 border-t border-accent-gold/10">
                <div className="max-w-4xl mx-auto px-6 md:px-16 lg:px-24 text-center">
                    <span className="text-accent-gold text-2xl mb-12 block">“</span>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-2xl md:text-3xl font-serif italic text-text-secondary leading-relaxed mb-12"
                    >
                        The accuracy of the delivery timing and the depth of the career analysis left me speechless. It's like someone finally turned on the lights in a room I've been standing in for years.
                    </motion.p>
                    <div className="space-y-2">
                        <div className="text-accent-gold uppercase tracking-[0.3em] text-xs font-bold">Rhea Kapur</div>
                        <div className="text-text-muted text-[10px] uppercase tracking-[0.2em]">Creative Director, Delhi</div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default LandingPage;
