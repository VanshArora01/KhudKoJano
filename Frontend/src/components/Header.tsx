import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoonIcon, StarIcon } from "./ZodiacIcons";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2 group">
          <MoonIcon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
          <span className="font-display text-lg md:text-xl font-semibold text-primary tracking-wide">
            Khud Ko Jaano
          </span>
        </Link>
        <button
          onClick={() => navigate("/get-report")}
          className="flex items-center gap-1.5 border border-primary/40 text-primary px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.15em] hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        >
          <StarIcon className="w-3.5 h-3.5" />
          Get Report
        </button>
      </div>
    </header>
  );
};

export default Header;
