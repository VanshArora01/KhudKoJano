import React, { useState } from "react";

interface PaymentModalProps {
  plan: "standard" | "fast";
  onClose: () => void;
  onSuccess: () => void;
}

const planInfo = {
  standard: { name: "Standard Analysis", price: "₹99", amount: 99 },
  fast: { name: "Fast Track Analysis", price: "₹199", amount: 199 },
};

const PaymentModal = ({ plan, onClose, onSuccess }: PaymentModalProps) => {
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const info = planInfo[plan];

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      onSuccess();
    }, 2500);
  };

  const methods = [
    { id: "upi", label: "UPI", icon: "📱" },
    { id: "card", label: "Card", icon: "💳" },
    { id: "wallet", label: "Wallet", icon: "👛" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-md p-8 card-glow animate-scale-in">
        {processing ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-6" />
            <p className="font-display text-xl font-semibold mb-2">Processing your birth chart…</p>
            <p className="text-muted-foreground text-sm">Please wait while we confirm your payment.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <p className="text-muted-foreground text-sm mb-1">Pay for</p>
              <p className="font-display text-lg font-semibold">{info.name}</p>
              <p className="font-display text-4xl font-bold text-primary mt-2">{info.price}</p>
            </div>

            <div className="flex gap-3 mb-6">
              {methods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id)}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all duration-300 ${
                    selectedMethod === m.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <span className="block text-lg mb-1">{m.icon}</span>
                  {m.label}
                </button>
              ))}
            </div>

            {selectedMethod === "upi" && (
              <div className="mb-6">
                <input
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                  placeholder="Enter UPI ID (e.g. name@upi)"
                  defaultValue=""
                />
              </div>
            )}
            {selectedMethod === "card" && (
              <div className="space-y-3 mb-6">
                <input className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm" placeholder="Card Number" />
                <div className="grid grid-cols-2 gap-3">
                  <input className="bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm" placeholder="MM/YY" />
                  <input className="bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm" placeholder="CVV" />
                </div>
              </div>
            )}
            {selectedMethod === "wallet" && (
              <div className="space-y-2 mb-6">
                {["Paytm", "PhonePe", "Amazon Pay"].map((w) => (
                  <button key={w} className="w-full py-3 border border-border rounded-xl text-sm text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all">
                    {w}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={handlePay}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold gold-glow hover:opacity-90 transition-all text-sm tracking-wide"
            >
              Pay {info.price} Now
            </button>
            <button
              onClick={onClose}
              className="w-full mt-3 text-muted-foreground text-sm hover:text-foreground transition-colors text-center"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
