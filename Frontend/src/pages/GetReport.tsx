import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Starfield from "../components/Starfield";

export interface FormData {
  name: string;
  email: string;
  phone: string;
  dob: string;
  tob: string;
  pob: string;
  currentLocation: string;
  question: string;
}

const planDetails = {
  standard: { name: "Standard Analysis", price: "₹99", delivery: "Within 24 Hours" },
  fast: { name: "Fast Track Analysis", price: "₹199", delivery: "Within 2 Hours" },
};

const GetReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialPlan = (location.state as any)?.plan || "standard";
  const [selectedPlan, setSelectedPlan] = useState<"standard" | "fast">(initialPlan);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    name: "", email: "", phone: "",
    dob: "", tob: "", pob: "", currentLocation: "", question: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const update = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validateStep = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (step === 1) {
      if (!form.name.trim()) newErrors.name = "Name is required";
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Valid email required";
      if (!form.phone.trim() || form.phone.length < 10) newErrors.phone = "Valid phone required";
    } else if (step === 2) {
      if (!form.dob) newErrors.dob = "Date of birth is required";
      if (!form.tob) newErrors.tob = "Time of birth is required";
      if (!form.pob.trim()) newErrors.pob = "Place of birth is required";
      if (!form.currentLocation.trim()) newErrors.currentLocation = "Current location is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => { if (validateStep()) setStep((s) => Math.min(s + 1, 3)); };
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = () => {
    navigate("/payment", { state: { plan: selectedPlan, formData: form } });
  };

  const plan = planDetails[selectedPlan];
  const inputClass =
    "w-full bg-secondary/30 border border-border/60 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 transition-all duration-300 text-sm";
  const errorClass = "text-destructive text-xs mt-1";
  const labelClass = "text-xs font-medium text-foreground/60 mb-1.5 block uppercase tracking-[0.1em]";

  return (
    <main className="bg-background min-h-screen grain-overlay">
      <Header />
      <div className="relative min-h-screen flex items-start justify-center pt-28 pb-16 px-4">
        <Starfield />

        <div className="relative z-10 w-full max-w-[700px]">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Your <span className="text-gold-gradient italic">Details</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Fill in your details for a personalized report.
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${s <= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/50 text-muted-foreground/50"
                    }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-10 md:w-16 h-px transition-all duration-500 ${s < step ? "bg-primary/60" : "bg-border/40"}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Form card */}
            <div className="flex-1 bg-card/60 border border-border/50 rounded-2xl p-6 md:p-8 card-glow">
              {step === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input className={inputClass} placeholder="Enter your full name" value={form.name} onChange={(e) => update("name", e.target.value)} />
                    {errors.name && <p className={errorClass}>{errors.name}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input className={inputClass} type="email" placeholder="seeker@stars.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
                    {errors.email && <p className={errorClass}>{errors.email}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input className={inputClass} type="tel" placeholder="+91 70097 71810" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                    {errors.phone && <p className={errorClass}>{errors.phone}</p>}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <label className={labelClass}>Date of Birth</label>
                    <input className={inputClass} type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} />
                    {errors.dob && <p className={errorClass}>{errors.dob}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Time of Birth</label>
                    <input className={inputClass} type="time" value={form.tob} onChange={(e) => update("tob", e.target.value)} />
                    {errors.tob && <p className={errorClass}>{errors.tob}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Place of Birth</label>
                    <input className={inputClass} placeholder="City, State" value={form.pob} onChange={(e) => update("pob", e.target.value)} />
                    {errors.pob && <p className={errorClass}>{errors.pob}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Current Location</label>
                    <input className={inputClass} placeholder="Where you live now" value={form.currentLocation} onChange={(e) => update("currentLocation", e.target.value)} />
                    {errors.currentLocation && <p className={errorClass}>{errors.currentLocation}</p>}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <label className={labelClass}>Your Specific Question</label>
                    <textarea
                      className={`${inputClass} min-h-[120px] resize-none`}
                      placeholder="What area of your life do you need clarity on?"
                      value={form.question}
                      onChange={(e) => update("question", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                {step > 1 ? (
                  <button onClick={prevStep} className="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors uppercase tracking-[0.1em]">
                    ← Back
                  </button>
                ) : (
                  <div />
                )}
                {step < 3 ? (
                  <button
                    onClick={nextStep}
                    className="border border-primary/40 text-primary px-7 py-3 rounded-xl text-xs font-semibold uppercase tracking-[0.12em] hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="bg-primary text-primary-foreground px-7 py-3 rounded-xl text-xs font-semibold uppercase tracking-[0.12em] hover:opacity-90 transition-all duration-300"
                  >
                    Proceed to Payment
                  </button>
                )}
              </div>
            </div>

            {/* Plan summary sidebar */}
            <div className="lg:w-[220px] shrink-0">
              <div className="bg-card/40 border border-border/40 rounded-2xl p-5">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 mb-3">Selected Plan</p>
                <p className="font-display font-semibold text-sm mb-1">{plan.name}</p>
                <p className="font-display font-bold text-2xl text-primary mb-2">{plan.price}</p>
                <p className="text-muted-foreground text-xs mb-3">{plan.delivery}</p>
                <button
                  onClick={() => setSelectedPlan(selectedPlan === "standard" ? "fast" : "standard")}
                  className="text-primary/60 text-[11px] hover:text-primary transition-colors"
                >
                  Switch to {selectedPlan === "standard" ? "Fast Track" : "Standard"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default GetReport;
