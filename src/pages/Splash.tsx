import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import KiraNeyLogo from '@/components/KiraNeyLogo';

const Splash = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => navigate('/login', { replace: true }), 2000);
    const interval = setInterval(() => setProgress((p) => Math.min(p + 5, 100)), 100);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-[hsl(125,30%,8%)] to-background">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center gap-4"
      >
        <KiraNeyLogo size={120} />
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-bold text-foreground"
        >
          KiraNey
        </motion.h1>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-muted-foreground text-lg"
        >
          Ghar baithe kirana
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 w-48 h-1 rounded-full bg-surface overflow-hidden"
      >
        <div
          className="h-full rounded-full bg-accent transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </motion.div>
    </div>
  );
};

export default Splash;
