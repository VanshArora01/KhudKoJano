import React, { useState } from "react";

interface MultiStepFormProps {
  selectedPlan: "standard" | "fast";
  onChangePlan: (plan: "standard" | "fast") => void;
  onSubmit: (data: FormData) => void;
}

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

const MultiStepForm = ({ selectedPlan, onChangePlan, onSubmit }: MultiStepFormProps) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    dob: "",
    tob: "",
    pob: "",
    currentLocation: "",
    question: "",
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

  const nextStep = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = () => {
    onSubmit(form);
  };

  const plan = planDetails[selectedPlan];
  const inputClass =
    "w-full bg-secondary/50 border border-border rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all duration-300 text-sm";
  const errorClass = "text-destructive text-xs mt-1";
  const labelClass = "text-sm font-medium text-foreground/80 mb-1.5 block";

  return (
    <section id="form" className="relative py-20 md:py-28">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <p className="text-primary font-medium tracking-[0.25em] uppercase text-xs mb-3">
            Almost There
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Your <span className="text-gold-gradient italic">Details</span>
          </h2>
          <p className="text-muted-foreground text-sm">
            Fill in your details so our astrologers can prepare your personalized report.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${s <= step
                  ? "bg-primary text-primary-foreground gold-glow-sm"
                  : "bg-secondary text-muted-foreground"
                  }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 md:w-20 h-0.5 transition-all duration-500 ${s < step ? "bg-primary" : "bg-border"
                    }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6 md:p-10 card-glow">
          {/* Step 1 */}
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

          {/* Step 2 */}
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

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className={labelClass}>Your Specific Question</label>
                <textarea
                  className={`${inputClass} min-h-[120px] resize-none`}
                  placeholder="What area of your life do you need clarity on? (Career, Love, Health, Finance, etc.)"
                  value={form.question}
                  onChange={(e) => update("question", e.target.value)}
                />
              </div>

              {/* Plan summary */}
              <div className="border border-primary/30 rounded-xl p-5 bg-secondary/30">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-display font-semibold text-lg">{plan.name}</p>
                  <p className="font-display font-bold text-2xl text-primary">{plan.price}</p>
                </div>
                <p className="text-muted-foreground text-sm">
                  Delivery: {plan.delivery}
                </p>
                <button
                  onClick={() => onChangePlan(selectedPlan === "standard" ? "fast" : "standard")}
                  className="text-primary text-xs mt-2 hover:underline"
                >
                  Switch to {selectedPlan === "standard" ? "Fast Track" : "Standard"} plan
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <button
                onClick={prevStep}
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}
            {step < 3 ? (
              <button
                onClick={nextStep}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold text-sm gold-glow-sm hover:opacity-90 transition-all"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold text-sm gold-glow hover:opacity-90 transition-all"
              >
                Proceed to Payment
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MultiStepForm;
