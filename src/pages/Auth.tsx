import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type Step = "phone" | "otp" | "name";

const Auth = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      toast.success("OTP sent! (Use any 4 digits)");
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }

    if (newOtp.every((d) => d !== "")) {
      setTimeout(() => {
        setStep("name");
      }, 500);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleComplete = () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    localStorage.setItem("kiraney-user", JSON.stringify({ phone, name }));
    toast.success("Welcome to Kiraney!");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background px-5 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center gap-3">
          {step !== "phone" && (
            <button onClick={() => setStep(step === "name" ? "otp" : "phone")}>
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
          )}
        </div>

        <div className="text-center space-y-3">
          <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mx-auto">
            <ShoppingBag className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Kiraney</h1>
        </div>

        <AnimatePresence mode="wait">
          {step === "phone" && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <p className="text-sm text-muted-foreground mb-3 text-center">
                  Enter your phone number to continue
                </p>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
                  <span className="text-sm font-medium text-foreground">🇮🇳 +91</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="Phone number"
                    type="tel"
                    autoFocus
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  />
                </div>
              </div>
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    Sending OTP...
                  </motion.span>
                ) : (
                  "Send OTP"
                )}
              </button>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground text-center">
                Enter the OTP sent to +91 {phone}
              </p>
              <div className="flex justify-center gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    type="tel"
                    maxLength={1}
                    autoFocus={i === 0}
                    className="h-14 w-14 rounded-xl border-2 border-border bg-card text-center text-xl font-bold text-foreground outline-none focus:border-primary transition-colors"
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Demo: Enter any 4 digits
              </p>
            </motion.div>
          )}

          {step === "name" && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground text-center">
                What should we call you?
              </p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoFocus
                className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
              />
              <button
                onClick={handleComplete}
                className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground"
              >
                Get Started
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Auth;
