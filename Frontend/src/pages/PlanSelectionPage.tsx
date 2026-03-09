import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CosmicBackground from '../components/CosmicBackground';

const PlanSelectionPage = () => {
    const navigate = useNavigate();

    const plans = [
        {
            id: 'standard',
            name: 'The Seeker',
            price: 99,
            subtitle: 'A roadmap for the journey',
            features: [
                'Complete Natal Chart Analysis',
                'Zodiac Archetype Breakdown',
                'Career & Professional Alignment',
                'Core Relationship Chemistry',
                '48-Hour Celestial Delivery'
            ],
            highlight: false
        },
        {
            id: 'premium',
            name: 'The Oracle',
            price: 199,
            subtitle: 'The full cosmic download',
            features: [
                'Everything in The Seeker',
                '10-Year Timeline Prediction',
                'Personalized Mahadasha Analysis',
                'Vedic Remedial Rituals',
                'Gemstone & Mantra Guidance',
                '24-Hour Priority Processing'
            ],
            highlight: true
        }
    ];

    const handleSelect = (plan: any) => {
        sessionStorage.setItem('selectedPlan', JSON.stringify({ plan: plan.name, price: plan.price }));
        navigate('/payment');
    };

    return (
        <div className="relative min-h-screen">
            <CosmicBackground />

            <div className="relative z-10 pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-20 text-center">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-accent-gold tracking-[0.4em] uppercase text-[10px] mb-4 block"
                        >
                            The Exchange
                        </motion.span>
                        <h1 className="text-4xl md:text-6xl font-heading mb-6">Choose Your <span className="text-gradient">Transmission</span></h1>
                        <p className="text-text-secondary font-light max-w-lg mx-auto">
                            Energy flows where intention goes. Select the depth of analysis your soul currently requires.
                        </p>
                    </header>

                    <div className="grid md:grid-cols-2 gap-12 items-stretch">
                        {plans.map((plan, idx) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, x: idx === 0 ? -30 : 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className={`astrology-card flex flex-col justify-between ${plan.highlight ? 'border-accent-gold/50 bg-accent-gold/[0.03]' : ''}`}
                            >
                                {plan.highlight && (
                                    <div className="absolute top-0 left-0 bg-accent-gold text-bg-deep px-6 py-1 text-[10px] tracking-widest font-bold">
                                        MOST REVEALING
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-3xl font-heading mb-2">{plan.name}</h3>
                                    <p className="text-accent-gold text-xs uppercase tracking-[0.2em] mb-10">{plan.subtitle}</p>

                                    <ul className="space-y-6 mb-16">
                                        {plan.features.map((feature, fIdx) => (
                                            <li key={fIdx} className="flex items-start gap-4 text-text-secondary text-sm font-light">
                                                <span className="text-accent-gold mt-1">✦</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex items-end justify-between border-t border-accent-gold/10 pt-10">
                                    <div>
                                        <span className="text-5xl font-heading text-gradient">₹{plan.price}</span>
                                        <p className="text-[10px] text-text-muted uppercase tracking-widest mt-2">Personalized Exchange</p>
                                    </div>
                                    <button
                                        onClick={() => handleSelect(plan)}
                                        className={`btn-gold ${plan.highlight ? '!bg-accent-gold !text-bg-deep' : ''}`}
                                    >
                                        Select {plan.name}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanSelectionPage;
