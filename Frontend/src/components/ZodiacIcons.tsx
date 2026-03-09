import React from "react";

const STROKE = "hsl(42 45% 56%)";

export const MoonIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={STROKE} strokeWidth="1.2" className={className}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export const SunIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={STROKE} strokeWidth="1.2" className={className}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

export const StarIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={STROKE} strokeWidth="1.2" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const ZodiacWheelIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={STROKE} strokeWidth="1" className={className}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </svg>
);

export const ConstellationIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={STROKE} strokeWidth="1.2" className={className}>
    <circle cx="5" cy="5" r="1.5" />
    <circle cx="19" cy="3" r="1" />
    <circle cx="12" cy="10" r="1.5" />
    <circle cx="20" cy="14" r="1" />
    <circle cx="8" cy="19" r="1.5" />
    <circle cx="16" cy="20" r="1" />
    <line x1="5" y1="5" x2="12" y2="10" />
    <line x1="12" y1="10" x2="19" y2="3" />
    <line x1="12" y1="10" x2="20" y2="14" />
    <line x1="12" y1="10" x2="8" y2="19" />
    <line x1="8" y1="19" x2="16" y2="20" />
  </svg>
);

export const PlanetRingsIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={STROKE} strokeWidth="1.2" className={className}>
    <circle cx="12" cy="12" r="5" />
    <ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(-30 12 12)" />
  </svg>
);

export const BirthChartIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={STROKE} strokeWidth="1" className={className}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="8" />
    <line x1="12" y1="16" x2="12" y2="22" />
    <line x1="2" y1="12" x2="8" y2="12" />
    <line x1="16" y1="12" x2="22" y2="12" />
  </svg>
);

export const ChartAnalyzedIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={STROKE} strokeWidth="1.2" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <circle cx="12" cy="15" r="3" />
    <line x1="12" y1="12" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12" y2="18" />
    <line x1="9" y1="15" x2="10" y2="15" />
    <line x1="14" y1="15" x2="15" y2="15" />
  </svg>
);

export const SatisfactionIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={STROKE} strokeWidth="1.2" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export const TrustIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={STROKE} strokeWidth="1.2" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v4" />
    <circle cx="12" cy="15" r="0.5" fill={STROKE} />
  </svg>
);
