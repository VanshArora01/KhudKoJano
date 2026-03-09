import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/kkj-logo.svg';
import SacredIcon from './SacredIcon';

const LogoSVG = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 300 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="42" style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '28px' }} fill="#c9a84c" letterSpacing="2">KHUD KO JAANO</text>
        <path d="M0 52H300" stroke="#c9a84c" strokeWidth="0.5" strokeOpacity="0.3" />
    </svg>
);

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileOpen]);

    const closeMobile = () => setMobileOpen(false);

    const navLinks = [
        { name: 'The Process', path: '/', isAnchor: true, anchorId: 'how-it-works' },
        { name: 'Philosophy', path: '/about' },

        { name: 'Contact', path: '/contact' },
        { name: 'Terms', path: '/terms' },
    ];

    const handleLinkClick = (link: any) => {
        closeMobile();
        if (link.isAnchor) {
            if (location.pathname === '/') {
                document.getElementById(link.anchorId)?.scrollIntoView({ behavior: 'smooth' });
            } else {
                navigate('/');
                setTimeout(() => {
                    document.getElementById(link.anchorId)?.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            }
        } else {
            navigate(link.path);
        }
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 w-full z-[1050] transition-all duration-500 h-20 md:h-24 flex items-center ${isScrolled ? 'border-b border-[rgba(201,168,76,0.15)] bg-[#07071a]/90 backdrop-blur-md' : 'bg-transparent'}`}
            >
                <div className="max-w-7xl mx-auto w-full px-6 md:px-10 flex items-center justify-between relative">
                    <Link to="/" onClick={closeMobile} className="flex items-center relative z-[1052]">
                        <LogoSVG className="h-[32px] md:h-[44px] w-auto block transition-all hover:opacity-80" />
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-12">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <button
                                    key={link.name}
                                    onClick={() => handleLinkClick(link)}
                                    className={`text-[10px] uppercase tracking-[0.3em] font-medium transition-colors ${isActive ? 'text-[#c9a84c]' : 'text-[rgba(232,232,240,0.8)] hover:text-[#c9a84c]'}`}
                                >
                                    {link.name}
                                </button>
                            );
                        })}
                        <Link
                            to="/details"
                            className="border border-[#c9a84c] text-[#c9a84c] bg-transparent py-2 px-6 text-[10px] uppercase tracking-[0.2em] font-medium transition-all hover:bg-[#c9a84c] hover:text-[#07071a]"
                        >
                            Get Report
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden relative z-[1052] w-10 h-10 flex flex-col items-end justify-center gap-2"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle Menu"
                    >
                        <motion.div
                            animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 10 : 0, width: mobileOpen ? 28 : 28 }}
                            className="h-[2px] w-[28px] bg-[#c9a84c]"
                        />
                        <motion.div
                            animate={{ opacity: mobileOpen ? 0 : 1 }}
                            className="w-[28px] h-[2px] bg-[#c9a84c]"
                        />
                        <motion.div
                            animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -10 : 0, width: mobileOpen ? 28 : 28 }}
                            className="h-[2px] w-[28px] bg-[#c9a84c]"
                        />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-[#05060A] z-[1040] flex flex-col items-center justify-center p-8"
                    >
                        {/* Decorative Background for Mobile Menu */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-accent-gold/20 rounded-full blur-3xl" />
                            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-accent-gold/10 rounded-full blur-3xl" />
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-10">
                            {navLinks.map((link, idx) => (
                                <motion.button
                                    key={link.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => handleLinkClick(link)}
                                    className="text-2xl font-heading uppercase tracking-[0.4em] text-text-secondary hover:text-accent-gold transition-colors"
                                >
                                    {link.name}
                                </motion.button>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Link to="/details" className="btn-gold mt-6" onClick={closeMobile}>
                                    Get Report
                                </Link>
                            </motion.div>
                        </div>

                        {/* Social/Status Mini Bar in Mobile Menu */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="absolute bottom-12 flex flex-col items-center gap-4"
                        >
                            <div className="w-12 h-[1px] bg-accent-gold/20" />
                            <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted">ॐ Khud Ko Jaano</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
