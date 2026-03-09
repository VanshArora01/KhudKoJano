import { Link } from 'react-router-dom';
import logo from '../assets/kkj-logo.svg';

const Footer = () => {
    return (
        <footer className="relative bg-[#07071a] border-t border-accent-gold/20 pt-[60px] px-8 md:px-[80px] pb-8 overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 items-start mb-16">
                {/* LEFT COLUMN — Logo + tagline */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <img
                        src={logo}
                        alt="Khud Ko Jaano"
                        className="h-9 object-contain opacity-[0.85]"
                    />
                    <p className="text-[12px] text-text-muted/40 mt-3 font-light leading-relaxed">
                        Ancient Wisdom • Modern Clarity
                    </p>
                </div>

                {/* CENTER COLUMN — Contact */}
                <div className="flex flex-col items-center text-center">
                    <h3 className="text-[11px] font-heading text-accent-gold tracking-[3px] uppercase mb-8">GET IN TOUCH</h3>
                    <div className="space-y-4">
                        <a
                            href="mailto:khudkojano@gmail.com"
                            className="block text-accent-gold text-[14px] no-underline hover:opacity-80 transition-opacity"
                        >
                            khudkojano@gmail.com
                        </a>
                        <a
                            href="https://wa.me/917009771810"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-accent-gold text-[14px] no-underline hover:opacity-80 transition-opacity"
                        >
                            +91 70097 71810
                        </a>
                    </div>
                </div>

                {/* RIGHT COLUMN — Quick links */}
                <div className="flex flex-col items-center md:items-end text-center md:text-right">
                    <h3 className="text-[11px] font-heading text-accent-gold tracking-[3px] uppercase mb-8">QUICK LINKS</h3>
                    <div className="flex flex-col gap-3">
                        <Link to="/" className="text-[11px] uppercase tracking-widest text-text-muted hover:text-accent-gold transition-colors">Home</Link>
                        <Link to="/details" className="text-[11px] uppercase tracking-widest text-text-muted hover:text-accent-gold transition-colors">Get Report</Link>
                        <Link to="/privacy-policy" className="text-[11px] uppercase tracking-widest text-text-muted hover:text-accent-gold transition-colors">Privacy Policy</Link>
                        <Link to="/refund-policy" className="text-[11px] uppercase tracking-widest text-text-muted hover:text-accent-gold transition-colors">Refund Policy</Link>
                        <Link to="/terms" className="text-[11px] uppercase tracking-widest text-text-muted hover:text-accent-gold transition-colors">Terms</Link>
                    </div>
                </div>
            </div>

            {/* BOTTOM BAR (full width, border-top gold) */}
            <div className="max-w-7xl mx-auto pt-8 border-t border-accent-gold/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-[11px] font-heading text-[#c0c0c8]/40 uppercase tracking-widest">
                    © 2025 Khud Ko Jaano. All rights reserved.
                </p>
                <p className="text-[11px] font-heading text-[#c0c0c8]/40 uppercase tracking-widest">
                    khudkojano@gmail.com
                </p>
            </div>
        </footer>
    );
};

export default Footer;
