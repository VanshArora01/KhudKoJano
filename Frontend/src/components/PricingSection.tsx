import React from "react";
import { useNavigate } from "react-router-dom";
import { StarIcon, BirthChartIcon } from "./ZodiacIcons";

const plans = [
  {
    id: "standard" as const,
    name: "Standard Analysis",
    price: "₹99",
    delivery: "Within 24 Hours",
    highlight: false,
    features: [
      "Mulank & Bhagyank Analysis",
      "Zodiac Personality Breakdown",
      "Janam Patrika Overview",
      "Yearly Horoscope Insight",
      "Answer to 1 Specific Question",
    ],
  },
  {
    id: "fast" as const,
    name: "Fast Track Analysis",
    price: "₹199",
    delivery: "Within 2 Hours",
    highlight: true,
    features: [
      "Everything in Standard Analysis",
      "Priority Processing",
      "Detailed Remedial Suggestions",
      "Lucky Colors & Numbers",
      "Answer to 1 Specific Question",
    ],
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  const handleSelect = (plan: "standard" | "fast") => {
    navigate("/get-report", { state: { plan } });
  };

  return (
    <section className="relative py-20 md:py-28 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-primary/60 font-medium tracking-[0.25em] uppercase text-[11px] mb-4">
            Choose Your Path
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Select Your <span className="text-gold-gradient italic">Report</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Both plans include a comprehensive personalized analysis crafted by our expert astrologers.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-7 border transition-all duration-500 hover:translate-y-[-2px] ${
                plan.highlight
                  ? "border-primary/40 bg-card"
                  : "border-border bg-card/60"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-[10px] font-semibold px-4 py-1 rounded-full tracking-[0.15em] uppercase">
                    Recommended
                  </span>
                </div>
              )}
              <div className="flex justify-center mb-4 opacity-60">
                {plan.highlight ? (
                  <StarIcon className="w-7 h-7" />
                ) : (
                  <BirthChartIcon className="w-7 h-7" />
                )}
              </div>
              <h3 className="font-display text-lg font-semibold text-center mb-1">
                {plan.name}
              </h3>
              <p className="text-center text-muted-foreground text-xs mb-4">
                Delivery: {plan.delivery}
              </p>
              <p className="text-center font-display text-3xl font-bold text-primary mb-6">
                {plan.price}
              </p>
              <ul className="space-y-2.5 mb-7">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary/60 mt-0.5 shrink-0 text-xs">✦</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelect(plan.id)}
                className={`w-full py-3 rounded-xl text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-300 ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                Choose This Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
