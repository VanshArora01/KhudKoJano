import { motion } from 'framer-motion';

interface SacredIconProps {
    type: 'stars' | 'sun' | 'moon' | 'eye' | 'briefcase' | 'heart' | 'lotus' | 'diamond';
    className?: string;
}

const SacredIcon = ({ type, className }: SacredIconProps) => {
    const iconVariants = {
        animate: {
            rotate: 360,
            transition: { duration: 20, repeat: Infinity, ease: "linear" as const }
        }
    };

    const pulseVariants = {
        animate: {
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const }
        }
    };

    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            {type === 'stars' && (
                <motion.svg viewBox="0 0 100 100" className="w-full h-full stroke-accent-gold fill-none">
                    <motion.circle cx="50" cy="50" r="45" strokeWidth="0.5" strokeDasharray="2 4" variants={iconVariants} animate="animate" />
                    <motion.path d="M50 20 L50 80 M20 50 L80 50" strokeWidth="0.5" variants={pulseVariants} animate="animate" />
                    <motion.path d="M30 30 L70 70 M30 70 L70 30" strokeWidth="0.5" variants={pulseVariants} animate="animate" />
                </motion.svg>
            )}

            {type === 'sun' && (
                <motion.svg viewBox="0 0 100 100" className="w-full h-full stroke-accent-gold fill-none">
                    <circle cx="50" cy="50" r="15" strokeWidth="1" />
                    {[...Array(12)].map((_, i) => (
                        <motion.line
                            key={i}
                            x1="50" y1="15" x2="50" y2="5"
                            transform={`rotate(${i * 30} 50 50)`}
                            strokeWidth="1"
                            initial={{ scaleY: 1 }}
                            animate={{ scaleY: [1, 1.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                        />
                    ))}
                </motion.svg>
            )}

            {type === 'moon' && (
                <motion.svg viewBox="0 0 100 100" className="w-full h-full fill-accent-gold opacity-40">
                    <path d="M50 20 A30 30 0 1 1 50 80 A25 25 0 1 0 50 20" />
                    <motion.circle cx="70" cy="30" r="2" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity }} />
                </motion.svg>
            )}

            {type === 'eye' && (
                <motion.svg viewBox="0 0 100 100" className="w-full h-full stroke-accent-gold fill-none">
                    <path d="M20 50 Q50 20 80 50 Q50 80 20 50" strokeWidth="1" />
                    <motion.circle
                        cx="50" cy="50" r="8"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        strokeWidth="1"
                    />
                </motion.svg>
            )}

            {type === 'briefcase' && (
                <motion.svg viewBox="0 0 100 100" className="w-full h-full stroke-accent-gold fill-none">
                    <rect x="25" y="35" width="50" height="40" rx="2" strokeWidth="1.5" />
                    <path d="M40 35 V28 Q40 25 43 25 H57 Q60 25 60 28 V35" strokeWidth="1.5" />
                    <motion.line x1="45" y1="55" x2="55" y2="55" strokeWidth="1.5" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                </motion.svg>
            )}

            {type === 'heart' && (
                <motion.svg viewBox="0 0 100 100" className="w-full h-full stroke-accent-gold fill-none">
                    <motion.path
                        d="M50 80 C20 60 10 40 10 25 A15 15 0 0 1 40 15 A15 15 0 0 1 50 25 A15 15 0 0 1 60 15 A15 15 0 0 1 90 25 C90 40 80 60 50 80"
                        strokeWidth="1.5"
                        animate={{ scale: [0.95, 1.05, 0.95] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                </motion.svg>
            )}

            {type === 'lotus' && (
                <motion.svg viewBox="0 0 100 100" className="w-full h-full stroke-accent-gold fill-none">
                    <motion.path
                        d="M50 80 Q65 60 50 30 Q35 60 50 80"
                        strokeWidth="1.2"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                    <path d="M50 80 Q80 70 85 40 Q70 45 50 80" strokeWidth="1.2" />
                    <path d="M50 80 Q20 70 15 40 Q30 45 50 80" strokeWidth="1.2" />
                </motion.svg>
            )}

            {type === 'diamond' && (
                <motion.svg viewBox="0 0 100 100" className="w-full h-full stroke-accent-gold fill-none">
                    <path d="M50 15 L85 45 L50 85 L15 45 Z" strokeWidth="1.5" />
                    <path d="M15 45 H85 M50 15 V85" strokeWidth="0.5" opacity="0.5" />
                    <motion.circle
                        cx="50" cy="45" r="3" fill="var(--accent-gold)"
                        animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.svg>
            )}
        </div>
    );
};

export default SacredIcon;
