import React from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "./Starfield";
import { ConstellationIcon, PlanetRingsIcon } from "./ZodiacIcons";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#07071a]">
      <Starfield />

      {/* Desktop Hero Content - Visible on md and up */}
      <div className="hidden md:block relative z-10 container mx-auto px-4 text-center max-w-3xl">
        {/* Subtle constellation decorations */}
        <div className="absolute -bottom-32 right-10 opacity-[0.04] animate-float-slow">
          <ConstellationIcon className="w-20 h-20 md:w-28 md:h-28" />
        </div>
        <div className="absolute top-1/3 -right-1/4 opacity-[0.03] animate-spin-slow">
          <PlanetRingsIcon className="w-40 h-40 md:w-52 md:h-52" />
        </div>

        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(42_45%_56%_/_0.04)_0%,_transparent_60%)]" />

        <p className="text-primary/70 font-medium tracking-[0.3em] uppercase text-[11px] md:text-xs mb-8 animate-fade-in opacity-0" style={{ animationDelay: "0.2s" }}>
          Vedic Astrology · Numerology · Birth Chart
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: "0.4s" }}>
          Understand Your Life's{" "}
          <span className="text-gold-gradient italic">True Direction</span>
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-12 leading-relaxed animate-fade-in-up opacity-0 font-light" style={{ animationDelay: "0.6s" }}>
          Feeling lost in career, love, or life decisions? Your birth chart holds the answers.
          Get a personalized astrological report that reveals your true path.
        </p>
        <div className="animate-fade-in-up opacity-0" style={{ animationDelay: "0.8s" }}>
          <button
            onClick={() => navigate("/get-report")}
            className="border border-primary/50 text-primary px-10 py-4 rounded-xl text-sm font-semibold uppercase tracking-[0.15em] hover:bg-primary hover:text-primary-foreground transition-all duration-500"
          >
            Get Your Personalized Report Now
          </button>
          <p className="mt-5 text-muted-foreground/60 text-xs tracking-wider">
            Starting at ₹99 · Delivered within 24 hours
          </p>
        </div>
      </div>

      {/* Mobile Hero Content - Visible below 768px */}
      <div className="md:hidden relative z-10 w-full min-h-[100dvh] flex flex-col items-center justify-center px-6 pt-[60px] text-center">
        {/* Top Badge */}
        <div
          className="border border-[rgba(201,168,76,0.4)] rounded-[20px] px-4 py-1.5 mb-6 text-[9px] font-heading tracking-[3px] text-[#c9a84c]"
        >
          ANCIENT WISDOM  •  MODERN CLARITY
        </div>

        {/* Headline */}
        <div className="flex flex-col gap-0 tracking-[1px]">
          <span className="text-[28px] font-heading font-bold text-white leading-[1.1]">
            DECODING YOUR
          </span>
          <span className="text-[#c9a84c] font-heading font-bold block leading-[1.1] text-[38px] min-[375px]:text-[46px] min-[430px]:text-[54px]">
            COSMIC
          </span>
          <span className="text-[#c9a84c] font-heading font-bold block leading-[1.1] text-[38px] min-[375px]:text-[46px] min-[430px]:text-[54px]">
            BLUEPRINT
          </span>
        </div>

        {/* Divider */}
        <div className="w-10 h-[1px] bg-[rgba(201,168,76,0.4)] my-5 mx-auto" />

        {/* Subtext */}
        <p
          className="text-[rgba(232,232,240,0.65)] text-sm leading-[1.7] max-w-[300px] mb-7 mx-auto"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          Your birth chart holds the secrets to your career, love, and life purpose. Discover your true direction today.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate("/get-report")}
          className="w-full max-w-[280px] py-4 px-6 border border-[#c9a84c] bg-transparent text-[#c9a84c] text-[11px] font-heading tracking-[3px] rounded-0 uppercase block mx-auto transition-all active:bg-[#c9a84c] active:text-[#07071a]"
        >
          BEGIN YOUR JOURNEY
        </button>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="animate-bounce text-[#c9a84c] text-xs">↓</div>
          <div className="text-[8px] font-heading tracking-[3px] text-[rgba(232,232,240,0.3)]">
            SCROLL TO EXPLORE
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
