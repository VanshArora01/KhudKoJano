import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CosmicBackground from '../components/CosmicBackground';

const DetailsPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        dob: '',
        timeOfBirth: '',
        cityOfBirth: '',
        stateOfBirth: '',
        currentLocation: '',
        specificQuestion: '',
    });

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sessionStorage.setItem('userDetails', JSON.stringify(formData));
        navigate('/choose-plan');
    };

    return (
        <div className="relative min-h-screen">
            <CosmicBackground />

            <div className="relative z-10 pt-32 pb-20 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto"
                >
                    <header className="mb-16 text-center">
                        <span className="text-accent-gold tracking-[0.3em] uppercase text-[10px] mb-4 block">The Portal</span>
                        <h1 className="text-4xl md:text-6xl font-heading mb-6">Chart Your <span className="text-gradient">Descent</span></h1>
                        <p className="text-text-secondary font-light max-w-lg mx-auto leading-relaxed">
                            Precision is the bridge between calculation and revelation. Provide your details with care.
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-12">
                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                                <label className="label-minimal">Full Name</label>
                                <input
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className="input-minimal"
                                    placeholder="The name you carry"
                                />
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                                <label className="label-minimal">Contact Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="input-minimal"
                                    placeholder="seeker@stars.com"
                                />
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                                <label className="label-minimal">Phone</label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="input-minimal"
                                    placeholder="+91 70097 71810"
                                />
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                                <label className="label-minimal">Birth Date</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    required
                                    className="input-minimal"
                                />
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                                <label className="label-minimal">Exact Time of Birth</label>
                                <input
                                    type="time"
                                    name="timeOfBirth"
                                    value={formData.timeOfBirth}
                                    onChange={handleChange}
                                    required
                                    className="input-minimal"
                                />
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                                <label className="label-minimal">City of Birth</label>
                                <input
                                    name="cityOfBirth"
                                    value={formData.cityOfBirth}
                                    onChange={handleChange}
                                    required
                                    className="input-minimal"
                                    placeholder="e.g. Varanasi"
                                />
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                                <label className="label-minimal">State/Region</label>
                                <input
                                    name="stateOfBirth"
                                    value={formData.stateOfBirth}
                                    onChange={handleChange}
                                    required
                                    className="input-minimal"
                                    placeholder="e.g. Uttar Pradesh"
                                />
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                                <label className="label-minimal">Current Location</label>
                                <input
                                    name="currentLocation"
                                    value={formData.currentLocation}
                                    onChange={handleChange}
                                    required
                                    className="input-minimal"
                                    placeholder="Where the celestial rays find you now"
                                />
                            </motion.div>
                        </div>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                            <label className="label-minimal">Specific Inquiry</label>
                            <textarea
                                name="specificQuestion"
                                value={formData.specificQuestion}
                                onChange={handleChange}
                                className="input-minimal min-h-[100px] resize-none"
                                placeholder="What does your soul seek to uncover? (Career, Love, Purpose...)"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="pt-12 text-center"
                        >
                            <button
                                type="submit"
                                className="btn-gold px-20 py-5 text-sm group"
                            >
                                Proceed to Sanctuary
                                <span className="ml-3 group-hover:translate-x-2 transition-transform inline-block">→</span>
                            </button>
                        </motion.div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default DetailsPage;
