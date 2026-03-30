import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/stores/cartStore';
import KiraNeyLogo from '@/components/KiraNeyLogo';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const setLoggedIn = useAppStore((s) => s.setLoggedIn);
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);

  if (isLoggedIn) {
    navigate('/home', { replace: true });
    return null;
  }

  const validatePhone = (value: string) => /^[6-9]\d{9}$/.test(value);

  const handleSendOtp = () => {
    if (otpCooldown > 0) {
      toast.error(`Please wait ${otpCooldown} seconds`);
      return;
    }
    if (!validatePhone(phone)) {
      toast.error('Enter a valid 10-digit phone number starting with 6-9');
      return;
    }
    setOtpSent(true);
    toast.success('OTP sent to +91 ' + phone);
    setOtpCooldown(30);
    const interval = setInterval(() => {
      setOtpCooldown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
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
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length !== 4) {
      toast.error('Enter complete OTP');
      return;
    }
    setLoggedIn(phone);
    toast.success('Welcome to KiraNey!');
    navigate('/home', { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-10 flex flex-col items-center gap-3"
      >
        <KiraNeyLogo size={80} />
        <h1 className="text-3xl font-bold text-foreground">KiraNey</h1>
        <p className="text-muted-foreground">Ghar baithe kirana</p>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-sm space-y-6"
      >
        {!otpSent ? (
          <>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Phone Number</label>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-surface p-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter phone number"
                  className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <button
              onClick={handleSendOtp}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent p-3.5 font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            >
              Send OTP
              <ArrowRight className="h-5 w-5" />
            </button>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Enter OTP sent to +91 {phone}</label>
              <div className="flex justify-center gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="tel"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value.replace(/\D/g, ''))}
                    className="h-14 w-14 rounded-lg border border-border bg-surface text-center text-2xl font-bold text-foreground outline-none focus:border-accent"
                  />
                ))}
              </div>
            </div>
            <button
              onClick={handleVerify}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent p-3.5 font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            >
              Verify OTP
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => setOtpSent(false)}
              className="w-full text-center text-sm text-muted-foreground"
            >
              Change number
            </button>
            {otpCooldown > 0 ? (
              <p className="text-center text-xs text-muted-foreground">Resend OTP in {otpCooldown}s</p>
            ) : (
              <button onClick={handleSendOtp} className="w-full text-center text-sm text-accent">
                Resend OTP
              </button>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
