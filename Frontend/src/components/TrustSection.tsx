import React from "react";
import { ChartAnalyzedIcon, SatisfactionIcon, TrustIcon } from "./ZodiacIcons";

const stats = [
  {
    icon: <ChartAnalyzedIcon className="w-9 h-9" />,
    number: "10,000+",
    label: "Charts Analyzed",
    desc: "Precise birth chart readings delivered to seekers worldwide",
  },
  {
    icon: <SatisfactionIcon className="w-9 h-9" />,
    number: "98%",
    label: "Satisfaction",
    desc: "Our clients trust us with their most important life questions",
  },
  {
    icon: <TrustIcon className="w-9 h-9" />,
    number: "5+ Years",
    label: "Trusted Insights",
    desc: "Expert astrologers with decades of Vedic knowledge",
  },
];

const TrustSection = () => {
  return (
    <section className="relative py-20 md:py-24">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-3 gap-5 md:gap-6 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-card/40 border border-border/60 rounded-2xl p-7 text-center transition-all duration-500 hover:border-primary/20"
            >
              <div className="flex justify-center mb-4 opacity-50">
                {stat.icon}
              </div>
              <p className="font-display text-2xl md:text-3xl font-bold text-primary mb-1">
                {stat.number}
              </p>
              <p className="font-medium text-foreground/80 text-xs tracking-[0.1em] uppercase mb-2">
                {stat.label}
              </p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
